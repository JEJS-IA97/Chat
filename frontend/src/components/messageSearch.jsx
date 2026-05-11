import searchIcon from '../assets/icons/busqueda.svg'

export const MessageSearch = ({ onClick }) => {

return(
            <button
            data-testid="search-message-button"
            type="button"
            onClick={onClick}
            className='w-[30px] h-[30px] flex items-center justify-center bg-[#6daad7] cursor-pointer rounded-full'>
                <img 
                className="w-[15px] h-auto" 
                src={searchIcon}
                alt=''></img>
            </button>
    );
}
