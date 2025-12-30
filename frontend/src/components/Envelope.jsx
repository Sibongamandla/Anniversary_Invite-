import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Envelope = ({ onOpen }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            // Delay calling the parent onOpen handler to allow animation to play
            setTimeout(() => {
                onOpen && onOpen();
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative perspective-1000 group cursor-pointer"
                onClick={handleOpen}
            >
                <div className={`relative w-[300px] h-[200px] transition-transform duration-1000 preserve-3d ${isOpen ? 'translate-y-[100px]' : ''}`}>

                    {/* Envelope Body (Back) */}
                    <div className="absolute inset-0 bg-[#1a1a1a] border border-gold/30 rounded-sm shadow-2xl" />

                    {/* The Letter (Invitation) */}
                    <div className={`absolute left-2 right-2 top-2 bottom-2 bg-[#fdfcf8] p-4 flex flex-col items-center justify-center text-center shadow-inner transition-transform duration-700 ease-out origin-bottom ${isOpen ? '-translate-y-[120px] z-20' : 'z-10'}`}>
                        <p className="font-script text-gold text-2xl mb-1">Boitumelo & Comfort</p>
                        <p className="font-serif text-charcoal text-xs uppercase tracking-widest mt-2">Vows & Vines</p>
                        <p className="font-sans text-[10px] text-gray-400 mt-4">Tap to begin</p>
                    </div>

                    {/* Envelope Flap (Front - Top) */}
                    <div
                        className={`absolute top-0 left-0 w-full h-1/2 bg-[#2a2a2a] origin-top transition-transform duration-700 ease-in-out border-t border-gold/20 z-30 ${isOpen ? 'rotate-x-180 -z-10 bg-[#222]' : ''}`}
                        style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
                    />

                    {/* Envelope Body (Front - Bottom) */}
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#222] border-t border-gold/10 z-20 pointer-events-none"
                        style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}
                    />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[#1e1e1e] border-r border-gold/10 z-20 pointer-events-none"
                        style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }}
                    />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[#1e1e1e] border-l border-gold/10 z-20 pointer-events-none"
                        style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}
                    />

                    {/* Start Button Overlay (Only visible before open) */}
                    {!isOpen && (
                        <div className="absolute inset-0 flex items-center justify-center z-40">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center"
                            >
                                <div className="w-8 h-8 rounded-full bg-gold shadow-[0_0_15px_rgba(184,134,11,0.6)]" />
                            </motion.div>
                        </div>
                    )}

                </div>

                {!isOpen && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-white text-center mt-12 font-serif tracking-widest text-sm uppercase"
                    >
                        Your journey awaits
                    </motion.p>
                )}

            </motion.div>
        </div>
    );
};

export default Envelope;
