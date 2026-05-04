import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageList } from "../components/messageList";
import { MessageContainer } from "../components/messageContainer";

const unirMensajes = (actuales, nuevos) => {
    const mapa = new Map();

    [...actuales, ...nuevos].forEach((mensaje, index) => {
        if (!mensaje) return;

        const clave = mensaje._id || `${mensaje.remitenteId}-${mensaje.destinatarioId}-${mensaje.texto}-${mensaje.fecha || index}`;

        mapa.set(clave, mensaje);
    });

    return Array.from(mapa.values());
};

export const ChatPage = ({ token, miUsuario, onCerrarSesion }) => {

    const socketRef = useRef(null);
    const [mensajes, setMensajes] = useState([]);
    const [contactoActivoId, setContactoActivoId] = useState("");
    const [usuariosConectados, setUsuariosConectados] = useState([]);
    const [contactosDb, setContactosDb] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!token) return;

        const newSocket = io('https://chat-vrjv.onrender.com/', {
            auth: { token: token }
        });

        socketRef.current = newSocket;

        newSocket.on('historial_mensajes', (historial) => {
            setMensajes(unirMensajes([], historial));
        });
        newSocket.on('recibir_mensaje', (nuevo) => {
            setMensajes((prev) => unirMensajes(prev, [nuevo]));
        });
        newSocket.on('usuarios_conectados', (usuarios) => setUsuariosConectados(usuarios));

        newSocket.on('chat_limpiado', ({ usuario1, usuario2 }) => {
            setMensajes(prev => prev.filter(msg => {
                const esEsteChat = (msg.remitenteId === usuario1 && msg.destinatarioId === usuario2) ||
                                (msg.remitenteId === usuario2 && msg.destinatarioId === usuario1);
                return !esEsteChat; 
            }));
        });

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    useEffect(() => {
        if (miUsuario) {
            fetch('https://chat-vrjv.onrender.com/api/usuarios')
                .then(res => res.json())
                .then(data => {
                    const misContactos = data.filter(u => u._id !== miUsuario.id);
                    setContactosDb(misContactos.map(c => ({ id: c._id, nombre: c.nombre })));
                })
                .catch(err => console.error("Error cargando usuarios:", err));
        }
    }, [miUsuario]);

    const contactoActivo = contactosDb.find((contacto) => contacto.id === contactoActivoId) || contactosDb[0] || null;

    useEffect(() => {
        if (socketRef.current && miUsuario && contactoActivo) {
            socketRef.current.emit('solicitar_historial', { 
                usuarioId: miUsuario.id, 
                contactoId: contactoActivo.id 
            });
            setSearchTerm("");
            setIsSearchOpen(false);
        }
    }, [contactoActivoId, socketRef, miUsuario, contactoActivo]);

    const enviarMensaje = (texto) => {
        if (!miUsuario || !contactoActivo || !socketRef.current) return;

        const nuevoMensaje = {
            remitenteId: miUsuario.id,
            remitenteNombre: miUsuario.nombre,
            destinatarioId: contactoActivo.id,
            texto
        };

        socketRef.current.emit("enviar_mensaje", nuevoMensaje);
    };

    const borrarParaMi = () => {
        if (!miUsuario || !contactoActivo || !socketRef.current) return;
        
        socketRef.current.emit('borrar_para_mi', {
            usuarioId: miUsuario.id,
            contactoId: contactoActivo.id
        });

        setMensajes(prev => prev.filter(msg => {
            const esEsteChat = (msg.remitenteId === miUsuario.id && msg.destinatarioId === contactoActivo.id) ||
                                (msg.remitenteId === contactoActivo.id && msg.destinatarioId === miUsuario.id);
            return !esEsteChat; 
        }));
    };

    const borrarParaTodos = () => {
        if (!miUsuario || !contactoActivo || !socketRef.current) return;
        
        if (window.confirm("¿Seguro que deseas eliminar todos los mensajes para ambos? Esta acción no se puede deshacer.")) {
            socketRef.current.emit('borrar_para_todos', {
                usuarioId: miUsuario.id,
                contactoId: contactoActivo.id
            });
            
            setMensajes(prev => prev.filter(msg => {
                const esEsteChat = (msg.remitenteId === miUsuario.id && msg.destinatarioId === contactoActivo.id) ||
                                    (msg.remitenteId === contactoActivo.id && msg.destinatarioId === miUsuario.id);
                return !esEsteChat;
            }));
        }
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

    if (!miUsuario) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center px-[30px] bg-slate-50">
            <div className="h-[600px] w-full max-w-[1200px] flex border-2 border-[#d1dbe4] rounded-lg overflow-hidden bg-white shadow-sm">
                <MessageList
                    contacts={contactosDb}
                    contactoActivo={contactoActivo}
                    onSelectContact={(contacto) => setContactoActivoId(contacto.id)}
                    onlineUsers={usuariosConectados}
                    getPreview={obtenerUltimoMensaje}
                    miUsuario={miUsuario}
                    onChangeUser={onCerrarSesion}
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
                    onBorrarParaMi={borrarParaMi}
                    onBorrarParaTodos={borrarParaTodos}
                />
            </div>
        </div>
    );
};