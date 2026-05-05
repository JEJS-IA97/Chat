import { useState } from "react";
import { ContactCard } from "./contactCard";
import { ContactSearch } from "./contactSearch";

export const MessageList = ({ 
    contacts, 
    solicitudes, 
    contactoActivo, 
    onSelectContact, 
    onlineUsers, 
    getPreview, 
    miUsuario, 
    onCerrarSesion, 
    noLeidos,
    onAgregarContacto, 
    onAceptarSolicitud }) => {
    
    const [mostrarAgregar, setMostrarAgregar] = useState(false);
    const [emailInput, setEmailInput] = useState('');

    const handleAgregar = (e) => {
        e.preventDefault();
        onAgregarContacto(emailInput);
        setEmailInput('');
        setMostrarAgregar(false);
    };

    return (
        <section className="w-[320px] h-[600px] flex flex-col border-r-2 border-[#d1dbe4] bg-slate-50">
            <div className="border-b border-[#d1dbe4] pl-[10px] pr-[10px] flex flex-col">
                <div className="flex items-center gap-[10px]">
                    <div className="flex-1">
                        <ContactSearch />
                    </div>
                    <button
                        onClick={() => setMostrarAgregar(!mostrarAgregar)}
                        className="bg-[#6daad7] text-white  rounded-md font-bold hover:bg-[#477ea0] transition-colors text-[12px] w-[50px] h-[30px] cursor-pointer"
                        title="Añadir nuevo contacto"
                    >
                        Añadir
                    </button>
                </div>

                {mostrarAgregar && (
                    <form onSubmit={handleAgregar} className="flex gap-2 pt-4 pb-4 border-t-2 border-[#d1dbe4]">
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="correo@usuario.com"
                            className="flex-1 border-2 border-[#d1dbe4] rounded-md px-2 py-1 text-[13px] outline-none focus:border-[#6daad7]"
                            required
                        />
                        <button type="submit" className="bg-emerald-500 text-white w-[30px] h-[30px] rounded-full font-bold hover:bg-emerald-600 cursor-pointer">
                            ➤
                        </button>
                    </form>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
                {solicitudes && solicitudes.length > 0 && (
                    <div className="bg-[#fff9e6] p-3 border-b border-[#d1dbe4]">
                        <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase">Solicitudes Pendientes</p>
                        {solicitudes.map(sol => (
                            <div key={sol.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm mb-2 border border-[#f0e6c8]">
                                <span className="text-[13px] font-bold text-slate-700 truncate mr-2">{sol.nombre}</span>
                                <button 
                                    onClick={() => onAceptarSolicitud(sol.id)} 
                                    className="bg-emerald-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-md hover:bg-emerald-600 transition-colors cursor-pointer"
                                >
                                    Aceptar
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {contacts.map((contact) => (
                    <ContactCard
                        key={contact.id}
                        contact={contact}
                        isActive={contact.id === contactoActivo?.id}
                        onClick={() => onSelectContact(contact)}
                        preview={getPreview(contact.id)}
                        isOnline={onlineUsers.includes(contact.id)}
                        unreadCount={noLeidos ? noLeidos[contact.id] : 0} 
                    />
                ))}
            </div>

            <div className="flex items-center justify-between gap-2 p-[10px] pr-[15px] pl-[15px] border-t-2 border-[#d1dbe4]">
                <div>
                    <p className="text-[16px] font-bold text-slate-800 truncate max-w-[150px]">{miUsuario.nombre}</p>
                    <p className="text-[12px] text-slate-500">Tu sesión actual</p>
                </div>
                <button
                    type="button"
                    onClick={onCerrarSesion}
                    className="rounded-md bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-600 cursor-pointer hover:bg-red-100 transition-colors border-2 border-red-200"
                >
                    Cerrar sesión
                </button>
            </div>
        </section>
    );
};