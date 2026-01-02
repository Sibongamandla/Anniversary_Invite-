import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import api from '../api';
import iconRings from '../assets/rings_white.svg';
import iconBouquet from '../assets/bouquet_white_opt.png';
import { motion, AnimatePresence } from 'framer-motion';

const RSVP = () => {
    const { code } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form Fields
    const [name, setName] = useState('');
    const [status, setStatus] = useState('attending');
    const [plusOneName, setPlusOneName] = useState('');
    const [dietary, setDietary] = useState(''); // New Field
    const [questions, setQuestions] = useState(''); // New Field

    // Derived state for validation
    const isAttending = status === 'attending';

    useEffect(() => {
        const fetchGuest = async () => {
            try {
                const response = await api.get(`/rsvp/${code}`);
                setName(response.data.name || '');
                if (response.data.rsvp_status) setStatus(response.data.rsvp_status);
                // We might pre-fill notes if parsed, but for now we leave blank/custom
            } catch (err) {
                setError('Invalid invitation code.');
            } finally {
                setLoading(false);
            }
        };
        fetchGuest();
    }, [code]);

    const { unlock } = useGuest();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct detailed notes string
            const notesParts = [];
            if (plusOneName) notesParts.push(`Plus One: ${plusOneName}`);
            if (dietary) notesParts.push(`Dietary: ${dietary}`);
            if (questions) notesParts.push(`Q: ${questions}`);

            const compiledNotes = notesParts.join(' | ');

            await api.post(`/rsvp/${code}`, {
                rsvp_status: status,
                notes: compiledNotes,
                name: name,
                plus_one_count: plusOneName ? 1 : 0
            });

            unlock(code);
            setSuccessMsg('Kindly delivered. We eagerly await our celebration.');

            setTimeout(() => {
                navigate('/story');
            }, 3000);

        } catch (err) {
            setError('The courier stumbled. Please try sending again.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-rich-black text-gold font-serif italic">Checking Guest List...</div>;
    if (error) return <div className="flex justify-center items-center h-screen bg-rich-black text-red-400 font-serif text-xl">{error}</div>;

    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* Background Texture/Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-red-900/10 pointer-events-none"
            />

            <div className="relative z-10 w-full max-w-2xl">

                {/* The Physical Card Container */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="bg-[#faf9f6] text-gray-800 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    style={{
                        boxShadow: "0 0 0 1px #e5e5e5, 0 20px 40px -10px rgba(0,0,0,0.4)",
                        borderRadius: "2px" // Sharp paper corners
                    }}
                >
                    {/* Gold Foil Border Effect inside Card */}
                    <div className="absolute inset-3 border-2 border-gold/40 pointer-events-none" />
                    <div className="absolute inset-4 border border-gold/20 pointer-events-none" />

                    <div className="relative z-10 text-center space-y-8">

                        {/* Header */}
                        <div className="space-y-4">
                            <p className="font-serif italic text-gold text-lg">Répondez s'il vous plaît</p>
                            <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-gray-900">
                                The Pleasure of Your Reply
                            </h1>
                            <div className="h-px w-24 bg-gold mx-auto" />
                            <p className="font-serif text-gray-500 text-sm tracking-widest uppercase">Is Requested By August 1st</p>
                        </div>

                        {successMsg ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 space-y-6"
                            >
                                <div className="text-gold text-5xl">❦</div>
                                <p className="font-serif text-2xl text-gray-800 italic">{successMsg}</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-10 text-left mt-8 max-w-lg mx-auto">

                                {/* 1. Name */}
                                <div className="group">
                                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Guest Name(s)</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-300 py-2 font-serif text-2xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gold transition-colors text-center"
                                        placeholder="M."
                                        required
                                    />
                                </div>

                                {/* 2. Attendance */}
                                <div className="text-center space-y-6">
                                    <p className="font-serif text-xl italic text-gray-600">Will you be celebrating with us?</p>
                                    <div className="flex justify-center gap-8 md:gap-16">
                                        <label className="cursor-pointer group flex flex-col items-center gap-2">
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${status === 'attending' ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold'}`}>
                                                {status === 'attending' && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <span className={`font-serif text-lg ${status === 'attending' ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Accepts with Pleasure</span>
                                            <input type="radio" name="status" value="attending" checked={status === 'attending'} onChange={() => setStatus('attending')} className="hidden" />
                                        </label>

                                        <label className="cursor-pointer group flex flex-col items-center gap-2">
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${status === 'declined' ? 'border-gray-800 bg-gray-800' : 'border-gray-300 group-hover:border-gray-500'}`}>
                                            </div>
                                            <span className={`font-serif text-lg ${status === 'declined' ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Declines with Regret</span>
                                            <input type="radio" name="status" value="declined" checked={status === 'declined'} onChange={() => setStatus('declined')} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Conditional Fields for Attendees */}
                                <AnimatePresence>
                                    {isAttending && (
                                        <motion.div
                                            key="attendee-fields"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-8 overflow-hidden"
                                        >
                                            <div className="h-px w-full bg-gray-100" />

                                            {/* Plus One */}
                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Name of Plus One (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={plusOneName}
                                                    onChange={(e) => setPlusOneName(e.target.value)}
                                                    className="w-full bg-transparent border-b border-gray-300 py-1 font-serif text-xl text-gray-800 placeholder:text-gray-200 focus:outline-none focus:border-gold transition-colors"
                                                    placeholder="Full Name"
                                                />
                                            </div>

                                            {/* Dietary */}
                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Dietary Requirements</label>
                                                <input
                                                    type="text"
                                                    value={dietary}
                                                    onChange={(e) => setDietary(e.target.value)}
                                                    className="w-full bg-transparent border-b border-gray-300 py-1 font-serif text-xl text-gray-800 placeholder:text-gray-200 focus:outline-none focus:border-gold transition-colors"
                                                    placeholder="Allergies, Vegetarian, etc."
                                                />
                                            </div>

                                            {/* Questions */}
                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 group-focus-within:text-gold transition-colors">Questions or Messages</label>
                                                <textarea
                                                    value={questions}
                                                    onChange={(e) => setQuestions(e.target.value)}
                                                    className="w-full bg-transparent border-b border-gray-300 py-1 font-serif text-xl text-gray-800 placeholder:text-gray-200 focus:outline-none focus:border-gold transition-colors resize-none"
                                                    placeholder="Any questions for the couple?"
                                                    rows={1}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <div className="pt-8 text-center">
                                    <button
                                        type="submit"
                                        className="bg-rich-black text-white font-serif italic text-xl px-12 py-3 hover:bg-gold hover:text-white transition-colors duration-500 shadow-lg"
                                    >
                                        Deliver Response
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RSVP;
