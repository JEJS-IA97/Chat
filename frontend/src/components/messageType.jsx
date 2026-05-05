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
        <form onSubmit={handleSubmit} className={`h-[40px] w-auto flex overflow-hidden items-center justify-center m-[10px] gap-[10px]`}>
            <input 
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Type a message..." 
            className="text-[#6daad7] text-[14px] font-bold pl-4 pr-4 focus:outline-none h-[40px] w-full bg-[#c7e3f9] rounded-lg"
            />
            <button 
            type="submit"
            className='w-[40px] h-[40px] flex items-center justify-center bg-[#6daad7] cursor-pointer rounded-full'>
                <span className="text-white text-lg">➤</span>
            </button>
        </form>
    );
}