import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import coupleImage from '../assets/couple.png';
import floralDivider from '../assets/floral_divider.png';

const TimelineNode = ({ year, title, text, align = "left", isLast = false }) => {
    return (
        <div className={`relative flex ${align === 'right' ? 'flex-row-reverse' : 'flex-row'} items-center justify-between w-full max-w-6xl mx-auto py-24 md:py-32 px-4`}>
            {/* Center Line Node */}
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-[3px] border-white z-20 shadow-lg" />

            {/* Content Side */}
            <motion.div
                initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`w-full md:w-[45%] ${align === 'right' ? 'text-left md:text-left' : 'text-right md:text-right'} relative`}
            >
                <span className="text-8xl md:text-9xl font-serif text-charcoal opacity-5 absolute -top-16 block w-full select-none pointer-events-none">
                    {year}
                </span>
                <div className="relative z-10">
                    <h3 className="text-3xl md:text-5xl font-serif text-charcoal mb-4">{title}</h3>
                    <img src={floralDivider} alt="decoration" className="h-4 w-auto object-contain mb-6 opacity-60 mx-auto md:mx-0 inline-block" />
                    <p className="text-gray-600 font-light leading-loose text-lg">
                        {text}
                    </p>
                </div>
            </motion.div>

            {/* Scale Balance for Layout */}
            <div className="hidden md:block w-[45%]" />
        </div>
    );
};

const Story = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
    const lineHeight = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="bg-white min-h-screen">
            {/* Parallax Hero */}
            <div className="h-screen sticky top-0 z-0 overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ scale }}
                    className="absolute inset-0 bg-cover bg-center"
                >
                    <img src={coupleImage} alt="Couple" className="w-full h-full object-cover grayscale opacity-90" />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>

                <div className="relative z-10 text-center px-4">
                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1.5 }}
                        className="text-white text-sm md:text-base uppercase tracking-[0.5em] mb-4"
                    >
                        Ten Years In The Making
                    </motion.p>
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-7xl md:text-9xl font-serif text-white mix-blend-overlay"
                    >
                        Our Story
                    </motion.h1>
                </div>

                {/* Fade to White at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
            </div>

            {/* Timeline Section */}
            <div className="relative z-10 bg-white pt-32 pb-64">
                {/* Vertical Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gray-200 z-0">
                    <motion.div
                        style={{ height: lineHeight }}
                        className="w-full bg-gold origin-top"
                    />
                </div>

                <div className="max-w-7xl mx-auto">
                    <TimelineNode
                        year="2015"
                        title="The First Meeting"
                        text="It started not with a spark, but with a slow, deliberate burn. A chance encounter at a gallery opening in downtown New York. We talked about art for hours, unaware that we were painting the first strokes of our own masterpiece."
                        align="left"
                    />

                    <TimelineNode
                        year="2017"
                        title="Building A Life"
                        text="Two years of coffee dates, late-night drives, and shared dreams. We moved into our first apartment—a small, sun-drenched studio that smelled of old books and fresh espresso. It wasn't much, but it was ours."
                        align="right"
                    />

                    <TimelineNode
                        year="2019"
                        title="The Yes"
                        text="Under the vast canopy of the Icelandic sky, with the northern lights dancing emerald and violet above, a question was asked. A kneeling silhouette against the glow. The silence of the snow was broken only by a whispered 'Yes'."
                        align="left"
                    />

                    <TimelineNode
                        year="2024"
                        title="Forever & Always"
                        text="Ten years later, we stand here. Not just looking back at the memories we've built, but looking forward to the horizons yet to be explored. This anniversary isn't just a date on a calendar; it's a testament to the journey."
                        align="right"
                    />
                </div>

                <div className="text-center mt-32">
                    <img src={floralDivider} alt="Decoration" className="h-8 md:h-12 w-auto mx-auto opacity-40 mb-8" />
                    <p className="text-gold uppercase tracking-[0.3em] text-xs">To Be Continued...</p>
                </div>
            </div>
        </div>
    );
};

export default Story;
