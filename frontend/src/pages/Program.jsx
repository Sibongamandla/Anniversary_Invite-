import { motion } from 'framer-motion';

const Program = () => {
    const schedule = [
        {
            day: "Thursday, 05 March 2026",
            title: "The Beginning",
            events: [
                { time: "17:00", name: "Rehearsal Dinner", desc: "An intimate gathering to begin the festivities." },
            ]
        },
        {
            day: "Friday, 06 March 2026",
            title: "The Covenant Renewed",
            events: [
                { time: "15:00", name: "Ceremony", desc: "We gather to renew our vows and celebrate a love matured." },
                { time: "18:30", name: "Reception", desc: "An evening of laughter, joy, restaurant dining, and dancing." }
            ]
        },
        {
            day: "Saturday, 07 March 2026",
            title: "Sunset Surprise",
            events: [
                { time: "17:00", name: "Performance by The Bangers", desc: "A special sunset surprise to close our celebration." }
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
                            className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-gold/30 transition-colors duration-500 backdrop-blur-sm"
                        >
                            <div className="mb-8 border-b border-white/10 pb-4">
                                <h2 className="text-xl font-serif text-gold mb-1">{day.day}</h2>
                                <p className="text-white font-serif text-2xl mt-1 tracking-wide">{day.title}</p>
                            </div>

                            <div className="space-y-8 relative border-l border-white/20 ml-2 pl-6">
                                {day.events.map((event, idx) => (
                                    <div key={idx} className="relative group">
                                        <span className="absolute -left-[1.95rem] top-1.5 w-3 h-3 bg-red-900 rounded-full border-2 border-rich-black shadow-[0_0_0_2px_rgba(184,134,11,0.5)]"></span>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold text-gold/80 block mb-1 tracking-widest">{event.time}</span>
                                            <button
                                                onClick={() => addToGoogleCalendar(event, day.day)}
                                                className="text-[10px] text-white/30 hover:text-gold transition-colors flex items-center gap-1 uppercase tracking-wider"
                                                title="Add to Google Calendar"
                                            >
                                                <span>+ Calendar</span>
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-serif text-white">{event.name}</h3>
                                        <p className="text-sm text-gray-400 font-light leading-relaxed mt-1">{event.desc}</p>
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
