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
    onBorrarParaTodos,
    isTyping,
    emitirEscribir,
    onVolverMobile
}) => {
    const chatEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes, isTyping]);

    const handleKeyDown = () => {
        if (!emitirEscribir) return;

        emitirEscribir(true);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            emitirEscribir(false);
        }, 2000);
    };

    return (
        <section className="flex h-full min-w-0 flex-1 flex-col bg-white">
            <ContactProfile
                contacto={contactoActivo}
                onOpenSearch={isSearchOpen ? onCloseSearch : onOpenSearch}
                isOnline={contactoOnline}
                onBorrarParaMi={onBorrarParaMi}
                onBorrarParaTodos={onBorrarParaTodos}
                onVolverMobile={onVolverMobile}
            />

            {isSearchOpen && (
                <div className="border-b border-[#d1dbe4] bg-slate-50 px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
                    <div className="flex items-center gap-2 rounded-lg border border-[#6daad7] bg-white p-2 shadow-sm">
                        <input
                            data-testid="search-messages"
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

            <div className="flex w-full max-w-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto border-b-2 border-[#d1dbe4] p-3 sm:gap-4 sm:p-4">
                {mensajes?.map((msg, index) => (
                    <Message
                        key={index}
                        texto={msg.texto}
                        remitente={msg.remitenteNombre}
                        isContact={msg.remitenteId !== miUsuario.id}
                        contacto={contactoActivo}
                    />
                ))}

                {isTyping && contactoActivo && (
                    <div className="flex w-full max-w-[84%] animate-pulse items-center gap-2 self-start sm:max-w-[78%] lg:max-w-[600px]">
                        <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-[#6daad7] text-[12px] font-bold text-white">
                            {contactoActivo.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="rounded-bl-2xl rounded-r-2xl bg-slate-100 px-4 py-2 text-[13px] font-semibold italic text-slate-500">
                            escribiendo...
                        </span>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            <div onKeyDown={handleKeyDown} className="w-full">
                <MessageType onEnviar={onEnviar} />
            </div>
        </section>
    );
}
