import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Volume2, VolumeX, X } from 'lucide-react';
import iconCouples from '../assets/couple_gold.svg';
const videoSource = '/assets/our_story.mp4';
import posterImage from '../assets/couple_standing_red_opt.jpg';

const Story = () => {
    // Audio ON by default (note: browsers may still block this, requires interaction usually)
    const [isMuted, setIsMuted] = useState(false);
    const [showFloating, setShowFloating] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // New state for expansion
    const [hasCompletedOnce, setHasCompletedOnce] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track video buffering

    const videoRef = useRef(null);
    const floatingVideoRef = useRef(null);
    const widgetRef = useRef(null); // Ref for scrolling to widget

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        setIsMuted(prev => !prev);
    };

    const handleVideoWaiting = () => setIsLoading(true);
    const handleVideoPlaying = () => setIsLoading(false);

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

        const safePlay = async (videoEl) => {
            try {
                if (videoEl && videoEl.paused) {
                    await videoEl.play();
                }
            } catch (e) {
                // Ignore AbortError and NotAllowedError (autoplay)
                if (e.name !== 'AbortError' && e.name !== 'NotAllowedError') {
                    console.log("Video Play Error:", e);
                }
            }
        };

        if (showFloating) {
            // Pause Main, Play Floating
            if (videoRef.current) videoRef.current.pause();

            if (floatingVideoRef.current) {
                // Sync time if drifting
                if (videoRef.current && Math.abs(floatingVideoRef.current.currentTime - videoRef.current.currentTime) > 0.5) {
                    floatingVideoRef.current.currentTime = videoRef.current.currentTime;
                }
                safePlay(floatingVideoRef.current);
            }
        } else {
            // Pause Floating, Play Main
            if (floatingVideoRef.current) floatingVideoRef.current.pause();

            if (videoRef.current && !hasCompletedOnce) {
                safePlay(videoRef.current);
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
                        preload="metadata" // Changed from auto to prevent 96MB payload hit on load
                        poster={posterImage}
                        onEnded={handleVideoEnded}
                        onWaiting={handleVideoWaiting}
                        onPlaying={handleVideoPlaying}
                        onCanPlay={handleVideoPlaying}
                        muted={isMuted} // Controlled by state
                        playsInline
                        className="w-full h-full object-contain object-center opacity-80"
                    >
                        <source src={videoSource} type="video/mp4" />
                    </motion.video>

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-black/40" />

                {/* Hero Sound Toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={toggleMute}
                    className="absolute bottom-32 right-6 md:bottom-20 md:right-10 z-20 text-white hover:text-gold transition-colors flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                >
                    <span className="text-xs uppercase tracking-widest hidden md:block">{isMuted ? "Unmute" : "Mute Sound"}</span>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>

                {/* Scroll Hint */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
                >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll to Explore</p>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-gold to-transparent" />
                </motion.div>
            </div>

            {/* Floating Video Widget - Rendered via Portal to escape parent transforms */}
            {showFloating && createPortal(
                <AnimatePresence>
                    {/* Backdrop for Expanded Mode */}
                    {isExpanded && (
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsExpanded(false)}
                            className="fixed inset-0 bg-black/90 z-[9999] backdrop-blur-md"
                        />
                    )}

                    <motion.div
                        key="floating-widget"
                        ref={widgetRef}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`fixed z-[10000] bg-black border border-gold/30 overflow-hidden cursor-pointer
                            ${isExpanded
                                ? 'w-[90vw] max-w-[800px] h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[4px]'
                                : 'w-[140px] h-[200px] right-4 bottom-8 rounded-xl hover:scale-105'
                            }
                            ${!isExpanded && 'safe-area-bottom'}
                        `}
                        // Note: safe-area-bottom class needs to be defined or handled via inline style if using complex calc
                        style={{
                            bottom: !isExpanded ? 'max(2rem, env(safe-area-inset-bottom))' : 'auto',
                            aspectRatio: isExpanded ? '16/9' : '9/16'
                        }}
                    >
                        <video
                            ref={floatingVideoRef}
                            className="w-full h-full object-contain bg-black pointer-events-none" // Pass clicks to container
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
