import { useState } from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';

const BulkMessage = ({ guests = [] }) => {
    const [message, setMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('attending');

    // Dynamic Base URL
    const baseUrl = window.location.origin;

    // Calculate Days Remaining
    const today = new Date();
    const eventDate = new Date('2026-03-07T15:30:00');
    const diffTime = eventDate - today;
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const templates = {
        countdown: `⏳ *THE FINAL COUNTDOWN: ${daysRemaining} DAYS TO GO!* ⏳\n\nHello {{name}}! 🥂\n\nWe are now in the final stretch! We cannot wait to share this moment with you.\n\n📅 Date: Saturday, March 7th, 2026\n📍 Location: Stellenbosch\n\nPlease review the Guest Guide for expanding details and our 'Surprise' linen dress code:\n👉 ${baseUrl}/guide\n\nSee you soon!`,
        venue: `Hi {{name}} 👋\n\n*${daysRemaining} DAYS UNTIL WE CELEBRATE!* 🍾\n\nA quick update regarding the venue.\n\n📍 Venue: [Venue Name/Link]\n⏰ Arrival Time: 3:00 PM for 3:30 PM Start\n\nGoogle Maps Link: [Insert Link]\n\nPlease drive safely!`,
        rsvp: `Hello {{name}},\n\nWith only *${daysRemaining} days left*, we are finalizing our guest list!\n\nCould you please confirm your attendance by this Friday? We'd love to have you there! 🤍\n\nUpdate your RSVP here:\n👉 ${baseUrl}/rsvp`
    };

    const generateLink = (guest) => {
        if (!guest.phone_number) return null;

        let phone = guest.phone_number.toString().replace(/\D/g, '');
        if (phone.startsWith('0') && phone.length === 10) {
            phone = '27' + phone.substring(1);
        } else if (phone.length === 9) {
            phone = '27' + phone;
        }

        // personalized message
        const personalized = message.replace('{{name}}', guest.name.split(' ')[0]);

        return `https://wa.me/${phone}?text=${encodeURIComponent(personalized)}`;
    };

    const loadTemplate = (key) => {
        setMessage(templates[key]);
    };

    const filteredGuests = guests.filter(g =>
        filterStatus === 'all' || g.rsvp_status === filterStatus
    );

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <MessageCircle className="text-green-600" />
                Broadcast Updates
            </h2>

            <p className="text-gray-500 text-sm mb-4">
                Select a template or compose a message, filter the guest list, then click "Manual" to open WhatsApp for each guest.
            </p>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <button onClick={() => loadTemplate('countdown')} className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full border border-gray-300 transition-colors">
                    Template: Final Countdown
                </button>
                <button onClick={() => loadTemplate('venue')} className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full border border-gray-300 transition-colors">
                    Template: Venue Update
                </button>
                <button onClick={() => loadTemplate('rsvp')} className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full border border-gray-300 transition-colors">
                    Template: RSVP Follow-up
                </button>
            </div>

            <textarea
                className="w-full h-32 mb-4 resize-none bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-600 transition-colors"
                placeholder="Type your message... use {{name}} to insert guest's first name."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div className="flex gap-2 items-center mb-6 pb-6 border-b border-gray-100">
                <p className="text-sm text-gray-700 font-bold mr-2">Filter List:</p>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 flex-1"
                >
                    <option value="attending">Attending Guests Only</option>
                    <option value="pending">Pending Guests Only</option>
                    <option value="all">All Guests</option>
                </select>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-light">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">
                    Recipients ({filteredGuests.length} matching filter)
                </h3>

                {filteredGuests.map(guest => {
                    const link = generateLink(guest);
                    return (
                        <div key={guest.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors">
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{guest.name}</p>
                                <p className="text-xs text-gray-500 flex gap-2">
                                    {guest.phone_number || 'No phone'}
                                    <span className={`uppercase font-bold text-[10px] px-1 rounded ${guest.rsvp_status === 'attending' ? 'bg-green-100 text-green-700' :
                                        guest.rsvp_status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {guest.rsvp_status}
                                    </span>
                                </p>
                            </div>

                            {link ? (
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-bold transition-all ${message.length > 0
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    onClick={(e) => !message && e.preventDefault()}
                                >
                                    Manual
                                    <ExternalLink size={12} />
                                </a>
                            ) : (
                                <span className="text-xs text-gray-300 italic">No #</span>
                            )}
                        </div>
                    );
                })}

                {filteredGuests.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-4">No matching guests found.</p>
                )}
            </div>
        </div>
    );
};

export default BulkMessage;
