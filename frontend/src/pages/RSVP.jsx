import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';

const RSVP = () => {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form Fields
    const [name, setName] = useState('');
    const [status, setStatus] = useState('attending');
    const [plusOneName, setPlusOneName] = useState('');
    const [songRequest, setSongRequest] = useState('');

    useEffect(() => {
        const fetchGuest = async () => {
            try {
                const response = await api.get(`/rsvp/${code}`);
                setName(response.data.name || '');
                // Pre-fill status if available
                if (response.data.rsvp_status) setStatus(response.data.rsvp_status);
            } catch (err) {
                setError('Invalid invitation code.');
            } finally {
                setLoading(false);
            }
        };
        fetchGuest();
    }, [code]);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct notes from specific fields
            const compiledNotes = `Plus One: ${plusOneName} | Song Request: ${songRequest}`;

            await api.post(`/rsvp/${code}`, {
                rsvp_status: status,
                notes: compiledNotes,
                // We send name just in case backend accepts it, otherwise it's just local state for the form experience
                // If backend doesn't support 'name' update, it will likely be ignored, which is fine as we are relying on 'notes' for the new info.
                name: name,
                plus_one_count: plusOneName ? 1 : 0
            });
            setSuccessMsg('Thank you! Your response has been recorded.');

            setTimeout(() => {
                navigate('/?rsvp=success');
            }, 3000);

        } catch (err) {
            setError('Failed to submit. Please try again.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-rich-black text-gold">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-rich-black text-red-500 font-serif text-xl">{error}</div>;

    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4 text-white relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <div className="text-center mb-12">
                    <p className="text-sm font-bold tracking-[0.3em] text-gold uppercase mb-4">The Question</p>
                    <h1 className="text-5xl md:text-6xl font-serif text-white">R.S.V.P</h1>
                </div>

                {successMsg ? (
                    <div className="bg-gold/10 border border-gold/30 p-8 rounded-sm text-center">
                        <h3 className="text-3xl font-serif text-gold mb-4">Destiny Awaits</h3>
                        <p className="text-white/80">{successMsg}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Question 1: Who */}
                        <div className="space-y-4">
                            <label className="block text-gold font-script text-3xl">1. Name & Surname</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder-gray-600 focus:border-gold focus:outline-none transition-colors text-xl font-serif"
                                placeholder="Your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Question 2: Status */}
                        <div className="space-y-6">
                            <label className="block text-gold font-script text-3xl">2. Will you join us?</label>
                            <div className="flex gap-8">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 border rounded-full flex items-center justify-center transition-colors ${status === 'attending' ? 'border-gold' : 'border-white/30 group-hover:border-gold'}`}>
                                        {status === 'attending' && <div className="w-3 h-3 bg-gold rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="attending"
                                        checked={status === 'attending'}
                                        onChange={() => setStatus('attending')}
                                        className="hidden"
                                    />
                                    <span className={`uppercase tracking-widest text-sm ${status === 'attending' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>Gladly, Yes</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 border rounded-full flex items-center justify-center transition-colors ${status === 'declined' ? 'border-red-500' : 'border-white/30 group-hover:border-red-500'}`}>
                                        {status === 'declined' && <div className="w-3 h-3 bg-red-500 rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="status"
                                        value="declined"
                                        checked={status === 'declined'}
                                        onChange={() => setStatus('declined')}
                                        className="hidden"
                                    />
                                    <span className={`uppercase tracking-widest text-sm ${status === 'declined' ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>Sadly, No</span>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Questions */}
                        {status === 'attending' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-12"
                            >
                                {/* Question 3: Plus One */}
                                <div className="space-y-4">
                                    <label className="block text-gold font-script text-3xl">3. Name & Surname of plus one</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder-gray-600 focus:border-gold focus:outline-none transition-colors text-xl font-serif"
                                        placeholder="Leave blank if attending solo"
                                        value={plusOneName}
                                        onChange={(e) => setPlusOneName(e.target.value)}
                                    />
                                </div>

                                {/* Question 4: Music */}
                                <div className="space-y-4">
                                    <label className="block text-gold font-script text-3xl">4. You’ll find me on the dance floor when they play?</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder-gray-600 focus:border-gold focus:outline-none transition-colors text-xl font-serif"
                                        placeholder="Song title / Artist"
                                        value={songRequest}
                                        onChange={(e) => setSongRequest(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="w-full py-4 bg-gold/10 border border-gold hover:bg-gold hover:text-rich-black text-gold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm"
                            >
                                Submit Response
                            </button>
                        </div>

                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default RSVP;
