import { useState } from 'react';
import GlassCard from './GlassCard';

const BulkMessage = () => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        alert("This is a mockup. Messages would be sent to WhatsApp/Email provider.");
        setMessage('');
    };

    return (
        <GlassCard>
            <h2 className="text-xl font-bold mb-4 text-white">Bulk Communications</h2>
            <p className="text-white/70 text-sm mb-4">Send updates to all guests (e.g. "Venue change", "Program update").</p>
            <textarea
                className="glass-input w-full h-32 mb-4 resize-none"
                placeholder="Type your update here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end">
                <button onClick={handleSend} className="glass-btn">
                    Send Update
                </button>
            </div>
        </GlassCard>
    );
};

export default BulkMessage;
