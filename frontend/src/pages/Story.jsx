import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import coupleImage from '../assets/couple.png';

const StorySection = ({ title, text, align = "left", year }) => {
    return (
        <div className={`min-h-[80vh] flex flex-col justify-center px-4 md:px-20 py-20 ${align === 'right' ? 'items-end text-end' : 'items-start'}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl relative"
            >
                <span className="absolute -top-12 -left-8 md:-left-20 text-[6rem] md:text-[10rem] font-serif text-charcoal opacity-5 select-none pointer-events-none z-0">
                    {year}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif text-charcoal mb-8 relative z-10">{title}</h2>
                <p className="text-gray-600 text-lg md:text-xl font-light leading-relaxed relative z-10">
                    {text}
                </p>
            </motion.div>
        </div>
    );
}

const Story = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    return (
        <div ref={containerRef} className="min-h-screen bg-white">
            {/* Parallax Hero */}
            <div className="h-screen relative overflow-hidden flex items-center justify-center sticky top-0 z-0">
                <motion.div
                    style={{ scale }}
                    className="absolute inset-0 bg-cover bg-center opacity-80" // Increased opacity for white theme
                >
                    <img src={coupleImage} alt="Couple" className="w-full h-full object-cover grayscale" /> {/* Force grayscale for editorial look */}
                </motion.div>
                {/* Gradient to white at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-8xl md:text-[12rem] font-serif leading-none tracking-tighter text-white mix-blend-difference" // Ensures visibility
                    >
                        Our Story
                    </motion.h1>
                </div>
            </div>

            <div className="relative z-10 bg-white -mt-[100vh] pt-[100vh]">
                <StorySection
                    year="2015"
                    title="The Beginning"
                    text="It started not with a spark, but with a slow burn. A chance meeting at a gallery opening in downtown New York. We talked about art for hours, unaware that we were painting the first strokes of a masterpiece together."
                />
                <StorySection
                    align="right"
                    year="2019"
                    title="The Proposal"
                    text="Under the vast canopy of the Icelandic sky, with the northern lights dancing above, a question was asked. A kneeling silhouette against the emerald glow. 'Yes' echoed through the silence of the snow."
                />
                <StorySection
                    year="2024"
                    title="The Celebration"
                    text="Ten years later, we stand here. Not just looking back at the memories we've built, but looking forward to the horizons yet to be explored. This anniversary isn't just a date; it's a testament to the journey."
                />
                <div className="h-40"></div>
            </div>
        </div>
    );
};

export default Story;
