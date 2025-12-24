import { useState } from 'react';
import GlassCard from './GlassCard';
import { X } from 'lucide-react';

const InviteModal = ({ isOpen, onClose, onInvite }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onInvite({ name, phone_number: phoneNumber });
        setName('');
        setPhoneNumber('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <GlassCard className="w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-charcoal transition-colors">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-serif text-charcoal mb-6">Quick Invite</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Guest Name"
                        className="glass-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="WhatsApp Number"
                        className="glass-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <button type="submit" className="glass-btn">Generate Invite</button>
                </form>
            </GlassCard>
        </div>
    );
};

export default InviteModal;
