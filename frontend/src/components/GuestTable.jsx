import { MessageCircle, StickyNote } from 'lucide-react';

const GuestTable = ({ guests }) => {
    const generateWhatsAppLink = (guest) => {
        const domain = window.location.origin;
        const inviteLink = `${domain}/join/${guest.unique_code}`;
        const message = `Hi ${guest.name}, we'd love for you to celebrate with us! Please RSVP here: ${inviteLink}`;

        // Format Phone Number
        let phone = guest.phone_number.replace(/\D/g, '');
        // specific fix for South African numbers (common issue)
        if (phone.startsWith('0') && phone.length === 10) {
            phone = '27' + phone.substring(1);
        }

        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {guests.map((guest) => (
                    <div key={guest.id} className="bg-white border border-charcoal border-opacity-10 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-charcoal text-lg">{guest.name}</h3>
                                {guest.email && <p className="text-xs text-gray-500">{guest.email}</p>}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${guest.rsvp_status === 'attending' ? 'bg-green-100 text-green-800' :
                                guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {guest.rsvp_status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Type</span>
                                {guest.is_family ? 'FAMILY' : 'GUEST'}
                            </div>
                            <div className="bg-gray-50 p-2 rounded">
                                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Plus One</span>
                                {guest.plus_one_count > 0 ? `+${guest.plus_one_count}` : 'None'}
                            </div>
                        </div>

                        {(guest.notes || guest.dietary_restrictions) && (
                            <div className="space-y-2 mb-4 bg-yellow-50 p-3 rounded text-sm text-charcoal border border-yellow-100">
                                {guest.notes && (
                                    <div className="flex gap-2 items-start">
                                        <StickyNote size={14} className="mt-1 text-yellow-600 shrink-0" />
                                        <p>"{guest.notes}"</p>
                                    </div>
                                )}
                                {guest.dietary_restrictions && (
                                    <div className="flex gap-2 items-start">
                                        <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">!</div>
                                        <p className="font-medium text-red-800">{guest.dietary_restrictions}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <a
                                href={generateWhatsAppLink(guest)}
                                className="flex-1 bg-green-50 text-green-700 py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-green-100 transition-colors"
                            >
                                <MessageCircle size={16} />
                                WA Invite
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
        </div>
    );
};

export default GuestTable;
