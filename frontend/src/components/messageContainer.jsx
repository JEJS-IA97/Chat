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
    emitirEscribir 
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

                {isTyping && contactoActivo && (
                    <div className="flex items-center gap-2 self-start w-full max-w-[600px] animate-pulse">
                        <div className="h-[30px] w-[30px] rounded-full bg-[#6daad7] text-white font-bold flex-shrink-0 flex items-center justify-center text-[12px]">
                            {contactoActivo.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[13px] font-semibold text-slate-500 italic bg-slate-100 px-4 py-2 rounded-r-2xl rounded-bl-2xl">
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
    )
}