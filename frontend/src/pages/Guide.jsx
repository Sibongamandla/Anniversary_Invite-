import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, Map, Home, Palette as PaletteIcon, Sparkles, AlertCircle } from 'lucide-react';
import heroImage from '../assets/hero_couple_romantic.png';

const Guide = () => {
    const [activeTab, setActiveTab] = useState('Abode');

    const sections = {
        Sojourn: {
            title: "The Journey",
            subtitle: "Travel Logistics",
            items: [
                {
                    title: "Cape Town Int. Airport",
                    desc: "The primary gateway. We recommend arranging transport prior to arrival.",
                    icon: Plane
                },
                {
                    title: "Car Hire",
                    desc: "For those who wish to wander at their own pace, car hire offers freedom to explore.",
                    action: { label: "View Options", link: "https://www.google.com/search?q=car+hire+cape+town+international+airport" },
                    icon: Car
                },
                {
                    title: "Uber Black",
                    desc: "Reliable, safe, and readily available for city transfers.",
                    icon: Map
                },
                {
                    title: "Private Transfers",
                    desc: "Shared transfers can be arranged by special request. Please note flexibility is required.",
                    icon: Car
                }
            ],
            notes: [
                "Early flight bookings often present the most favorable fares.",
                "When parking at OR Tambo, use long-term parking for cost effective rates.",
                "We invite you to arrive a day early to settle gracefully."
            ]
        },
        Abode: {
            title: "Your Stay",
            subtitle: "Accommodation",
            intro: "We’ve highlighted a selection of areas to stay—choose the abode that best suits your pace.",
            items: [
                {
                    title: "Sunsets & Sea Views",
                    desc: "Camps Bay, Clifton, Bantry Bay, Fresnaye",
                    time: "+/- 1hr to vine",
                    image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "City Culture",
                    desc: "V & A Waterfront, Foreshore, Greenpoint",
                    time: "+/- 1hr to vine",
                    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "Winelands",
                    desc: "Stellenbosch (+/-15 min), Somerset West (+/-30 min), Franschhoek (+/- 50min)",
                    time: "Closest to Venue",
                    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80"
                },
                {
                    title: "Seaside Nearby",
                    desc: "Somerset Strand",
                    time: "Nearby Coastal",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                }
            ]
        },
        Palette: {
            title: "The Look",
            subtitle: "Attire & Beauty",
            content: {
                theme: "A Red Affair | Black Tie Elegance",
                desc: "We request the pleasure of your company in your finest formal attire. Think rich reds, classic blacks, and touches of gold.",
                makeup: [
                    { name: "@Makeup_by_Hedwin", handle: "Makeup_by_Hedwin", link: "https://www.instagram.com/Makeup_by_Hedwin" },
                    { name: "@SnehhOnlineBeauty_studio", handle: "SnehhOnlineBeauty_studio", link: "https://www.instagram.com/SnehhOnlineBeauty_studio" }
                ]
            }
        }
    };

    const tabs = ['Sojourn', 'Abode', 'Palette'];

    return (
        <div className="min-h-screen bg-rich-black pt-32 px-4 pb-20 border-t-8 border-gold text-white">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-white/10 pb-4">
                    <div>
                        <p className="font-script text-3xl text-gold mb-2 pl-2">The Guest Guide</p>
                        <h1 className="text-7xl md:text-9xl font-serif text-white leading-[0.8]">INFO<span className="text-4xl align-top ml-2">©</span></h1>
                    </div>
                    <div className="text-right mt-8 md:mt-0">
                        <p className="text-gray-400 font-serif italic text-lg opacity-60">Vol. 10</p>
                        <p className="font-script text-2xl text-gold mt-2">Cape Town • 2026</p>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-8 md:gap-12 mb-20 text-sm uppercase tracking-[0.2em] justify-center md:justify-start overflow-x-auto pb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-1 border-b-2 transition-colors duration-300 whitespace-nowrap ${activeTab === tab ? 'border-gold text-white font-bold' : 'border-transparent text-gray-500 hover:text-white'}`}
                        >
                            {tab}
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
                        {activeTab === 'Sojourn' && (
                            <div className="grid lg:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <h2 className="text-4xl font-serif text-gold mb-8">Travel Logistics</h2>
                                    {sections.Sojourn.items.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 p-6 rounded-sm border border-white/10">
                                            <div className="flex items-start gap-4">
                                                <item.icon className="text-gold mt-1" size={24} />
                                                <div>
                                                    <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
                                                    <p className="text-gray-400 font-light text-sm leading-relaxed">{item.desc}</p>
                                                    {item.action && (
                                                        <a href={item.action.link} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs uppercase tracking-widest text-gold border-b border-gold pb-0.5 hover:text-white hover:border-white transition-colors">
                                                            {item.action.label}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gold/10 p-8 border border-gold/20 rounded-sm">
                                    <h3 className="text-2xl font-serif text-gold mb-6 flex items-center gap-2">
                                        <AlertCircle size={20} />
                                        Travel Notes
                                    </h3>
                                    <ul className="space-y-4">
                                        {sections.Sojourn.notes.map((note, idx) => (
                                            <li key={idx} className="flex gap-3 text-gray-300 font-light leading-relaxed">
                                                <span className="text-gold">•</span>
                                                {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Abode' && (
                            <div>
                                <h2 className="text-4xl font-serif text-gold mb-4">Accommodation Areas</h2>
                                <p className="text-gray-400 font-light mb-12 max-w-2xl">{sections.Abode.intro}</p>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {sections.Abode.items.map((item, idx) => (
                                        <div key={idx} className="group relative h-80 overflow-hidden rounded-sm border border-white/10">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
                                                <h3 className="text-2xl font-serif text-white mb-1">{item.title}</h3>
                                                <p className="text-gold text-xs uppercase tracking-widest mb-2">{item.time}</p>
                                                <p className="text-gray-300 text-sm font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Palette' && (
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <h2 className="text-5xl font-serif text-white mb-6">{sections.Palette.content.theme}</h2>
                                    <p className="text-xl text-gray-300 font-light leading-relaxed mb-12 border-l-2 border-gold pl-6">
                                        {sections.Palette.content.desc}
                                    </p>

                                    <div className="space-y-6">
                                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                            <Sparkles size={16} />
                                            Suggested Makeup Artists
                                        </h3>
                                        <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                                            {sections.Palette.content.makeup.map((artist, idx) => (
                                                <a key={idx} href={artist.link} target="_blank" rel="noreferrer" className="block py-3 border-b border-white/10 last:border-0 hover:pl-2 transition-all group">
                                                    <span className="text-gray-300 group-hover:text-gold transition-colors">{artist.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[600px] border border-gold/20 p-4 relative">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                                    <div className="w-full h-full bg-red-900/20 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-900 to-black mx-auto mb-6 border-4 border-gold shadow-lg" />
                                            <p className="font-script text-4xl text-gold">Red & Gold</p>
                                            <p className="text-white uppercase tracking-widest text-xs mt-2">The Aesthetic</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>

            </div>
        </div>
    );
};
export default Guide;
