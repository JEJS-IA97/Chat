import { MessageSearch } from "./messageSearch";
import { useState } from "react";

export const ContactProfile = ({ contacto, onOpenSearch, isOnline, onBorrarParaMi, onBorrarParaTodos }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const inicial = contacto.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';

    return (
        <div className="w-full h-[60px] flex items-center border-b-2 border-[#d1dbe4] justify-between pl-[15px] pr-[15px] relative">
            <div className="flex items-center gap-[15px] ">
                <div className="h-[40px] w-[40px] rounded-full bg-[#6daad7] text-white font-bold flex items-center justify-center text-[20px]">{inicial}</div>
                <div className="flex flex-col justify-start">
                    <p className="text-[14px] font-bold">{contacto.nombre}</p>
                    <p className="text-[12px] text-slate-500">{isOnline ? "En linea" : "Desconectado"}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <MessageSearch onClick={onOpenSearch} />

                <button 
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-[30px] h-[30px] flex items-center justify-center bg-slate-200 cursor-pointer rounded-full font-bold text-slate-600 hover:bg-slate-300"
                >
                    ⋮
                </button>

                {menuOpen && (
                    <div className="absolute right-[15px] top-[50px] bg-white border border-slate-200 shadow-lg rounded-md py-2 w-[160px] z-50">
                        <button 
                            onClick={() => { onBorrarParaMi(); setMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                            Borrar para mí
                        </button>
                        <button 
                            onClick={() => { onBorrarParaTodos(); setMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                            Borrar para todos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}