export const Message = ({ isContact, texto, contacto }) => {
    const inicial = contacto?.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';

    if (isContact) {
        return (
            <div className="flex items-end gap-[15px] self-start w-full max-w-full">
                <div className="h-[40px] w-[40px] rounded-full bg-[#6daad7] text-white font-bold flex-shrink-0 flex items-center justify-center text-[20px]">
                    {inicial}
                </div>
                
                <div className="flex flex-col max-w-[70%]">
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
        <div className="flex flex-col self-end max-w-[600px]">
            <div className="bg-[#6daad7] w-fit max-w-full min-h-[35px] rounded-l-lg rounded-br-lg p-2 px-3 shadow-sm">
                <p className="text-white text-[14px] break-all whitespace-pre-wrap">
                    {texto}
                </p>
            </div>
        </div>
    )
}