import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

import { Volume2, VolumeX } from 'lucide-react';
import iconCouples from '../assets/couple_gold.svg';
import iconRosemary from '../assets/rosemary_gold.svg';
import videoSource from '../assets/our_story.mp4';

const Story = () => {
    const [isMuted, setIsMuted] = useState(false); // Audio enabled by default
    const videoRef = useRef(null);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="bg-rich-black min-h-screen text-white">
            {/* Hero Section with Video */}
            <div className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black">
                    {/* Romantic Couple Video */}
                    <motion.video
                        ref={videoRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ duration: 2 }}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-contain object-center opacity-80"
                    >
                        <source src={videoSource} type="video/mp4" />
                    </motion.video>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-black/40" />

                <div className="relative z-10 text-center px-4">
                    {/* Title Removed */}
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
