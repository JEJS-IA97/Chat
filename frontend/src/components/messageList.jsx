import { ContactCard } from "./contactCard";
import { ContactSearch } from "./contactSearch";

export const MessageList = ({ contacts, contactoActivo, onSelectContact, onlineUsers, getPreview, miUsuario, onCerrarSesion }) => {
    return (
        <section className="w-[320px] h-[600px] flex flex-col border-r-2 border-[#d1dbe4]">
            <div className="border-b border-[#d1dbe4] p-[10px]">
                <ContactSearch />
            </div>

            <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                    <ContactCard
                        key={contact.id}
                        contact={contact}
                        isActive={contact.id === contactoActivo?.id}
                        onClick={() => onSelectContact(contact)}
                        preview={getPreview(contact.id)}
                        isOnline={onlineUsers.includes(contact.id)}
                    />
                ))}
            </div>

            <div className="mb-3 flex items-center justify-between gap-2 p-[10px]">
                    <div>
                        <p className="text-[16px] font-bold text-slate-800">{miUsuario.nombre}</p>
                        <p className="text-[12px] text-slate-500">Tu sesion actual</p>
                    </div>
                    <button
                        type="button"
                        onClick={onCerrarSesion}
                        className="rounded-md bg-slate-100 px-3 py-2 text-[12px] font-semibold text-slate-700 cursor-pointer hover:bg-slate-200"
                    >
                        Cerrar sesión
                    </button>
                </div>
        </section>
    );
};
