import { motion } from 'framer-motion';
import { useState } from 'react';
import iconCouples from '../assets/couple_gold.svg';
const videoSource = '/assets/our_story.mp4';
import posterImage from '../assets/couple_standing_red_opt.jpg';

const Story = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleVideoWaiting = () => setIsLoading(true);
    const handleVideoPlaying = () => setIsLoading(false);
    const handleCanPlay = () => setIsLoading(false);

    return (
        <div className="bg-rich-black min-h-screen text-white pt-24 pb-24">

            {/* Header / Title */}
            <div className="container mx-auto px-6 text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-serif text-gold-gradient mb-6"
                >
                    Our Story
                </motion.h1>
                <div className="w-24 h-[1px] bg-gold mx-auto mb-8 opacity-50" />
                <p className="text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
                    A visual journey through twenty years of love, laughter, and building a life together.
                </p>
            </div>

            {/* Standard Video Player Section */}
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] border border-gold/20"
                >
                    {/* Loading Spinner */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                        </div>
                    )}

                    <video
                        className="w-full h-full object-contain"
                        controls
                        playsInline
                        poster={posterImage}
                        onWaiting={handleVideoWaiting}
                        onPlaying={handleVideoPlaying}
                        onCanPlay={handleCanPlay}
                    >
                        <source src={videoSource} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            </div>

            {/* Poetic Text Section */}
            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
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

                {/* Watermark Section */}
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
