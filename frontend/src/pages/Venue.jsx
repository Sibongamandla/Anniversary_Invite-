import { motion, useMotionValue, useTransform } from 'framer-motion';
import venueImage from '../assets/venue.png';
import mapImage from '../assets/map_stylized.png';
import tableMountain from '../assets/table_mountain.png';
import waterfront from '../assets/waterfront.png';
import heroImage from '../assets/hero_couple_romantic.png'; // Fallback if needed or stylistic choice

const TiltCard = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full h-[500px] relative cursor-pointer group"
        >
            <motion.div
                className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-gold/20 bg-rich-black relative z-10"
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />
                <img src={mapImage} alt="Stylized Map" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />

                {/* Floating 3D Elements */}
                <motion.div
                    style={{ z: 50 }}
                    className="absolute bottom-10 left-10 z-30 pointer-events-none"
                >
                    <h3 className="text-3xl font-serif text-gold mb-2">Quoin Rock</h3>
                    <p className="text-white/80 text-sm tracking-widest uppercase mb-4">Stellenbosch</p>
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=Quoin+Rock+Wine+Estate,+Stellenbosch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 bg-gold/20 backdrop-blur-md border border-gold/40 rounded-full text-gold text-xs uppercase tracking-wider hover:bg-gold hover:text-rich-black transition-all"
                    >
                        <span>Navigate</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                    </a>
                </motion.div>

                {/* Pin */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                >
                    <div className="w-4 h-4 bg-gold rounded-full animate-ping absolute inset-0" />
                    <div className="w-4 h-4 bg-gold rounded-full relative shadow-[0_0_20px_rgba(212,175,55,0.8)]" />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const Venue = () => {
    const attractions = [
        { name: "Table Mountain", image: tableMountain, desc: "A world wonder." },
        { name: "V&A Waterfront", image: waterfront, desc: "Luxury shopping & dining." },
    ];

    return (
        <div className="min-h-screen bg-rich-black overflow-hidden text-white">
            {/* Hero Section */}
            <div className="pt-32 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-5 z-10">
                    <motion.h1
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-6xl md:text-8xl font-serif text-white leading-none"
                    >
                        Quoin<br />
                        <span className="text-gold italic ml-10">Rock.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-gray-300 max-w-md font-light leading-relaxed"
                    >
                        Among rolling vineyards and mountain light, Quoin Rock Wine Estate sets the scene as Boitumelo & Comfort renew a covenant — still the one, still chosen. We shall dance until the dawn kisses the earth.
                    </motion.p>
                    <p className="mt-4 text-gold/80 text-sm tracking-widest uppercase">Knorhoek Road, near Stellenbosch</p>
                </div>

                <div className="lg:col-span-7 relative h-[60vh] md:h-[80vh]">
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="w-full h-full rounded-sm overflow-hidden relative border border-white/10"
                    >
                        <img src={venueImage} alt="Venue" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-transparent to-transparent" />
                    </motion.div>
                </div>
            </div>

            {/* Interactive Map Section */}
            <div className="py-24 px-4 md:px-12 bg-black relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-serif text-white mb-6"
                        >
                            The <span className="text-gold italic">Vineyard</span>
                        </motion.h2>
                        <p className="text-gray-400 mb-8 font-light">
                            Explore the beauty of the winelands through our interactive location guide.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold font-serif text-xl">1</div>
                                <div>
                                    <h4 className="text-white font-bold uppercase tracking-wider text-sm">Ceremony</h4>
                                    <p className="text-gray-500 text-sm">Quoin Rock Gardens • 15:00</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-gold font-serif text-xl">2</div>
                                <div>
                                    <h4 className="text-white font-bold uppercase tracking-wider text-sm">Reception</h4>
                                    <p className="text-gray-500 text-sm">The Hall • 18:30</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TiltCard />
                </div>
            </div>

            {/* Nearby Attractions */}
            <div className="py-24 px-4 md:px-12 bg-rich-black border-t border-white/5">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center text-3xl font-serif text-white mb-16"
                >
                    Nearby Experience
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {attractions.map((spot, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className="group cursor-pointer"
                        >
                            <div className="overflow-hidden rounded-sm mb-4 h-80 relative">
                                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                            </div>
                            <h3 className="text-2xl font-serif text-white">{spot.name}</h3>
                            <p className="text-gold text-xs uppercase tracking-widest mt-1">{spot.desc}</p>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ", Cape Town")}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs uppercase tracking-widest border-b border-white/20 pb-1 hover:text-gold transition-colors text-gray-400">Get Directions</a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Venue;
