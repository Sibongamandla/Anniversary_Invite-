import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Volume2, VolumeX, X } from 'lucide-react';
import iconCouples from '../assets/couple_gold.svg';
import videoSource from '../assets/our_story.mp4';

const Story = () => {
    // Audio ON by default (note: browsers may still block this, requires interaction usually)
    const [isMuted, setIsMuted] = useState(false);
    const [showFloating, setShowFloating] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // New state for expansion
    const [hasCompletedOnce, setHasCompletedOnce] = useState(false);

    const videoRef = useRef(null);
    const floatingVideoRef = useRef(null);
    const widgetRef = useRef(null); // Ref for scrolling to widget

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        setIsMuted(prev => !prev);
    };

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = window.innerHeight * 0.8; // Trigger bit earlier
            if (window.scrollY > heroHeight && !hasCompletedOnce) {
                setShowFloating(true);
            } else {
                setShowFloating(false);
                setIsExpanded(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasCompletedOnce]);

    // SMART SWITCHING & SYNC LOGIC
    useEffect(() => {
        // Sync muted state
        if (videoRef.current) videoRef.current.muted = isMuted;
        if (floatingVideoRef.current) floatingVideoRef.current.muted = isMuted;

        if (showFloating) {
            // Pause Main, Play Floating
            if (videoRef.current) videoRef.current.pause();

            if (floatingVideoRef.current) {
                // Sync time if drifting
                if (videoRef.current && Math.abs(floatingVideoRef.current.currentTime - videoRef.current.currentTime) > 0.5) {
                    floatingVideoRef.current.currentTime = videoRef.current.currentTime;
                }
                const playPromise = floatingVideoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.log("Floating play prevented (autoplay policy):", e));
                }
            }
        } else {
            // Pause Floating, Play Main
            if (floatingVideoRef.current) floatingVideoRef.current.pause();

            if (videoRef.current && !hasCompletedOnce) {
                if (videoRef.current.paused) {
                    videoRef.current.play().catch(e => console.log("Hero play prevented:", e));
                }
            }
        }
    }, [showFloating, isMuted, hasCompletedOnce]);

    const handleVideoEnded = () => {
        setHasCompletedOnce(true);
        setShowFloating(false);
        setIsExpanded(false);
    };

    // Auto-scroll to center when expanded
    useEffect(() => {
        if (isExpanded && widgetRef.current) {
            // Small delay to allow expansion animation to start
            setTimeout(() => {
                widgetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }, 100);
        }
    }, [isExpanded]);

    return (
        <div className="bg-rich-black min-h-screen text-white relative">
            {/* Hero Section with Video */}
            <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black">
                    <motion.video
                        ref={videoRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 0.8 }} // Faster fade-in
                        autoPlay
                        loop={false}
                        preload="auto" // Preload for faster start
                        onEnded={handleVideoEnded}
                        muted={isMuted} // Controlled by state
                        playsInline
                        className="w-full h-full object-contain object-center opacity-80"
                    >
                        <source src={videoSource} type="video/mp4" />
                    </motion.video>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-black/40" />

                {/* Hero Sound Toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={toggleMute}
                    className="absolute bottom-24 right-6 md:bottom-10 md:right-10 z-20 text-white/50 hover:text-white transition-colors p-3 md:p-4 border border-white/10 rounded-full bg-black/20 backdrop-blur-sm"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>
            </div>

            {/* Floating Video Widget - Rendered via Portal to escape parent transforms */}
            {showFloating && createPortal(
                <AnimatePresence>
                    {/* Backdrop for Expanded Mode */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 bg-black/90 z-[9999] backdrop-blur-md"
                        />
                    )}

                    <motion.div
                        ref={widgetRef}
                        layout
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={isExpanded ? {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            width: "90%",
                            maxWidth: "800px",
                            height: "auto",
                            left: "50%",
                            x: "-50%",
                            top: "50%",
                            y: "-50%",
                            bottom: "auto",
                            borderRadius: "4px"
                        } : {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            width: "140px",
                            height: "200px",
                            left: "auto",
                            x: "0%",
                            right: "1rem",
                            top: "auto",
                            bottom: "2rem",
                            borderRadius: "12px"
                        }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`fixed z-[10000] bg-black border border-gold/30 shadow-2xl overflow-hidden cursor-pointer ${!isExpanded ? 'hover:scale-105 hover:border-gold transition-all' : ''}`}
                        style={{
                            aspectRatio: isExpanded ? '16/9' : '9/16',
                            transform: isExpanded ? 'translate(-50%, -50%)' : 'none'
                        }}
                    >
                        <video
                            ref={floatingVideoRef}
                            className="w-full h-full object-contain bg-black"
                            playsInline
                            muted={isMuted}
                            onEnded={handleVideoEnded}
                        >
                            <source src={videoSource} type="video/mp4" />
                        </video>

                        {/* Widget Controls */}
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <button
                                onClick={toggleMute}
                                className="text-white hover:text-gold bg-black/40 backdrop-blur-sm rounded-full p-2 transition-colors border border-white/10"
                            >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            {isExpanded && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                    className="text-white hover:text-red-500 bg-black/40 backdrop-blur-sm rounded-full p-2 transition-colors border border-white/10"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>,
                document.body // Portal Target
            )}

            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                {/* Poetic Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center font-serif text-lg md:text-2xl leading-loose font-light space-y-12 text-gray-300"
                >
                    <p>
                        What began as a spark grew slowly and patiently,<br />
                        like wine, deepening with time. Through seasons painted in red—<br />
                        passion, laughter, sacrifice, and fire—<br />
                        they learned that love isn’t rushed.
                    </p>
                    <p className="text-gold text-3xl md:text-4xl italic">
                        It’s chosen.<br />
                        Tended.<br />
                        Poured out, again and again.
                    </p>
                    <p>
                        What started young became divine—<br />
                        a love refined by years,<br />
                        strengthened renewed by grace,<br />
                        a sealed by commitment.
                    </p>
                    <p>
                        Twenty years later, their story is full-bodied and bold.<br />
                        Still rich.<br />
                        Still rare.<br />
                        Still worth raising a glass to.
                    </p>
                </motion.div>

                {/* Watermark Section Example */}
                <div className="mt-32 relative h-96 flex items-center justify-center">
                    <img src={iconCouples} className="h-full w-auto max-w-full opacity-25 absolute pointer-events-none mix-blend-screen object-contain" />
                    <p className="relative z-10 text-center text-gold font-script text-4xl max-w-2xl px-4">
                        "Two souls, one heart, a journey forever unfolding."
                    </p>
                </div>

                {/* Decorative End */}
                <div className="mt-32 flex justify-center opacity-30">
                    <div className="w-1 h-24 bg-gradient-to-b from-gold to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default Story;
