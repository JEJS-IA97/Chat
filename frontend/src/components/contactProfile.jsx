import { MessageSearch } from "./messageSearch";

export const ContactProfile = ({ contacto, onOpenSearch, isOnline }) => {

    const inicial = contacto.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';

    return (
        <div className="w-full h-[60px] flex items-center border-b-2 border-[#d1dbe4] justify-between pl-[15px] pr-[15px]">
            <div className="flex items-center gap-[15px] ">
                <div className="h-[40px] w-[40px] rounded-full bg-[#6daad7] text-white font-bold  flex items-center justify-center text-[20px]">{inicial}</div>
                <div className="flex flex-col justify-start">
                    <p className="text-[14px] font-bold">{contacto.nombre}</p>
                    <p className="text-[12px] text-slate-500">{isOnline ? "En linea" : "Desconectado"}</p>
                </div>
            </div>
            <MessageSearch onClick={onOpenSearch} />
        </div>
    );
}
