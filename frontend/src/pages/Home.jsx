import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../assets/hero.png';
import { useGuest } from '../context/GuestContext';

const Home = () => {
    const [code, setCode] = useState('');
    const [isInputOpen, setIsInputOpen] = useState(false);
    const navigate = useNavigate();
    const { unlock, guestCode } = useGuest();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.trim()) {
            unlock(code.trim());
            navigate(`/join/${code.trim()}`);
        }
    };

    if (guestCode) {
        return (
            <div className="w-full bg-white relative">
                {/* Hero Section - Unlocked */}
                <div className="h-screen w-full relative overflow-hidden bg-black">
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 z-0"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40" />
                    </motion.div>

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-[12vw] leading-none font-serif tracking-tighter text-center"
                        >
                            FOREVER
                        </motion.h1>
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-xl md:text-2xl uppercase tracking-[0.3em] font-light mb-2">Cape Town</p>
                            <p className="text-sm md:text-md italic text-gold">December 2025</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="absolute bottom-12 animate-bounce"
                        >
                            <p className="text-xs uppercase tracking-widest text-gray-400">Scroll</p>
                        </motion.div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="max-w-4xl mx-auto px-6 py-24 space-y-32">

                    {/* Welcome */}
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8">A Decade of Love</h2>
                        <p className="text-gray-600 leading-relaxed text-lg font-light">
                            We invite you to join us in one of the most beautiful cities in the world to celebrate our 10th anniversary.
                            Cape Town holds a special place in our hearts, and we can't wait to share its magic with you.
                            From the vineyards of Constantia to the shores of the Atlantic, get ready for an unforgettable weekend.
                        </p>
                    </motion.section>

                    {/* Image / Quote */}
                    <div className="h-[60vh] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-charcoal opacity-5 pattern-grid-lg" />
                        <blockquote className="relative z-10 text-3xl md:text-5xl font-serif text-charcoal text-center max-w-2xl px-6 italic">
                            "To love and be loved is to feel the sun from both sides."
                        </blockquote>
                    </div>

                    {/* Details Teaser */}
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div className="text-right space-y-4">
                            <h3 className="text-xs font-bold tracking-[0.2em] text-gold uppercase">The Celebration</h3>
                            <h2 className="text-4xl font-serif text-charcoal">The Grand Estate</h2>
                            <p className="text-gray-600 font-light">
                                An elegant evening of fine dining, dancing, and memories under the stars.
                                Join us at the historic Grand Estate in Constantia.
                            </p>
                            <button onClick={() => navigate('/venue')} className="inline-block border-b border-charcoal pb-1 text-charcoal hover:text-gold transition-colors text-sm uppercase tracking-widest mt-4">
                                View Venue
                            </button>
                        </div>
                        <div className="bg-gray-200 h-96 w-full grayscale hover:grayscale-0 transition-all duration-700">
                            {/* Placeholder for a venue image */}
                            <img src={heroImage} alt="Venue" className="w-full h-full object-cover" />
                        </div>
                    </motion.section>
                </div>

                <footer className="bg-charcoal text-white py-12 text-center">
                    <p className="font-script text-5xl mb-4 text-gold">S & K</p>
                    <p className="text-xs uppercase tracking-widest opacity-50">Cape Town • 2025</p>
                </footer>
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative overflow-hidden bg-black">
            {/* Full Screen Hero Image */}
            <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" /> {/* Subtle overlay */}
            </motion.div>

            {/* Title Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-[15vw] leading-none font-serif text-white mix-blend-overlay opacity-90 tracking-tighter text-center"
                >
                    FOREVER
                </motion.h1>
                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="text-2xl md:text-3xl text-gold mt-4 font-script mix-blend-screen"
                >
                    Est. 2015
                </motion.p>
            </div>

            {/* Minimalist Unlock Interaction */}
            <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center">
                <AnimatePresence mode="wait">
                    {!isInputOpen ? (
                        <motion.button
                            layoutId="input-container"
                            onClick={() => setIsInputOpen(true)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 1 }}
                            className="text-white text-xs uppercase tracking-[0.3em] hover:text-gold transition-colors pb-1 border-b border-transparent hover:border-gold"
                        >
                            Unlock Invitation
                        </motion.button>
                    ) : (
                        <motion.form
                            layoutId="input-container"
                            onSubmit={handleSubmit}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="flex flex-col items-center gap-4 bg-black bg-opacity-80 backdrop-blur-md px-8 py-6 rounded-sm border border-white border-opacity-10"
                        >
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Enter Invite Code</p>
                            <input
                                autoFocus
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="bg-transparent border-b border-white border-opacity-30 text-center text-3xl font-serif text-white focus:outline-none focus:border-gold w-40 pb-2 tracking-[0.2em] uppercase"
                            />
                            <button
                                type="submit"
                                className="text-xs uppercase tracking-widest text-gold hover:text-white transition-colors mt-2"
                            >
                                Enter
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsInputOpen(false)}
                                className="absolute top-2 right-4 text-gray-500 hover:text-white"
                            >
                                ×
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Home;
