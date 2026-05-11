export const Message = ({ isContact, texto, contacto }) => {
    const inicial = contacto?.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';

    if (isContact) {
        return (
            <div className="flex w-full max-w-full self-start items-end gap-2 sm:gap-[15px]">
                <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-[#6daad7] text-[16px] font-bold text-white sm:h-[40px] sm:w-[40px] sm:text-[20px]">
                    {inicial}
                </div>
                
                <div data-testid="chat-bubble-contact" className="flex max-w-[84%] flex-col sm:max-w-[78%] lg:max-w-[70%]">
                    <span className="text-[10px] font-bold text-gray-400 mb-1 ml-1">{contacto.nombre}</span>
                    <div className="bg-[#477ea0] w-fit min-h-[35px] rounded-r-lg rounded-bl-lg p-2 px-3 shadow-sm">
                        <p className="text-white text-[14px] break-words whitespace-pre-wrap">
                            {texto}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div data-testid="chat-bubble-user" className="flex max-w-[84%] flex-col self-end sm:max-w-[78%] lg:max-w-[600px]">
            <div className="bg-[#6daad7] w-fit max-w-full min-h-[35px] rounded-l-lg rounded-br-lg p-2 px-3 shadow-sm">
                <p className="text-white text-[14px] break-all whitespace-pre-wrap">
                    {texto}
                </p>
            </div>
        </div>
    )
}
