import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VisualEffects = () => {
    const canvasRef = useRef(null);
    const { scrollYProgress } = useScroll();

    // Parallax visuals
    const yLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const yRight = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 0.3, 0.3, 1]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Subtle gold colors
                this.colors = ['rgba(184, 134, 11, 0.8)', 'rgba(218, 165, 32, 0.6)', 'rgba(255, 215, 0, 0.4)'];
                this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.size = Math.random() * 2;
                this.speedX = (Math.random() - 0.5) * 0.2;
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            resize();
            particles = [];
            // Number of particles based on screen size
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', init);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {/* Gold Dust Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" />

            {/* Decorative Corner Vines (SVG) */}
            <motion.div
                style={{ y: yLeft, opacity }}
                className="absolute top-[-50px] left-[-50px] w-64 h-64 opacity-20 rotate-45"
            >
                {/* Simplified Vine Pattern SVG */}
                <svg viewBox="0 0 100 100" fill="none" stroke="#B8860B" strokeWidth="0.5">
                    <path d="M0 100 Q 50 50 100 0 M 20 80 Q 40 60 30 40" strokeDasharray="2 2" />
                    <circle cx="30" cy="40" r="2" fill="#B8860B" />
                    <path d="M10 90 Q 60 60 50 10" strokeDasharray="1 3" />
                </svg>
            </motion.div>

            <motion.div
                style={{ y: yRight, opacity }}
                className="absolute bottom-[-50px] right-[-50px] w-80 h-80 opacity-20 -rotate-12"
            >
                <svg viewBox="0 0 100 100" fill="none" stroke="#722F37" strokeWidth="0.5">
                    <path d="M100 100 Q 50 50 0 0 M 80 80 Q 60 40 90 20" strokeDasharray="3 3" />
                    <circle cx="90" cy="20" r="1.5" fill="#722F37" />
                </svg>
            </motion.div>
        </div>
    );
};

export default VisualEffects;
