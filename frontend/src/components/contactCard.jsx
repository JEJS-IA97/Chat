export const ContactCard = ({ contact, onClick, isActive, preview, isOnline, unreadCount }) => {

    const inicial = contact.nombre ? contact.nombre.charAt(0).toUpperCase() : '?';

    return (
        <div data-testid="contact-item" onClick={onClick} className={`flex h-[68px] w-auto items-center justify-start gap-3 border-b border-slate-100 px-3 hover:bg-[#e9f7ff] cursor-pointer sm:h-[70px] sm:gap-[15px] sm:px-0 ${isActive ? 'bg-[#e9f7ff]' : ''}`}>
            
            <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full bg-[#6daad7] text-[18px] font-bold text-white sm:ml-[15px] sm:h-[40px] sm:w-[40px] sm:text-[20px]">
                {inicial}
            </div>
            
            <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
                <p className="truncate text-[14px] font-bold text-slate-800 sm:text-[15px]"
                data-testid="contact-name">
                    {contact.nombre}
                </p>
                <p className="truncate text-[12px] text-slate-500 sm:text-[13px]">{preview}</p>
            </div>

            <div className="flex flex-shrink-0 flex-col items-end gap-[6px] sm:mr-[15px]">
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
