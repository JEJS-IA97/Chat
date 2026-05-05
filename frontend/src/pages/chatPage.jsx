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

    const [noLeidos, setNoLeidos] = useState({}); 
    const chatActivoRef = useRef(contactoActivoId);
    const [previews, setPreviews] = useState({});

    useEffect(() => {
        chatActivoRef.current = contactoActivoId;
    }, [contactoActivoId]);

    useEffect(() => {
        const total = Object.values(noLeidos).reduce((suma, cantidad) => suma + cantidad, 0);
        if (total > 0) {
            document.title = `(${total}) Nuevo mensaje`;
        } else {
            document.title = "Mi Chat App";
        }
    }, [noLeidos]);

    useEffect(() => {
        if (!token) return;

        const newSocket = io('https://chat-vrjv.onrender.com/', {
            auth: { token: token }
        });

        socketRef.current = newSocket;

        newSocket.on('historial_mensajes', (historial) => {
            setMensajes(unirMensajes([], historial));

            if (historial.length > 0) {
                const ultimo = historial[historial.length - 1];
                const contactId = ultimo.remitenteId === miUsuario.id ? ultimo.destinatarioId : ultimo.remitenteId;
                const prefijo = ultimo.remitenteId === miUsuario.id ? "Tú" : ultimo.remitenteNombre;
                
                setPreviews(prev => ({ ...prev, [contactId]: `${prefijo}: ${ultimo.texto}` }));
            }
        });

        newSocket.on('recibir_mensaje', (nuevo) => {
            setMensajes((prev) => unirMensajes(prev, [nuevo]));

            const contactId = nuevo.remitenteId === miUsuario?.id ? nuevo.destinatarioId : nuevo.remitenteId;
            const prefijo = nuevo.remitenteId === miUsuario?.id ? "Tú" : nuevo.remitenteNombre;
            setPreviews(prev => ({ ...prev, [contactId]: `${prefijo}: ${nuevo.texto}` }));

            if (nuevo.remitenteId !== miUsuario?.id && chatActivoRef.current !== nuevo.remitenteId) {
                const audio = new Audio('/alerta.mp3');
                audio.play().catch(err => console.log("El navegador bloqueó el autoplay", err));

                setNoLeidos(prev => ({
                    ...prev,
                    [nuevo.remitenteId]: (prev[nuevo.remitenteId] || 0) + 1
                }));
            }
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
    }, [token, miUsuario]);

useEffect(() => {
        if (miUsuario) {
            fetch(`https://chat-vrjv.onrender.com/api/usuarios/${miUsuario.id}`)
                .then(res => res.json())
                .then(data => {
                    // Como el backend ya filtró y nos manda solo el array de contactos, lo guardamos directo
                    if (Array.isArray(data)) {
                        setContactosDb(data.map(c => ({ id: c._id, nombre: c.nombre })));
                    }
                })
                .catch(err => console.error("Error cargando contactos:", err));
        }
    }, [miUsuario]);

    const contactoActivo = contactosDb.find((contacto) => contacto.id === contactoActivoId) || contactosDb[0] || null;

    const agregarContacto = async (email) => {
        try {
            const response = await fetch('https://chat-vrjv.onrender.com/api/contactos/agregar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ miId: miUsuario.id, emailContacto: email })
            });
            const data = await response.json();
            
            if (response.ok) {
                // Si funciona, recargamos la lista de contactos al instante
                const resUsers = await fetch(`https://chat-vrjv.onrender.com/api/usuarios/${miUsuario.id}`);
                const dataUsers = await resUsers.json();
                if (Array.isArray(dataUsers)) {
                    setContactosDb(dataUsers.map(c => ({ id: c._id, nombre: c.nombre })));
                }
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Fallo en la petición de agregar contacto:", error);
            alert("Error de conexión al agregar contacto. Revisa la consola.");
        }
    };

    useEffect(() => {
        if (socketRef.current && miUsuario && contactoActivo) {
            socketRef.current.emit('solicitar_historial', { 
                usuarioId: miUsuario.id, 
                contactoId: contactoActivo.id 
            });
            setSearchTerm("");
            setIsSearchOpen(false);
        }
    }, [contactoActivoId, miUsuario, contactoActivo]); 

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
        return previews[contactId] || "Clic para ver mensajes";
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
                    onSelectContact={(contacto) => {
                        setContactoActivoId(contacto.id);
                        setSearchTerm("");
                        setIsSearchOpen(false);
                        setNoLeidos(prev => ({ ...prev, [contacto.id]: 0 }));
                    }}
                    onlineUsers={usuariosConectados}
                    getPreview={obtenerUltimoMensaje}
                    miUsuario={miUsuario}
                    onCerrarSesion={onCerrarSesion}
                    noLeidos={noLeidos}
                    onAgregarContacto={agregarContacto}
                />

                {contactoActivo ? (
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
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white min-w-0">
                        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <span className="text-3xl text-slate-300">👥</span>
                        </div>
                        <p className="text-[18px] font-bold text-slate-700">Sin contactos disponibles</p>
                        <p className="text-[14px] text-slate-500 mt-2 text-center px-4">
                            Eres el único usuario registrado por ahora.<br/>
                            Abre otra pestaña, registra otro usuario y vuelve aquí para empezar a chatear.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};