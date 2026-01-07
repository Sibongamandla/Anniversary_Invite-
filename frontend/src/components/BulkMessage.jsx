import { useState } from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';

const BulkMessage = ({ guests = [] }) => {
    const [message, setMessage] = useState('');

    const generateLink = (guest) => {
        if (!guest.phone_number) return null;

        let phone = guest.phone_number.toString().replace(/\D/g, '');
        if (phone.startsWith('0') && phone.length === 10) {
            phone = '27' + phone.substring(1);
        } else if (phone.length === 9) {
            phone = '27' + phone;
        }

        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                <MessageCircle className="text-green-600" />
                Manual Broadcast
            </h2>
            <p className="text-gray-500 text-sm mb-4">
                Compose a message below, then click "Send" next to each guest to open WhatsApp on your device.
            </p>

            <textarea
                className="w-full h-32 mb-4 resize-none bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-600 transition-colors"
                placeholder="Type your update here (e.g. 'Venue change to Room B')..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-light border-t border-gray-100 pt-4">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Recipients ({guests.length})</h3>

                {guests.map(guest => {
                    const link = generateLink(guest);
                    return (
                        <div key={guest.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors">
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{guest.name}</p>
                                <p className="text-xs text-gray-500">{guest.phone_number || 'No phone'}</p>
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
                                    Send
                                    <ExternalLink size={12} />
                                </a>
                            ) : (
                                <span className="text-xs text-gray-300 italic">No #</span>
                            )}
                        </div>
                    );
                })}

                {guests.length === 0 && (
                    <p className="text-sm text-gray-400 italic text-center py-4">No guests found.</p>
                )}
            </div>
        </div>
    );
};

export default BulkMessage;
