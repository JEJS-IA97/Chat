import searchIcon from '../assets/icons/busqueda.svg'

export const ContactSearch = () => {

return(
        <form  className={`h-[40px] w-auto flex border-2 border-[#6daad7] rounded-lg overflow-hidden items-center justify-center bg-[#c7e3f9] m-[10px]`}>
            <button 
            className='w-[40px] h-[40px] flex items-center justify-center border-[#6daad7] cursor-pointer'>
                <img 
                className="w-[20px] h-auto" 
                src={searchIcon}
                alt=''></img>
            </button>
            <input 
            type="text" 
            
            
            placeholder="Search..." 
            className="text-[#6daad7] text-[14px] font-bold border-[#6daad7] pl-2 focus:outline-none h-auto w-full "
            />
        </form>
    );
}