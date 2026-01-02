import { useEffect, useState } from 'react';
import heroImg from '../assets/couple_formal_red_opt.jpg';
import posterImg from '../assets/couple_standing_red_opt.jpg';
import bouquetImg from '../assets/bouquet_white_opt.png';
import oliveImg from '../assets/olive_gold.svg';

const Preloader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const assetsToPreload = [
            heroImg,
            posterImg,
            bouquetImg,
            oliveImg
        ];

        const preloadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = resolve;
            });
        };

        const loadAll = async () => {
            const timer = setInterval(() => {
                setProgress(prev => Math.min(prev + 2, 90));
            }, 50);

            await Promise.all(assetsToPreload.map(preloadImage));

            clearInterval(timer);
            setProgress(100);

            // Small delay before starting exit animation
            setTimeout(() => {
                setIsExiting(true);
            }, 500);
        };

        // Remove static preloader once React mounts and takes over
        const staticPreloader = document.getElementById('static-preloader');
        if (staticPreloader) {
            staticPreloader.style.opacity = '0';
            setTimeout(() => staticPreloader.remove(), 100);
        }

        loadAll();
    }, []);

    // Handle exit completion
    useEffect(() => {
        if (isExiting) {
            // Match the CSS transition duration (1.5s)
            const timer = setTimeout(() => {
                onComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isExiting, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
            {/* Top Curtain */}
            <div
                className={`w-full bg-rich-black relative border-b border-gold/20 flex items-end justify-center overflow-hidden transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? 'h-0' : 'h-[50vh]'}`}
            >
                <div className="absolute bottom-0 w-full flex justify-center pb-4 md:pb-8">
                    <h1 className={`text-gold font-script text-6xl md:text-8xl transition-all duration-1000 ${isExiting ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'} ${progress < 10 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'}`}>
                        B & C
                    </h1>
                </div>
            </div>

            {/* Bottom Curtain */}
            <div
                className={`w-full bg-rich-black relative border-t border-gold/20 flex items-start justify-center overflow-hidden transition-all duration-[1500ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isExiting ? 'h-0' : 'h-[50vh]'}`}
            >
                <div className="absolute top-0 w-full flex flex-col items-center pt-4 md:pt-8 gap-4">
                    <p className={`text-white/50 text-xs uppercase tracking-[0.4em] transition-opacity duration-500 delay-500 ${isExiting || progress < 20 ? 'opacity-0' : 'opacity-100'}`}>
                        Stellenbosch • 2026
                    </p>

                    {/* Progress Line */}
                    <div
                        className={`h-[1px] bg-gold/50 transition-all duration-[2500ms] ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                        style={{ width: `${Math.min(progress * 2, 200)}px` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Preloader;
