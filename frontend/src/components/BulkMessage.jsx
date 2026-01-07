import { useState } from 'react';
import GlassCard from './GlassCard';
import api from '../api';

const BulkMessage = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            const res = await api.post('/guests/broadcast', { message });
            alert(`Success: ${res.data.message}`);
            setMessage('');
        } catch (err) {
            console.error("Broadcast failed", err);
            alert("Failed to send broadcast");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Bulk Communications</h2>
            <p className="text-gray-500 text-sm mb-4">Send updates to all guests (e.g. "Venue change", "Program update").</p>
            <textarea
                className="w-full h-32 mb-4 resize-none bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-yellow-600 transition-colors"
                placeholder="Type your update here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end">
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className={`px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Sending...' : 'Send Update'}
                </button>
            </div>
        </div>
    );
};

export default BulkMessage;
