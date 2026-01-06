import { motion } from 'framer-motion';

// Assets
import iconRings from '../assets/rings_gold.svg';
import iconHeart from '../assets/heart_gold.svg';
import iconLemon from '../assets/lemon_gold.svg';
import iconRosemary from '../assets/rosemary_gold.svg';
import iconGrapes from '../assets/grapes_red.svg';

const Program = () => {
    const schedule = [
        {
            day: "Thursday, 05 February 2026",
            title: "The Beginning",
            events: [
                { time: "17:00", name: "Rehearsal Dinner", desc: "An intimate gathering to begin the festivities.", icon: iconGrapes },
            ]
        },
        {
            day: "Friday, 06 February 2026",
            title: "The Covenant Renewed",
            events: [
                { time: "15:00", name: "Ceremony", desc: "We gather to renew our vows and celebrate a love matured.", icon: iconRings },
                { time: "18:30", name: "Reception", desc: "An evening of laughter, joy, restaurant dining, and dancing.", icon: iconHeart }
            ]
        },
        {
            day: "Saturday, 07 February 2026",
            title: "Sunset Surprise",
            events: [
                { time: "17:00", name: "Performance by The Bangers", desc: "A special sunset surprise to close our celebration.", icon: iconLemon }
            ]
        }
    ];

    const addToGoogleCalendar = (event, dateString) => {
        // Parse date string "Thursday, 05 March 2026"
        const datePart = dateString.split(', ')[1];
        const fullDateStr = `${datePart} ${event.time}`;
        const startDate = new Date(fullDateStr);
        // Assume 2 hour duration for now
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const url = new URL("https://calendar.google.com/calendar/render");
        url.searchParams.append("action", "TEMPLATE");
        url.searchParams.append("text", `Vows & Vines: ${event.name}`);
        url.searchParams.append("dates", `${formatDate(startDate)}/${formatDate(endDate)}`);
        url.searchParams.append("details", event.desc);
        url.searchParams.append("location", "Quoin Rock Wine Estate, Stellenbosch");

        window.open(url.toString(), "_blank");
    };

    return (
        <div className="min-h-screen bg-rich-black pt-32 px-4 pb-20 text-white">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-gold font-script text-4xl mb-2">The Timeline</p>
                    <h1 className="text-6xl md:text-8xl font-serif text-white">Celebration</h1>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {schedule.map((day, dayIndex) => (
                        <motion.div
                            key={dayIndex}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: dayIndex * 0.2 }}
                            className="bg-white/5 border border-gold/10 p-8 rounded-sm hover:border-gold/40 transition-colors duration-500 backdrop-blur-sm shadow-xl"
                        >
                            <div className="mb-8 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-serif text-gold mb-1">{day.day}</h2>
                                <p className="text-white font-serif text-2xl mt-1 tracking-wide">{day.title}</p>
                            </div>

                            <div className="space-y-12 relative border-l border-gold/30 ml-2 pl-8 pt-4 pb-4">
                                {day.events.map((event, idx) => (
                                    <div key={idx} className="relative z-10">

                                        {/* Timeline Dot */}
                                        <span className="absolute -left-[2.45rem] top-2 w-3 h-3 bg-red-900 rounded-full border-2 border-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] z-20"></span>

                                        {/* Content Container with Watermark */}
                                        <div className="relative overflow-hidden rounded-md p-6 border border-gold/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-gold/30 transition-all duration-500 group shadow-lg">

                                            {/* Watermark Icon */}
                                            {event.icon && (
                                                <div className="absolute -right-4 -bottom-4 w-48 h-48 z-0 opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity duration-700 mix-blend-screen">
                                                    <img
                                                        src={event.icon}
                                                        alt=""
                                                        className="w-full h-full object-contain transform rotate-12"
                                                    />
                                                </div>
                                            )}

                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-bold text-gold tracking-widest">{event.time}</span>
                                                    <button
                                                        onClick={() => addToGoogleCalendar(event, day.day)}
                                                        className="text-[10px] text-white/30 hover:text-gold transition-colors flex items-center gap-1 uppercase tracking-wider"
                                                        title="Add to Google Calendar"
                                                    >
                                                        <span>+ Calendar</span>
                                                    </button>
                                                </div>
                                                <h3 className="text-2xl font-serif text-white mb-2">{event.name}</h3>
                                                <p className="text-gray-400 font-light leading-relaxed max-w-sm">{event.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Program;
