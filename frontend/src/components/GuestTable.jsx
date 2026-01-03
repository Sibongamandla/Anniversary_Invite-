import React from 'react';
import { MessageCircle, StickyNote } from 'lucide-react';

const GuestTable = ({ guests }) => {
    const generateWhatsAppLink = (guest) => {
        if (!guest.phone_number) return '#';

        const domain = window.location.origin;
        const inviteLink = `${domain}/join/${guest.unique_code}`;
        const message = `Hi ${guest.name}, we'd love for you to celebrate with us! 
Please RSVP here: ${inviteLink}

Your unique code is: *${guest.unique_code}*`;

        // Robust Phone Formatting
        let phone = guest.phone_number.toString().replace(/\D/g, '');
        if (phone.startsWith('0') && phone.length === 10) {
            phone = '27' + phone.substring(1);
        } else if (phone.length === 9) {
            phone = '27' + phone;
        }

        return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    };

    const [localSentIds, setLocalSentIds] = React.useState([]);

    const handleInviteClick = async (guest) => {
        // 1. Open WhatsApp
        const link = generateWhatsAppLink(guest);
        window.open(link, '_blank');

        // 2. Call API to mark as sent
        try {
            await import('../api').then(module => module.default.post(`/guests/${guest.unique_code}/mark-sent`));
            setLocalSentIds(prev => [...prev, guest.id]);
        } catch (err) {
            console.error("Failed to mark invite as sent", err);
        }
    };

    return (
        <div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {guests.map((guest) => (
                    <div key={guest.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{guest.name}</h3>
                                {guest.email && <p className="text-xs text-gray-500">{guest.email}</p>}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${guest.rsvp_status === 'attending' ? 'bg-green-100 text-green-700 border border-green-200' :
                                guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-700 border border-red-200' :
                                    'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                }`}>
                                {guest.rsvp_status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Type</span>
                                {guest.is_family ? 'FAMILY' : 'GUEST'}
                            </div>
                            <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Plus One</span>
                                {guest.plus_one_count > 0 ? `+${guest.plus_one_count}` : 'None'}
                            </div>
                        </div>

                        {(guest.notes || guest.dietary_restrictions) && (
                            <div className="space-y-2 mb-4 bg-yellow-50 p-3 rounded text-sm text-gray-700 border border-yellow-100">
                                {guest.notes && (
                                    <div className="flex gap-2 items-start">
                                        <StickyNote size={14} className="mt-1 text-yellow-600 shrink-0" />
                                        <p>"{guest.notes}"</p>
                                    </div>
                                )}
                                {guest.dietary_restrictions && (
                                    <div className="flex gap-2 items-start">
                                        <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 border border-red-200">!</div>
                                        <p className="font-medium text-red-700">{guest.dietary_restrictions}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <a
                                href={generateWhatsAppLink(guest)}
                                className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded flex items-center justify-center gap-2 font-medium hover:bg-green-100 transition-colors"
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
                        <tr className="text-gray-500 border-b border-gray-200 font-bold uppercase text-xs tracking-wider">
                            <th className="p-3">Name</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">+1</th>
                            <th className="p-3">Rel</th>
                            <th className="p-3">Info</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map((guest) => (
                            <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-3">
                                    <div className="font-bold text-gray-900">{guest.name}</div>
                                    {guest.email && <div className="text-xs text-gray-500">{guest.email}</div>}
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${guest.rsvp_status === 'attending' ? 'text-green-700 bg-green-100' :
                                        guest.rsvp_status === 'declined' ? 'text-red-700 bg-red-100' :
                                            'text-yellow-700 bg-yellow-100'
                                        }`}>
                                        {guest.rsvp_status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-500 text-center">{guest.plus_one_count > 0 ? `+${guest.plus_one_count}` : '-'}</td>
                                <td className="p-3 text-xs uppercase tracking-wide text-gray-500">{guest.is_family ? 'FAMILY' : 'GUEST'}</td>

                                <td className="p-3 flex gap-2">
                                    {guest.notes && (
                                        <div className="group relative">
                                            <StickyNote size={18} className="text-yellow-600 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-white border border-gray-200 text-gray-800 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                                Notes: {guest.notes}
                                            </div>
                                        </div>
                                    )}
                                    {guest.dietary_restrictions && (
                                        <div className="group relative">
                                            <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold cursor-help border border-red-200">!</div>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-white border border-gray-200 text-gray-800 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                                                Allergies: {guest.dietary_restrictions}
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleInviteClick(guest)}
                                        className={`flex items-center gap-2 border px-3 py-1 rounded-full transition-colors ${(guest.invite_sent || localSentIds.includes(guest.id))
                                                ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-300'
                                            }`}
                                    >
                                        <MessageCircle size={14} className={(guest.invite_sent || localSentIds.includes(guest.id)) ? "fill-current" : ""} />
                                        <span className="hidden md:inline text-xs uppercase tracking-wider font-semibold">
                                            {(guest.invite_sent || localSentIds.includes(guest.id)) ? 'Sent' : 'Invite'}
                                        </span>
                                    </button>
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
