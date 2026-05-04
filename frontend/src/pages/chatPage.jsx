import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MessageList } from "../components/messageList";
import { MessageContainer } from "../components/messageContainer";

const socket = io('https://chat-vrjv.onrender.com/');
const STORAGE_KEY = "chat-user-id";
const USUARIOS = [
    { id: "jose", nombre: "Jose" },
    { id: "oswaldo", nombre: "Oswaldo" }
];

const normalizarMensaje = (mensaje) => {
    if (!mensaje) return null;

    if (mensaje.remitenteId && mensaje.destinatarioId) {
        return mensaje;
    }

    const remitenteNombre = mensaje.remitenteNombre || mensaje.remitente || "";
    const remitenteId = remitenteNombre.toLowerCase() === "oswaldo" ? "oswaldo" : "jose";
    const destinatarioId = remitenteId === "jose" ? "oswaldo" : "jose";

    return {
        ...mensaje,
        remitenteId,
        remitenteNombre: remitenteNombre || (remitenteId === "jose" ? "Jose" : "Oswaldo"),
        destinatarioId
    };
};

const unirMensajes = (actuales, nuevos) => {
    const mapa = new Map();

    [...actuales, ...nuevos].forEach((mensaje, index) => {
        const normalizado = normalizarMensaje(mensaje);
        if (!normalizado) return;

        const clave = normalizado._id
            || normalizado.clientTempId
            || `${normalizado.remitenteId}-${normalizado.destinatarioId}-${normalizado.texto}-${normalizado.fecha || index}`;

        mapa.set(clave, normalizado);
    });

    return Array.from(mapa.values());
};

export const ChatPage = () => {
    const [mensajes, setMensajes] = useState([]);
    const [miUsuarioId, setMiUsuarioId] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
    const [contactoActivoId, setContactoActivoId] = useState("");
    const [usuariosConectados, setUsuariosConectados] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const miUsuario = USUARIOS.find((usuario) => usuario.id === miUsuarioId) || null;
    const contactos = miUsuario
        ? USUARIOS.filter((usuario) => usuario.id !== miUsuario.id)
        : [];
    const contactoActivo = contactos.find((contacto) => contacto.id === contactoActivoId) || contactos[0] || null;

    useEffect(() => {
        socket.on('historial_mensajes', (historial) => {
            setMensajes(unirMensajes([], historial));
        });
        socket.on('recibir_mensaje', (nuevo) => {
            setMensajes((prev) => unirMensajes(prev, [nuevo]));
        });
        socket.on('usuarios_conectados', (usuarios) => setUsuariosConectados(usuarios));

        return () => {
            socket.off('historial_mensajes');
            socket.off('recibir_mensaje');
            socket.off('usuarios_conectados');
        };
    }, []);


    useEffect(() => {
        if (!miUsuario) return;

        const registrarUsuario = () => {
            socket.emit('registrar_usuario', miUsuario.id);
        };

        registrarUsuario();
        socket.on('connect', registrarUsuario);

        return () => {
            socket.off('connect', registrarUsuario);
        };
    }, [miUsuario]);

    const seleccionarUsuario = (userId) => {
        localStorage.setItem(STORAGE_KEY, userId);
        setMiUsuarioId(userId);
        setSearchTerm("");
        setIsSearchOpen(false);
    };

    const cambiarUsuario = () => {
        localStorage.removeItem(STORAGE_KEY);
        setMiUsuarioId("");
        setContactoActivoId("");
        setSearchTerm("");
        setIsSearchOpen(false);
    };

    const enviarMensaje = (texto) => {
        if (!miUsuario || !contactoActivo) return;

        const nuevoMensaje = {
            remitenteId: miUsuario.id,
            remitenteNombre: miUsuario.nombre,
            destinatarioId: contactoActivo.id,
            texto
        };

        socket.emit("enviar_mensaje", nuevoMensaje);
    };

    const obtenerUltimoMensaje = (contactId) => {
        const mensajesDelContacto = mensajes.filter((msg) => {
            const enviadoPorMi = msg.remitenteId === miUsuario?.id && msg.destinatarioId === contactId;
            const recibidoDeContacto = msg.remitenteId === contactId && msg.destinatarioId === miUsuario?.id;
            return enviadoPorMi || recibidoDeContacto;
        });

        return mensajesDelContacto.at(-1)?.texto || "Sin mensajes todavia";
    };

    const mensajesDelChatActivo = mensajes.filter((msg) => {
        if (!miUsuario || !contactoActivo) return false;

        const yoEscribi = msg.remitenteId === miUsuario.id && msg.destinatarioId === contactoActivo.id;
        const otroEscribio = msg.remitenteId === contactoActivo.id && msg.destinatarioId === miUsuario.id;
        return yoEscribi || otroEscribio;
    });

    const mensajesFiltrados = mensajesDelChatActivo.filter((msg) =>
        msg.texto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!miUsuario) {
        return (
            <div className="min-h-screen flex items-center justify-center px-[30px]">
                <div className="w-full max-w-[560px] rounded-2xl border-2 border-[#d1dbe4] bg-white p-8 shadow-sm">
                    <p className="text-[28px] font-bold text-[#477ea0]">Elegir usuario</p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {USUARIOS.map((usuario) => (
                            <button
                                key={usuario.id}
                                type="button"
                                onClick={() => seleccionarUsuario(usuario.id)}
                                className="rounded-xl border-2 border-[#d1dbe4] bg-slate-50 px-4 py-6 text-left transition hover:border-[#6daad7] hover:bg-[#e9f7ff] cursor-pointer"
                            >
                                <p className="text-[18px] font-bold text-slate-800">{usuario.nombre}</p>
                                <p className="mt-1 text-[13px] text-slate-500">Entrar como {usuario.nombre}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-auto flex items-center justify-center ml-[30px] mr-[30px]">
            <div className="h-[600px] w-[1200px] flex items-center justify-center border-2 border-[#d1dbe4] rounded-lg overflow-hidden">
                <MessageList
                    contacts={contactos}
                    contactoActivo={contactoActivo}
                    onSelectContact={(contacto) => setContactoActivoId(contacto.id)}
                    onlineUsers={usuariosConectados}
                    getPreview={obtenerUltimoMensaje}
                    miUsuario={miUsuario}
                    onChangeUser={cambiarUsuario}
                />
                <MessageContainer
                    mensajes={mensajesFiltrados}
                    miUsuario={miUsuario}
                    contactoActivo={contactoActivo}
                    contactoOnline={usuariosConectados.includes(contactoActivo?.id)}
                    onEnviar={enviarMensaje}
                    isSearchOpen={isSearchOpen}
                    onOpenSearch={() => setIsSearchOpen(true)}
                    onCloseSearch={() => setIsSearchOpen(false)}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>
        </div>
    );
};
