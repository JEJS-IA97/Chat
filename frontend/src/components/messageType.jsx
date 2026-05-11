import { useState } from "react";

export const MessageType = ({ onEnviar}) => {
    const [texto, setTexto] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if(texto.trim() !== "")(
            onEnviar(texto),
            setTexto("")
        )
    }

return(
        <form onSubmit={handleSubmit} className={`m-3 flex w-auto items-center justify-center gap-2 overflow-hidden sm:m-[10px] sm:gap-[10px]`}>
            <input 
            data-testid="message-input"
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Type a message..." 
            className="h-[42px] w-full rounded-lg bg-[#c7e3f9] pl-3 pr-3 text-[14px] font-bold text-[#6daad7] focus:outline-none sm:h-[40px] sm:pl-4 sm:pr-4"
            />
            <button 
            type="submit"
            data-testid="send-message-button"
            className='flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#6daad7] cursor-pointer sm:h-[40px] sm:w-[40px]'>
                <span className="text-white text-lg">➤</span>
            </button>
        </form>
    );
}
