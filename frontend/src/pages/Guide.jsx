import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Car, Map, Home, Palette as PaletteIcon, Sparkles, AlertCircle, Instagram } from 'lucide-react';
import heroImage from '../assets/hero_couple_romantic.png';

// Icons
import iconRosemary from '../assets/rosemary_white.svg';
import iconGrapes from '../assets/grapes_white.svg';
import iconBouquet from '../assets/bouquet_white_opt.png';
import imgMen from '../assets/dress_code_men.png';
import imgWomen from '../assets/dress_code_women_v2.jpg';

const Guide = () => {
    const [activeTab, setActiveTab] = useState('Sojourn'); // Default to Sojourn (Journey)



    const sections = {
        Sojourn: {
            title: "The Journey",
            subtitle: "Travel Logistics",
            items: [
                {
                    title: "Cape Town Int. Airport",
                    desc: "The primary gateway. We recommend arranging transport prior to arrival.",
                    action: { label: "Airport Info", link: "https://www.airports.co.za/airports/cape-town-international-airport" },
                    icon: Plane
                },
                {
                    title: "Car Hire",
                    desc: "For those who wish to wander at their own pace, car hire offers freedom to explore.",

                    providers: [
                        { label: "Avis", link: "https://www.avis.co.za/drive-avis/car-hire-locations/cape-town-international-airport" },
                        { label: "Europcar", link: "https://www.europcar.co.za/en-us/stations/south-africa/cape-town-international-airport" },
                        { label: "Woodford", link: "https://www.woodford.co.za/" }
                    ],
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
                desc: "We request the pleasure of your company in your finest formal attire. Embrace high-fashion glamour and bold avant-garde elegance. Think structured silhouettes, vibrant reds, classic blacks, and distinct touches of gold.",
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
                <div className="flex gap-8 md:gap-12 mb-20 text-sm uppercase tracking-[0.2em] justify-start md:justify-start overflow-x-auto pb-4 hide-scrollbar px-4">
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

                {/* Mobile Tab Scroll Hint */}
                <div className="md:hidden flex justify-center -mt-16 mb-12 opacity-50 animate-pulse">
                    <p className="text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                        ← Explore the Other Tabs →
                    </p>
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
                                                <item.icon className="text-gold mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" size={24} />
                                                <div>
                                                    <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
                                                    <p className="text-gray-400 font-light text-sm leading-relaxed">{item.desc}</p>
                                                    {item.action && (
                                                        <a href={item.action.link} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs uppercase tracking-widest text-gold border-b border-gold pb-0.5 hover:text-white hover:border-white transition-colors">
                                                            {item.action.label}
                                                        </a>
                                                    )}
                                                    {item.providers && (
                                                        <div className="flex flex-wrap gap-3 mt-4">
                                                            {item.providers.map((provider, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={provider.link}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="px-3 py-1.5 text-xs uppercase tracking-wider border border-white/20 hover:border-gold hover:text-gold hover:bg-white/5 transition-all rounded-sm"
                                                                >
                                                                    {provider.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative overflow-hidden bg-white/[0.02] border border-white/10 p-8 rounded-sm">
                                    <img src={iconRosemary} className="absolute -bottom-12 -right-12 w-64 h-64 opacity-25 pointer-events-none rotate-12 mix-blend-screen" />
                                    <h3 className="text-2xl font-serif text-gold mb-6 flex items-center gap-2 relative z-10">
                                        <AlertCircle size={20} />
                                        Travel Notes
                                    </h3>
                                    <ul className="space-y-4 relative z-10">
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
                                <p className="text-gray-400 font-light mb-8 max-w-2xl">{sections.Abode.intro}</p>

                                {/* Scroll Hint */}
                                <div className="flex items-center gap-2 mb-4 opacity-60">
                                    <div className="w-8 h-[1px] bg-gold" />
                                    <p className="text-xs uppercase tracking-widest text-gold whitespace-nowrap flex items-center gap-2">
                                        Swipe to View Areas <span className="text-lg">→</span>
                                    </p>
                                </div>

                                <div className="flex overflow-x-auto gap-8 pb-8 -mx-4 px-4 snap-x hide-scrollbar">
                                    {sections.Abode.items.map((item, idx) => (
                                        <div key={idx} className="group relative min-w-[300px] w-[85vw] md:w-[400px] h-[400px] flex-shrink-0 overflow-hidden rounded-sm border border-white/10 snap-center">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
                                                <h3 className="text-2xl font-serif text-white mb-1">{item.title}</h3>
                                                <p className="text-gold text-xs uppercase tracking-widest mb-2">{item.time}</p>
                                                <p className="text-gray-300 text-sm font-light">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Decorative Grapes Watermark */}
                                <div className="mt-16 relative h-48 flex items-center justify-center overflow-hidden border-t border-white/10">
                                    <div className="absolute inset-0 bg-gradient-to-b from-rich-black to-transparent z-10" />
                                    <img src={iconGrapes} className="w-96 h-96 opacity-25 rotate-90 transform translate-y-12 mix-blend-screen" />
                                </div>
                            </div>
                        )}


                        {activeTab === 'Palette' && (
                            <div className="grid lg:grid-cols-2 gap-16 items-center relative">
                                <img src={iconBouquet} className="absolute -left-32 -top-10 w-[600px] h-[600px] opacity-25 pointer-events-none -rotate-12 mix-blend-screen z-0" />

                                <div className="relative z-10">
                                    <h2 className="text-5xl font-serif text-white mb-6">{sections.Palette.content.theme}</h2>
                                    <p className="text-xl text-gray-300 font-light leading-relaxed mb-12 border-l-2 border-gold pl-6">
                                        {sections.Palette.content.desc}
                                    </p>

                                    <div className="space-y-6">
                                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                            <Sparkles size={16} />
                                            Mood Boards
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 md:gap-6 relative z-10">
                                            <div className="space-y-2 group">
                                                <div className="relative p-2 border border-gold/40">
                                                    <div className="absolute inset-0 border-[3px] border-gold/10 m-1 pointer-events-none" />
                                                    <div className="aspect-[3/4] overflow-hidden bg-rich-black relative">
                                                        <div className="absolute inset-2 border border-gold/50 z-10 opacity-70 group-hover:inset-4 transition-all duration-500" />
                                                        <img src={imgMen} alt="Gentlemen Dress Code" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0" />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gold uppercase tracking-widest text-center mt-3">Gentlemen</p>
                                            </div>
                                            <a href="https://pin.it/7qGSJLQZh" target="_blank" rel="noreferrer" className="space-y-2 group block">
                                                <div className="relative p-2 border border-gold/40">
                                                    <div className="absolute inset-0 border-[3px] border-gold/10 m-1 pointer-events-none" />
                                                    <div className="aspect-[3/4] overflow-hidden bg-rich-black relative">
                                                        <div className="absolute inset-2 border border-gold/50 z-10 opacity-70 group-hover:inset-4 transition-all duration-500" />
                                                        <img src={imgWomen} alt="Ladies Dress Code" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0" />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gold uppercase tracking-widest text-center mt-3">Ladies</p>
                                            </a>
                                        </div>

                                        <h3 className="text-gold font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-8">
                                            <Sparkles size={16} />
                                            Suggested Makeup Artists
                                        </h3>
                                        <div className="bg-white/5 p-6 rounded-sm border border-white/10 relative overflow-hidden">
                                            <div className="relative z-10">
                                                {sections.Palette.content.makeup.map((artist, idx) => (
                                                    <a key={idx} href={artist.link} target="_blank" rel="noreferrer" className="block py-3 border-b border-white/10 last:border-0 hover:pl-2 transition-all group">
                                                        <span className="text-gray-300 group-hover:text-gold transition-colors flex items-center gap-3">
                                                            <Instagram size={18} />
                                                            {artist.name}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[600px] border border-gold/20 p-4 relative hidden lg:block">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                                    <div className="w-full h-full bg-red-900/20 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-900 to-black mx-auto mb-6 border-4 border-gold shadow-lg" />
                                            <p className="font-script text-4xl text-gold">Red & Gold</p>
                                            <p className="text-white uppercase tracking-widest text-xs mt-2">The Aesthetic</p>
                                        </div>
                                    </div>
                                </div>

                                {/* RSVP CTA */}
                                <div className="col-span-1 lg:col-span-2 flex justify-center mt-16 w-full">
                                    <button
                                        onClick={() => window.location.href = '/rsvp'}
                                        className="bg-gold text-rich-black px-12 py-4 text-lg font-serif italic hover:bg-white transition-colors duration-500 uppercase tracking-widest"
                                    >
                                        RSVP for the Celebration
                                    </button>
                                </div>

                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>

            </div>
        </div >
    );
};
export default Guide;
