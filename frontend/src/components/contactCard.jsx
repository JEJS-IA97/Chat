export const ContactCard = ({ contact, onClick, isActive, preview, isOnline }) => {

    const inicial = contact.nombre ? contact.nombre.charAt(0).toUpperCase() : '?';

    return (
        <div onClick={onClick} className={`w-auto h-[60px] flex items-center justify-start gap-[15px] hover:bg-[#e9f7ff] cursor-pointer ${isActive ? 'bg-[#e9f7ff]' : ''}`}>
            <div className="h-[40px] w-[40px] rounded-full ml-[15px] bg-[#6daad7] text-white font-bold  flex items-center justify-center text-[20px]">{inicial}</div>
            <div className="flex flex-col justify-start min-w-0">
                <p className="text-[14px] font-bold">{contact.nombre}</p>
                <p className="text-[12px] text-slate-500 truncate max-w-[180px]">{contact.nombre}: {preview}</p>
            </div>
            <div className={`ml-auto mr-[15px] h-[10px] w-[10px] rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
        </div>
    );
}
