import { useState } from "react";
import { ContactCard } from "./contactCard";

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
    onAceptarSolicitud
}) => {
    const [mostrarAgregar, setMostrarAgregar] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [menuMobileOpen, setMenuMobileOpen] = useState(false);
    const [filtro, setFiltro] = useState('');

    const handleAgregar = (e) => {
        e.preventDefault();
        onAgregarContacto(emailInput);
        setEmailInput('');
        setMostrarAgregar(false);
    };

    const contactosFiltrados = contacts.filter(contact => 
        contact.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    const contenidoMenu = (
        <div className="flex shrink-0 flex-col bg-white">
            <div className="border-b border-[#d1dbe4] px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-[#8abce0] bg-[#e6f3fa] px-3 py-1.5">
                        <svg className="h-4 w-4 text-[#8abce0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input
                            type="text"
                            data-testid="search-contact"
                            placeholder="Buscar contacto..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="w-full bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-[#8abce0]"
                        />
                    </div>
                    <button
                        data-testid="add-contact-button"
                        onClick={() => setMostrarAgregar(!mostrarAgregar)}
                        className="h-[34px] shrink-0 rounded-md bg-[#6daad7] px-3 text-[12px] font-bold text-white transition-colors hover:bg-[#477ea0] cursor-pointer"
                        title="Añadir nuevo contacto"
                    >
                        Añadir
                    </button>
                </div>

                {mostrarAgregar && (
                    <form onSubmit={handleAgregar} className="mt-3 flex gap-2 border-t border-[#d1dbe4] pt-3">
                        <input
                            type="email"
                            data-testid="add-contact-input"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="correo@usuario.com"
                            className="flex-1 rounded-md border border-[#d1dbe4] px-3 py-1.5 text-[13px] outline-none focus:border-[#6daad7]"
                            required
                        />
                        <button
                            data-testid="send-invitation-button"
                            type="submit"
                            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-white hover:bg-emerald-600 cursor-pointer"
                        >
                            +
                        </button>
                    </form>
                )}
            </div>

            {solicitudes && solicitudes.length > 0 && (
                <div className="border-b border-[#d1dbe4] bg-[#fff9e6] p-3">
                    <p className="mb-2 text-[11px] font-bold uppercase text-slate-500">Solicitudes pendientes</p>
                    {solicitudes.map((sol) => (
                        <div key={sol.id} className="mb-2 flex items-center justify-between rounded-md border border-[#f0e6c8] bg-white p-2 shadow-sm">
                            <span className="mr-2 truncate text-[13px] font-bold text-slate-700">{sol.nombre}</span>
                            <button
                                data-testid= "accept-invitation-button"
                                onClick={() => onAceptarSolicitud(sol.id)}
                                className="rounded-md bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-emerald-600 cursor-pointer"
                            >
                                Aceptar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderContactos = () => (
        <div className="pb-4 h-full">
            {contacts.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center mt-10">
                    <p className="text-[16px] font-bold text-slate-700">Sin conversaciones</p>
                    <p className="mt-1 text-[13px] text-slate-500">Agrega un contacto para empezar.</p>
                </div>
            ) : contactosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center mt-4">
                    <p className="text-[14px] font-bold text-slate-500">No hay coincidencias</p>
                </div>
            ) : (
                contactosFiltrados.map((contact) => (
                    <ContactCard
                        key={contact.id}
                        contact={contact}
                        isActive={contact.id === contactoActivo?.id}
                        onClick={() => {
                            onSelectContact(contact);
                            setMenuMobileOpen(false);
                            setFiltro(''); 
                        }}
                        preview={getPreview(contact.id)}
                        isOnline={onlineUsers.includes(contact.id)}
                        unreadCount={noLeidos ? noLeidos[contact.id] : 0}
                    />
                ))
            )}
        </div>
    );

    return (
        <section className="relative flex h-full min-h-0 w-full flex-col bg-slate-50 lg:h-[600px] lg:w-[320px] lg:min-w-[320px] lg:border-r-2 lg:border-[#d1dbe4]">
            
            <div className="border-b border-[#d1dbe4] bg-white px-4 py-3 lg:hidden">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-[16px] font-bold text-slate-800">{miUsuario.nombre}</p>
                        <p className="text-[12px] text-slate-500">Tu sesión actual</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMenuMobileOpen(true)}
                            className="rounded-md bg-[#6daad7] px-3 py-2 text-[12px] font-bold text-white cursor-pointer hover:bg-[#477ea0]"
                        >
                            Menú
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex lg:flex-col">
                {contenidoMenu}
            </div>

            <div className="flex-1 overflow-y-auto bg-white">
                {renderContactos()}
            </div>

            <div className="hidden items-center justify-between gap-3 border-t-2 border-[#d1dbe4] px-[15px] py-[10px] lg:flex">
                <div className="min-w-0">
                    <p className="max-w-[170px] truncate text-[16px] font-bold text-slate-800">{miUsuario.nombre}</p>
                    <p className="text-[12px] text-slate-500">Tu sesión actual</p>
                </div>
                <button
                    data-testid="logout-button"
                    type="button"
                    onClick={onCerrarSesion}
                    className="shrink-0 rounded-md border-2 border-red-200 bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-600 cursor-pointer transition-colors hover:bg-red-100"
                >
                    Cerrar sesión
                </button>
            </div>

            <div className={`fixed inset-0 z-[100] lg:hidden ${menuMobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                
                <div
                    onClick={() => setMenuMobileOpen(false)}
                    className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${menuMobileOpen ? 'opacity-100' : 'opacity-0'}`}
                />

                <aside className={`absolute inset-y-0 left-0 flex w-[85%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ${menuMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    
                    <div className="flex shrink-0 items-center justify-between border-b border-[#d1dbe4] px-4 py-3 bg-white">
                        <div>
                            <p className="text-[16px] font-bold text-slate-800">Opciones</p>
                            <p className="text-[12px] text-slate-500">Buscar y añadir contactos</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMenuMobileOpen(false)}
                            className="rounded-md bg-slate-100 px-3 py-2 text-[13px] font-bold text-slate-700 cursor-pointer hover:bg-slate-200"
                        >
                            Cerrar
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-slate-50">
                        {contenidoMenu}

                        {filtro.trim().length > 0 && (
                            <div className="min-h-full bg-white pb-8">
                                <p className="border-b border-[#d1dbe4] bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase text-slate-500">
                                    Resultados de la búsqueda
                                </p>
                                {renderContactos()}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-[#d1dbe4] p-4 bg-white">
                        <button
                            type="button"
                            onClick={onCerrarSesion}
                            className="w-full rounded-md border-2 border-red-200 bg-red-50 px-3 py-2.5 text-[14px] font-bold text-red-600 cursor-pointer hover:bg-red-100"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </aside>
            </div>
        </section>
    );
};