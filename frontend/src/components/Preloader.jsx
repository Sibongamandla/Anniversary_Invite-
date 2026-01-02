import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import heroImg from '../assets/couple_formal_red.jpg';
import posterImg from '../assets/couple_standing_red.jpg';
import bouquetImg from '../assets/bouquet_white.svg';
import oliveImg from '../assets/olive_gold.svg';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const assetsToPreload = [
            heroImg,
            posterImg,
            bouquetImg,
            oliveImg
        ];

        let loadedCount = 0;
        const totalAssets = assetsToPreload.length;

        const preloadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = resolve; // Continue even if error
            });
        };

        const loadAll = async () => {
            // Start progress simulation
            const timer = setInterval(() => {
                setProgress(prev => Math.min(prev + 2, 90)); // Cap at 90 until real load done
            }, 50);

            // Actually load images
            await Promise.all(assetsToPreload.map(preloadImage));

            clearInterval(timer);
            setProgress(100);

            setTimeout(() => {
                onComplete();
            }, 800);
        };

        loadAll();

    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
            {/* Top Curtain */}
            <motion.div
                initial={{ height: "50vh" }}
                exit={{ height: 0, transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }}
                className="w-full bg-rich-black relative border-b border-gold/20 flex items-end justify-center overflow-hidden"
            >
                {/* Content inside curtain that stays centered relative to screen */}
                <div className="absolute bottom-0 w-full flex justify-center pb-4 md:pb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-gold font-script text-6xl md:text-8xl"
                    >
                        B & C
                    </motion.h1>
                </div>
            </motion.div>

            {/* Bottom Curtain */}
            <motion.div
                initial={{ height: "50vh" }}
                exit={{ height: 0, transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }}
                className="w-full bg-rich-black relative border-t border-gold/20 flex items-start justify-center overflow-hidden"
            >
                <div className="absolute top-0 w-full flex flex-col items-center pt-4 md:pt-8 gap-4">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.5 }}
                        className="text-white/50 text-xs uppercase tracking-[0.4em]"
                    >
                        Stellenbosch • 2026
                    </motion.p>

                    {/* Elegant Progress Line */}
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 200, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="h-[1px] bg-gold/50"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Preloader;
