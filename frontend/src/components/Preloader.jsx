import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Preloader = ({ onComplete }) => {
    const [textIndex, setTextIndex] = useState(0);
    const words = ["ELEGANCE", "LOVE", "FOREVER", "ANNIVERSARY"];

    useEffect(() => {
        const timer = setInterval(() => {
            setTextIndex((prev) => {
                if (prev === words.length - 1) {
                    clearInterval(timer);
                    return prev;
                }
                return prev + 1;
            });
        }, 400);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2200);

        return () => {
            clearInterval(timer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="fixed inset-0 z-[100] bg-charcoal text-champagne flex items-center justify-center overflow-hidden"
        >
            <div className="relative overflow-hidden h-24 md:h-32">
                <motion.p
                    key={textIndex}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className="text-6xl md:text-8xl font-serif font-bold tracking-widest uppercase text-center"
                >
                    {words[textIndex]}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Preloader;
