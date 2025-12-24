import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/mockApi';
import { motion } from 'framer-motion';

const RSVP = () => {
    const { code } = useParams();
    const [guest, setGuest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(null);
    const [email, setEmail] = useState('');
    const [isFamily, setIsFamily] = useState(false);
    const [plusOneCount, setPlusOneCount] = useState(0);
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [notes, setNotes] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchGuest = async () => {
            try {
                const response = await api.get(`/rsvp/${code}`);
                setGuest(response.data);
                setStatus(response.data.rsvp_status);
                setEmail(response.data.email || '');
                setIsFamily(response.data.is_family || false);
                setPlusOneCount(response.data.plus_one_count || 0);
                setDietaryRestrictions(response.data.dietary_restrictions || '');
                setNotes(response.data.notes || '');
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
            await api.post(`/rsvp/${code}`, {
                rsvp_status: status,
                notes,
                email,
                is_family: isFamily,
                plus_one_count: plusOneCount,
                dietary_restrictions: dietaryRestrictions
            });
            setSuccessMsg('Thank you! Your RSVP has been updated.');

            // Redirect to home after 2 seconds to explore the site
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            setError('Failed to update RSVP. Please try again.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen text-charcoal">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-serif text-xl">{error}</div>;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full text-center"
            >
                <p className="text-sm font-bold tracking-[0.3em] text-gold uppercase mb-6">RSVP</p>
                <h1 className="text-5xl md:text-7xl font-serif text-charcoal mb-4">Hello, {guest.name.split(' ')[0]}</h1>
                <p className="text-gray-600 font-light mb-12">
                    We would be honored by your presence.
                </p>

                {successMsg ? (
                    <div className="text-2xl font-serif text-green-600 animate-pulse">
                        {successMsg}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-8 mb-8">
                            <label className="cursor-pointer group">
                                <input
                                    type="radio"
                                    name="status"
                                    value="attending"
                                    checked={status === 'attending'}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="hidden"
                                />
                                <div className={`w-32 h-32 border border-charcoal border-opacity-20 flex flex-col items-center justify-center rounded-full transition-all duration-300 ${status === 'attending' ? 'bg-charcoal text-white scale-105' : 'hover:border-gold hover:text-gold text-gray-500'}`}>
                                    <span className="text-lg uppercase tracking-widest">Accept</span>
                                </div>
                            </label>

                            <label className="cursor-pointer group">
                                <input
                                    type="radio"
                                    name="status"
                                    value="declined"
                                    checked={status === 'declined'}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="hidden"
                                />
                                <div className={`w-32 h-32 border border-charcoal border-opacity-20 flex flex-col items-center justify-center rounded-full transition-all duration-300 ${status === 'declined' ? 'bg-gray-200 text-charcoal scale-105' : 'hover:border-gray-400 hover:text-gray-400 text-gray-500'}`}>
                                    <span className="text-lg uppercase tracking-widest">Decline</span>
                                </div>
                            </label>
                        </div>

                        {status === 'attending' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-6 text-left max-w-sm mx-auto"
                            >
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-charcoal mb-2 ml-1">Email (for updates)</label>
                                    <input
                                        type="email"
                                        className="w-full glass-input bg-white"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs uppercase tracking-widest text-charcoal mb-2 ml-1">Bringing a Plus One?</label>
                                        <select
                                            value={plusOneCount}
                                            onChange={(e) => setPlusOneCount(parseInt(e.target.value))}
                                            className="w-full glass-input bg-white appearance-none"
                                        >
                                            <option value={0}>No, just me</option>
                                            <option value={1}>Yes +1</option>
                                            <option value={2}>Yes +2 (Family)</option>
                                            <option value={3}>Yes +3 (Family)</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs uppercase tracking-widest text-charcoal mb-2 ml-1">Relationship</label>
                                        <select
                                            value={isFamily ? 'family' : 'guest'}
                                            onChange={(e) => setIsFamily(e.target.value === 'family')}
                                            className="w-full glass-input bg-white appearance-none"
                                        >
                                            <option value="guest">Guest</option>
                                            <option value="family">Immediate Family</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-charcoal mb-2 ml-1">Dietary Restrictions / Allergies</label>
                                    <textarea
                                        className="w-full glass-input bg-white"
                                        rows="2"
                                        placeholder="Gluten-free, vegan, nut allergy, etc."
                                        value={dietaryRestrictions}
                                        onChange={(e) => setDietaryRestrictions(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Always show notes */}
                        <div className="text-left w-full max-w-sm mx-auto">
                            <label className="block text-xs uppercase tracking-widest text-charcoal mb-2 ml-1">Other Notes / Message</label>
                            <textarea
                                className="w-full glass-input bg-white"
                                rows="2"
                                placeholder="Any other questions or a message for us?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="glass-btn border border-charcoal border-opacity-10">
                            Confirm RSVP
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default RSVP;
