import { ContactProfile } from "./contactProfile";
import { MessageType } from "./messageType";
import { Message } from "./message";
import { useRef, useEffect } from "react";

export const MessageContainer = ({
    mensajes,
    miUsuario,
    contactoActivo,
    contactoOnline,
    onEnviar,
    isSearchOpen,
    onOpenSearch,
    onCloseSearch,
    searchTerm,
    setSearchTerm,
    onBorrarParaMi,
    onBorrarParaTodos
}) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    return (
        <section className="flex-1 h-full flex flex-col min-w-0 bg-white">
            <ContactProfile
                contacto={contactoActivo}
                onOpenSearch={isSearchOpen ? onCloseSearch : onOpenSearch}
                isOnline={contactoOnline}
                onBorrarParaMi={onBorrarParaMi}
                onBorrarParaTodos={onBorrarParaTodos}
            />

            {isSearchOpen && (
                <div className="px-4 pt-4 pb-2 bg-slate-50 border-b border-[#d1dbe4]">
                    <div className="flex items-center gap-2 rounded-lg border border-[#6daad7] bg-white p-2 shadow-sm">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar mensaje..."
                            className="w-full text-[14px] text-slate-700 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="rounded-md bg-[#6daad7] px-3 py-1 text-[12px] font-semibold text-white cursor-pointer"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-full flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 border-b-2 border-[#d1dbe4]">
                {mensajes?.map((msg, index) => (
                    <Message
                        key={index}
                        texto={msg.texto}
                        remitente={msg.remitenteNombre}
                        isContact={msg.remitenteId !== miUsuario.id}
                        contacto={contactoActivo}
                    />
                ))}

                <div ref={chatEndRef} />
            </div>

            <MessageType onEnviar={onEnviar} />
        </section>
    )
}
