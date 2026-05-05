export const ContactCard = ({ contact, onClick, isActive, preview, isOnline, unreadCount }) => {

    const inicial = contact.nombre ? contact.nombre.charAt(0).toUpperCase() : '?';

    return (
        <div onClick={onClick} className={`w-auto h-[70px] flex items-center justify-start gap-[15px] hover:bg-[#e9f7ff] cursor-pointer border-b border-slate-100 ${isActive ? 'bg-[#e9f7ff]' : ''}`}>
            
            <div className="h-[40px] w-[40px] rounded-full ml-[15px] bg-[#6daad7] flex-shrink-0 text-white font-bold flex items-center justify-center text-[20px]">
                {inicial}
            </div>
            
            <div className="flex flex-col justify-center flex-1 min-w-0 pr-2">
                <p className="text-[15px] font-bold text-slate-800 truncate">{contact.nombre}</p>
                <p className="text-[13px] text-slate-500 truncate">{preview}</p>
            </div>

            <div className="flex flex-col items-end gap-[6px] mr-[15px] flex-shrink-0">
                <div className={`h-[10px] w-[10px] rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                
                {unreadCount > 0 && (
                    <div className="h-[20px] min-w-[20px] px-1 rounded-full bg-red-500 flex items-center justify-center text-[11px] font-bold text-white">
                        {unreadCount}
                    </div>
                )}
            </div>

        </div>
    );
}