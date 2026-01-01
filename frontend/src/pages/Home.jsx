import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Envelope from '../components/Envelope';
import { useGuest } from '../context/GuestContext';
import heroImage from '../assets/couple_formal_red.jpg';
import iconBouquet from '../assets/bouquet_white.svg';
import iconOlive from '../assets/olive_gold.svg';

const Home = () => {
    // const { guest, logout } = useGuest(); // Removed incorrect destructuring
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [hasRSVP, setHasRSVP] = useState(false);
    const { guestCode } = useGuest();

    // Check RSVP status if logged in
    useEffect(() => {
        if (guestCode) {
            // We need to check if they have already RSVP'd
            // Assuming we can check this via the existing API or a new endpoint
            // For now, let's use the guest info endpoint
            import('../api').then(module => {
                const api = module.default;
                api.get(`/rsvp/${guestCode}`)
                    .then(res => {
                        if (res.data.rsvp_status && (res.data.rsvp_status === 'attending' || res.data.rsvp_status === 'declined')) {
                            setHasRSVP(true);
                        }
                    })
                    .catch(console.error);
            });
        }
    }, [guestCode]);

    // 'normal', 'envelope'
    const [viewState, setViewState] = useState('normal');

    useEffect(() => {
        // Check if we returned from a successful RSVP
        if (searchParams.get('rsvp') === 'success') {
            setViewState('envelope');
            // Clean up URL
            window.history.replaceState({}, '', '/');
        }
    }, [searchParams]);

    // Handle envelope opening
    const handleEnvelopeOpen = () => {
        setViewState('normal');
    };

    const handleUnlock = (e) => {
        e.preventDefault();
        // Mock unlock for now
        if (code.toLowerCase() === 'vows2026') {
            alert("Welcome!");
        } else {
            setError('Please try again.');
        }
    };

    return (
        <div className="bg-rich-black h-screen text-white/90 font-serif selection:bg-gold/30 overflow-hidden">

            <AnimatePresence>
                {viewState === 'envelope' && <Envelope key="envelope" onOpen={handleEnvelopeOpen} />}
            </AnimatePresence>

            <main className="h-full w-full">
                {/* Hero Section */}
                <div className="relative h-full w-full overflow-hidden">
                    <motion.div
                        className="absolute inset-0 z-0 opacity-50"
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rich-black/10 to-rich-black" />
                        <img src={heroImage} alt="Couple" className="w-full h-full object-cover" />
                    </motion.div>

                    {/* White Bouquet Watermark */}
                    {/* White Bouquet Watermarks - Framing the bottom */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -5, x: -100 }}
                        animate={{ opacity: 0.4, rotate: 15, x: 0 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute -bottom-16 -left-16 md:-bottom-32 md:-left-32 w-[300px] h-[300px] md:w-[700px] md:h-[700px] pointer-events-none z-10 mix-blend-screen opacity-30 md:opacity-40"
                    >
                        <img src={iconBouquet} className="w-full h-full object-contain" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, rotate: 5, x: 100 }}
                        animate={{ opacity: 0.4, rotate: -15, x: 0 }}
                        transition={{ duration: 2, delay: 0.7 }}
                        className="absolute -bottom-16 -right-16 md:-bottom-32 md:-right-32 w-[300px] h-[300px] md:w-[700px] md:h-[700px] pointer-events-none z-10 mix-blend-screen opacity-30 md:opacity-40"
                    >
                        <img src={iconBouquet} className="w-full h-full object-contain transform scale-x-[-1]" />
                    </motion.div>

                    <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5, type: "spring" }}
                            className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] absolute bg-red-900/20 blur-[80px] md:blur-[120px] rounded-full pointer-events-none -z-10"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-gold font-script text-3xl md:text-5xl mb-4 md:mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        >
                            Nineteen Years
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="text-5xl md:text-8xl lg:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 mb-6 md:mb-8 leading-none tracking-tight drop-shadow-2xl"
                        >
                            Vows & Vines
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "160px" }}
                            transition={{ delay: 1, duration: 1 }}
                            className="h-[1px] md:h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-6 md:mb-8"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-xs md:text-lg uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold/80 font-light flex flex-col md:flex-row items-center gap-2 md:gap-0"
                        >
                            <span>A Covenant Renewed</span>
                            <span className="hidden md:inline text-white/30 px-4">•</span>
                            <span>Destiny Fulfilled</span>
                        </motion.p>


                        <AnimatePresence>
                            {/* Code Entry Modal */}
                            {searchParams.get('action') === 'enter_code' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, y: 20 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0.9, y: 20 }}
                                        className="bg-rich-black border border-gold/30 p-8 rounded-lg max-w-md w-full relative shadow-2xl"
                                    >
                                        <button
                                            onClick={() => navigate('/')}
                                            className="absolute top-4 right-4 text-white/50 hover:text-white"
                                        >
                                            ✕
                                        </button>
                                        <h3 className="text-2xl font-serif text-gold mb-6 text-center">Unseal the Invitation</h3>
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            if (code.toLowerCase() === 'vows2026') {
                                                // We need a proper context method to set guest, but for now we simulate it or redirect
                                                // Assuming we have a way to 'login' via URL or we just mock it here if possible.
                                                // Since we don't have login function exposed here easily without context refactor,
                                                // We will redirect to the join route which handles logic
                                                navigate(`/join/${code}`);
                                            } else {
                                                setError('Incorrect code. Please check your invitation.');
                                            }
                                        }}>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={code}
                                                    onChange={(e) => { setCode(e.target.value); setError(''); }}
                                                    placeholder="Enter Guest Code"
                                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white placeholder:text-white/30 focus:border-gold outline-none transition-colors text-center uppercase tracking-widest"
                                                    autoFocus
                                                />
                                                {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                                                <button
                                                    type="submit"
                                                    className="w-full bg-gold text-rich-black font-bold uppercase tracking-widest py-3 rounded hover:bg-white transition-colors"
                                                >
                                                    Reveal
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 }}
                            // 3. guestCode && hasRSVP -> Hide button or change text logic
                            // If hasRSVP, we want to hide it as per user request
                            style={{ display: (guestCode && hasRSVP) ? 'none' : 'block' }}
                            onClick={() => {
                                if (!guestCode) {
                                    // Open Modal via URL state to keep history clean/shareable
                                    navigate('?action=enter_code');
                                } else {
                                    navigate(`/join/${guestCode}`);
                                }
                            }}
                            className="mt-12 glass-btn text-xs md:text-sm"
                        >
                            {guestCode ? "RSVP Now" : "Access Invite"}
                        </motion.button>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-gold/70">Scroll to Explore</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Home;
