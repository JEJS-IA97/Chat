

export const Message = ({ isContact, texto, contacto}) => {

    const inicial = contacto.nombre ? contacto.nombre.charAt(0).toUpperCase() : '?';

    if(isContact){
        return (
            <div className="flex items-end gap-[15px] self-start">
                <div className="h-[40px] w-[40px] rounded-full bg-[#6daad7] text-white font-bold  flex items-center justify-center text-[20px]">{inicial}</div>
                <div className="flex flex-col">
                    <div className="bg-[#477ea0] w-auto min-h-[35px] max-w-[400px] rounded-r-lg rounded-bl-lg p-2 px-3">
                        <p className="text-white text-[14px]">{texto}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#6daad7] w-auto min-h-[35px] max-w-[400px] rounded-l-lg rounded-br-lg p-2 px-3 self-end shadow-sm">
            <p className="text-white text-[14px]">{texto}</p>
        </div>
    )
}