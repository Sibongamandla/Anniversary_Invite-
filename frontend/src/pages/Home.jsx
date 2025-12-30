import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Envelope from '../components/Envelope';
import { useGuest } from '../context/GuestContext';
import heroImage from '../assets/hero_couple_romantic.png';

const Home = () => {
    const { guest, logout } = useGuest();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

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

            <Navbar />

            <main className="h-full w-full">
                {/* Hero Section */}
                <div className="relative h-full w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt="Couple"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-black opacity-60" />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-gold font-script text-3xl md:text-4xl mb-4"
                        >
                            Still the One
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="text-6xl md:text-8xl lg:text-9xl font-serif text-white mb-6 leading-none tracking-tight"
                        >
                            Vows & Vines
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100px" }}
                            transition={{ delay: 1, duration: 1 }}
                            className="h-[1px] bg-gold mb-6"
                        />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-sm md:text-base uppercase tracking-[0.3em] text-gray-300 font-light"
                        >
                            A Covenant Renewed - Destiny Fulfilled
                        </motion.p>
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
