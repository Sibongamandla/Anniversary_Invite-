import { MessageCircle, StickyNote } from 'lucide-react';

const GuestTable = ({ guests }) => {
    const generateWhatsAppLink = (guest) => {
        const domain = window.location.origin;
        const inviteLink = `${domain}/join/${guest.unique_code}`;
        const message = `Hi ${guest.name}, we'd love for you to celebrate with us! Please RSVP here: ${inviteLink}`;
        return `https://wa.me/${guest.phone_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-charcoal border-b border-charcoal border-opacity-20 font-bold">
                        <th className="p-3">Name</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">+1</th>
                        <th className="p-3">Rel</th>
                        <th className="p-3">Info</th>
                        <th className="p-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.id} className="border-b border-charcoal border-opacity-10 hover:bg-gray-100 transition-colors">
                            <td className="p-3">
                                <div className="font-bold text-charcoal">{guest.name}</div>
                                {guest.email && <div className="text-xs text-gray-500">{guest.email}</div>}
                            </td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${guest.rsvp_status === 'attending' ? 'bg-green-100 text-green-800' :
                                    guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {guest.rsvp_status.toUpperCase()}
                                </span>
                            </td>
                            <td className="p-3 text-charcoal text-center">{guest.plus_one_count > 0 ? `+${guest.plus_one_count}` : '-'}</td>
                            <td className="p-3 text-xs uppercase tracking-wide text-gray-600">{guest.is_family ? 'FAMILY' : 'GUEST'}</td>

                            <td className="p-3 flex gap-2">
                                {guest.notes && (
                                    <div className="group relative">
                                        <StickyNote size={18} className="text-blue-600 cursor-help" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                            Notes: {guest.notes}
                                        </div>
                                    </div>
                                )}
                                {guest.dietary_restrictions && (
                                    <div className="group relative">
                                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold cursor-help">!</div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-charcoal text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                            Allergies: {guest.dietary_restrictions}
                                        </div>
                                    </div>
                                )}
                            </td>
                            <td className="p-3">
                                <a
                                    href={generateWhatsAppLink(guest)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
                                >
                                    <MessageCircle size={18} />
                                    <span className="hidden md:inline">Invite</span>
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GuestTable;
