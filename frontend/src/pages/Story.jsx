import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const Story = () => {
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    // Attempt to handle audio based on user interaction preference (default browser policy might block)
    // We'll try to play if not muted, but handle errors gracefully.
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3; // Gentle volume
            if (!isMuted) {
                audioRef.current.play().catch(e => console.log("Audio play failed (waiting for interaction):", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="bg-rich-black min-h-screen text-white">
            {/* Hidden Audio Element - using a placeholder gentle instrumental */}
            <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-111161.mp3" />

            {/* Hero Section with Video */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black">
                    {/* Romantic Couple Video Placeholder */}
                    <motion.video
                        ref={videoRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 2 }}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src="https://videos.pexels.com/video-files/3655611/3655611-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    </motion.video>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-black/40" />

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-script text-gold mb-4"
                    >
                        Our Making
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-sm md:text-base uppercase tracking-[0.4em] font-light text-white/80"
                    >
                        A Love Matured in Grace
                    </motion.p>
                </div>

                {/* Sound Toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    onClick={toggleMute}
                    className="absolute bottom-10 right-10 z-20 text-white/50 hover:text-white transition-colors p-4 border border-white/10 rounded-full bg-black/20 backdrop-blur-sm"
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>
            </div>

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

                {/* Decorative End */}
                <div className="mt-32 flex justify-center opacity-30">
                    <div className="w-1 h-24 bg-gradient-to-b from-gold to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default Story;
