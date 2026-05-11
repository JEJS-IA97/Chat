import { MessageSearch } from "./messageSearch";
import { useState } from "react";

export const ContactProfile = ({ contacto, onOpenSearch, isOnline, onBorrarParaMi, onBorrarParaTodos, onVolverMobile }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const inicial = contacto.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';

    return (
        <div className="relative flex h-[56px] w-full items-center justify-between border-b-2 border-[#d1dbe4] px-3 sm:h-[60px] sm:pl-[15px] sm:pr-[15px]">
            <div className="flex min-w-0 items-center gap-3 sm:gap-[15px]">
                {onVolverMobile && (
                    <button
                        type="button"
                        onClick={onVolverMobile}
                        className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-100 text-[16px] font-bold text-slate-700 hover:bg-slate-200 cursor-pointer lg:hidden"
                    >
                        ←
                    </button>
                )}

                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#6daad7] text-[18px] font-bold text-white sm:h-[40px] sm:w-[40px] sm:text-[20px]">
                    {inicial}
                </div>
                <div className="min-w-0 flex flex-col justify-start">
                    <p className="truncate text-[14px] font-bold">{contacto.nombre}</p>
                    <p className="text-[12px] text-slate-500">{isOnline ? "En linea" : "Desconectado"}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <MessageSearch onClick={onOpenSearch} />

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600 hover:bg-slate-300 cursor-pointer"
                >
                    ⋮
                </button>

                {menuOpen && (
                    <div className="absolute right-3 top-[48px] z-50 w-[160px] rounded-md border border-slate-200 bg-white py-2 shadow-lg sm:right-[15px] sm:top-[50px]">
                        <button
                            onClick={() => { onBorrarParaMi(); setMenuOpen(false); }}
                            className="w-full cursor-pointer px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Borrar para mi
                        </button>
                        <button
                            onClick={() => { onBorrarParaTodos(); setMenuOpen(false); }}
                            className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                            Borrar para todos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
