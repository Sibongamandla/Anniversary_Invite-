import { motion } from 'framer-motion';
import { MapPin, Mountain, ShoppingBag, Utensils, Wine, Sun, Car, Shield } from 'lucide-react';

const Guide = () => {
    const categories = [
        {
            title: "Sights & Nature",
            items: [
                { name: 'Table Mountain', type: 'Iconic', desc: 'Take the cable car for panoramic views of the city.', icon: Mountain },
                { name: 'Kirstenbosch', type: 'Gardens', desc: 'World-renowned botanical gardens at the foot of the mountain.', icon: Sun },
                { name: 'Boulders Beach', type: 'Wildlife', desc: 'Visit the famous penguin colony in Simon\'s Town.', icon: MapPin },
            ]
        },
        {
            title: "Dining & Wine",
            items: [
                { name: 'V&A Waterfront', type: 'Hub', desc: 'Shopping and dining by the historic harbor.', icon: ShoppingBag },
                { name: 'The Pot Luck Club', type: 'Dining', desc: 'Acclaimed small plates with strict booking requirements.', icon: Utensils },
                { name: 'Franschhoek', type: 'Wine', desc: 'The culinary capital. Take the Wine Tram.', icon: Wine },
            ]
        }
    ];

    const tips = [
        { icon: Car, title: "Transport", desc: "Uber is safe, reliable, and widely used in Cape Town. We recommend avoiding regular taxis." },
        { icon: Sun, title: "Weather", desc: "December is summer. Expect windy days and warm temps (25°C+). Pack sunscreen." },
        { icon: Shield, title: "Safety", desc: "Stick to tourist areas and avoid walking alone at night in the CBD." }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 px-4 pb-20">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-gold font-bold tracking-[0.3em] uppercase text-xs mb-4">Destination</p>
                    <h1 className="text-6xl md:text-8xl font-serif text-charcoal mb-4">The Guide</h1>
                    <p className="text-gray-600 tracking-widest uppercase text-sm">Cape Town & Winelands</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    {categories.map((cat, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-serif text-charcoal mb-8 border-b border-charcoal border-opacity-10 pb-4">{cat.title}</h2>
                            <div className="space-y-6">
                                {cat.items.map((place, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-6 group cursor-pointer p-4 hover:bg-gray-50 rounded-sm transition-colors"
                                    >
                                        <div className="text-gold opacity-50 group-hover:opacity-100 transition-opacity">
                                            <place.icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-serif text-charcoal group-hover:text-gold transition-colors">{place.name}</h3>
                                                <span className="text-[10px] uppercase tracking-wider text-gray-400 border border-gray-200 px-2 rounded-full">{place.type}</span>
                                            </div>
                                            <p className="text-gray-600 font-light text-sm">{place.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Travel Tips */}
                <div className="bg-charcoal text-white p-8 md:p-12 rounded-sm">
                    <h2 className="text-3xl font-serif mb-8 text-center">Travel Essentials</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {tips.map((tip, index) => (
                            <div key={index} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white bg-opacity-10 mb-4 text-gold">
                                    <tip.icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{tip.title}</h3>
                                <p className="text-gray-400 text-sm font-light leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guide;
