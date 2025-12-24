import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mountain, ShoppingBag, Utensils, Wine, Sun, Car, Shield, Bed, Coffee, Anchor } from 'lucide-react';

const Guide = () => {
    const [activeTab, setActiveTab] = useState('Stay');

    const allPlaces = [
        // Stay
        {
            category: 'Stay',
            name: 'The Silo Hotel',
            type: 'Architecture & Art',
            desc: 'A structure of geometric glass towering above the V&A Waterfront. It is not just a hotel; it is a modern masterpiece built into a historic grain elevator.',
            tip: 'Visit the rooftop for the best sunset in the city.',
            icon: Bed,
            highlight: true,
            image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80"
        },
        {
            category: 'Stay',
            name: 'Mount Nelson',
            type: 'Iconic Heritage',
            desc: 'The "Pink Lady" of Cape Town. A colonial-era retreat hidden behind palm-lined avenues and lush gardens.',
            tip: 'High Tea here is a non-negotiable tradition.',
            icon: Coffee,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
        },
        {
            category: 'Stay',
            name: 'Ellerman House',
            type: 'Private Luxury',
            desc: 'Perched on the slopes of Lion\'s Head, offerring the most exclusive ocean views in Bantry Bay.',
            tip: 'Ask to see the private wine gallery.',
            icon: Wine,
            image: "https://images.unsplash.com/photo-1626019253444-239638708761?auto=format&fit=crop&w=800&q=80"
        },

        // Eat
        {
            category: 'Eat',
            name: 'La Colombe',
            type: 'Gastronomy',
            desc: 'A theatrical dining experience perched atop the Silvermist estate. Consistently ranked among the world\'s best.',
            tip: 'Book 3 months in advance.',
            icon: Utensils,
            highlight: true,
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
        },
        {
            category: 'Eat',
            name: 'The Pot Luck Club',
            type: 'Tapas & Views',
            desc: 'Located at the top of the Silo district, offering 360-degree views and a "sharing plate" concept that redefined Cape Town dining.',
            tip: 'Sunday Brunch is dazzling.',
            icon: Utensils,
            image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=800&q=80"
        },
        {
            category: 'Eat',
            name: 'Kloof Street House',
            type: 'Eclectic Dining',
            desc: 'Stepping inside is like entering a Victorian curiosity shop. Magical garden fairy lights meet plush velvet interiors.',
            tip: 'Request a table in the garden.',
            icon: Utensils,
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
        },
        {
            category: 'Eat',
            name: 'FYN',
            type: 'Japanese-African',
            desc: 'Where Japan meets South Africa. A complex, urban culinary journey with views of Lion\'s Head.',
            tip: 'The lunch special is a hidden gem.',
            icon: Utensils,
            image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80"
        },

        // Play
        {
            category: 'Play',
            name: 'Table Mountain',
            type: 'The Icon',
            desc: 'The flat-topped mountain that watches over the city. A playground for hikers and nature lovers alike.',
            tip: 'Sunset cable car ride.',
            icon: Mountain,
            highlight: true,
            image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80"
        },
        {
            category: 'Play',
            name: 'Kirstenbosch',
            type: 'Botanical Wonder',
            desc: 'Acclaimed as one of the great botanic gardens of the world. Few gardens can match the sheer grandeur of the setting against the eastern slopes of Table Mountain.',
            tip: 'Walk the "Boomslang" canopy walkway.',
            icon: Sun,
            image: "https://images.unsplash.com/photo-1616423640778-2cfd1e3d06cb?auto=format&fit=crop&w=800&q=80"
        },
        {
            category: 'Play',
            name: 'Boulders Beach',
            type: 'Wildlife',
            desc: 'A sheltered cove made up of inlets between granite boulders, from which the name originated. Home to a colony of African Penguins.',
            tip: 'Go at 8am to swim with them.',
            icon: Anchor,
            image: "https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&w=800&q=80"
        },
        {
            category: 'Play',
            name: 'Wine Tram',
            type: 'Excursion',
            desc: 'A hop-on hop-off railway through the heart of the Franschhoek Valley vineyards.',
            tip: 'The Blue Line offers the best views.',
            icon: Wine,
            image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80"
        },
    ];

    const tips = [
        { icon: Car, title: "Getting Around", desc: "Uber is the gold standard here. Reliable, safe, and tracked." },
        { icon: Sun, title: "The Elements", desc: "The 'Cape Doctor' wind clears the sky but demands a jacket." },
        { icon: Shield, title: "Street Smarts", desc: "Like any major city: be aware, stick to the lights, and enjoy." }
    ];

    const tabs = ['Stay', 'Eat', 'Play'];

    // Filter places
    const filteredPlaces = allPlaces.filter(p => p.category === activeTab);
    const featured = filteredPlaces.find(p => p.highlight) || filteredPlaces[0];
    const others = filteredPlaces.filter(p => p !== featured);

    return (
        <div className="min-h-screen bg-[#FDFCF8] pt-32 px-4 pb-20 border-t-8 border-charcoal">
            <div className="container mx-auto max-w-6xl">

                {/* Magazine Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-charcoal pb-4">
                    <div>
                        <p className="font-script text-3xl text-gold mb-2 pl-2">The Anniversary Edition</p>
                        <h1 className="text-7xl md:text-9xl font-serif text-charcoal leading-[0.8]">GUIDE<span className="text-4xl align-top ml-2">©</span></h1>
                    </div>
                    <div className="text-right mt-8 md:mt-0">
                        <p className="text-charcoal font-serif italic text-lg">Vol. 10</p>
                        <p className="font-script text-2xl text-gold mt-2">Cape Town • 2025</p>
                    </div>
                </div>

                {/* Navigation (Table of Contents Style) */}
                <div className="flex gap-12 mb-20 text-sm uppercase tracking-[0.2em] justify-center md:justify-start">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-1 border-b-2 transition-colors duration-300 ${activeTab === tab ? 'border-gold text-charcoal font-bold' : 'border-transparent text-gray-400 hover:text-charcoal'}`}
                        >
                            0{activeTab === 'Stay' && tab === 'Stay' ? '1' : tab === 'Eat' ? '2' : '3'} • {tab}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="mb-32"
                    >
                        {/* FEATURED ARTICLE LAYOUT */}
                        <div className="grid lg:grid-cols-12 gap-12 mb-24 items-center">
                            <div className="lg:col-span-8 relative">
                                <div className="aspect-[16/9] w-full overflow-hidden relative group rounded-sm">
                                    <img
                                        src={featured.image}
                                        alt={featured.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                                    />

                                    <div className="absolute bottom-0 left-0 bg-white p-6 md:p-12 max-w-lg border-t-4 border-gold z-10">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Editor's Choice</span>
                                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">{featured.name}</h2>
                                        <p className="text-gold font-script text-3xl leading-relaxed">"{featured.tip}"</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-4 flex flex-col justify-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block">The Experience</span>
                                <h3 className="text-2xl font-serif text-charcoal mb-6 leading-tight">{featured.desc}</h3>
                                <p className="text-sm leading-7 text-gray-500 font-light border-l-2 border-gray-200 pl-4">
                                    A must-visit destination that defines the {activeTab.toLowerCase()} experience in Cape Town.
                                    Expect world-class service and unforgettable memories.
                                </p>
                            </div>
                        </div>

                        {/* EDITORIAL COLUMNS FOR OTHERS */}
                        <div className="grid md:grid-cols-3 gap-12 border-t border-charcoal border-opacity-10 pt-12">
                            {others.map((place, idx) => (
                                <div key={idx} className="group cursor-pointer">
                                    <div className="mb-6 overflow-hidden h-64 bg-gray-100 relative rounded-sm">
                                        <img
                                            src={place.image}
                                            alt={place.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-charcoal px-2 py-1 rounded-full shadow-sm">{place.type}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-serif text-charcoal group-hover:text-gold transition-colors mb-3">
                                        <span className="text-gold text-sm font-sans mr-2 align-middle">0{idx + 2}</span>
                                        {place.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 border-b border-gray-100 pb-4">{place.desc}</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-charcoal transition-colors">
                                        Insider Tip: <span className="text-gold normal-case font-script text-xl pl-1">{place.tip}</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                    </motion.div>
                </AnimatePresence>

                {/* FOOTER STRIP */}
                <div className="bg-charcoal text-white p-12 grid md:grid-cols-4 gap-8 rounded-sm">
                    <div className="md:col-span-1 border-r border-white border-opacity-10 pr-8">
                        <h3 className="font-serif text-3xl mb-2">Essential<br />Intel.</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-4">Read before flight</p>
                    </div>
                    {tips.map((tip, index) => (
                        <div key={index} className="md:col-span-1">
                            <div className="flex gap-3 mb-2 items-center">
                                <tip.icon size={16} className="text-gold" />
                                <h4 className="font-bold uppercase tracking-widest text-xs">{tip.title}</h4>
                            </div>
                            <p className="text-sm text-gray-400 font-light leading-relaxed">{tip.desc}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};
export default Guide;
