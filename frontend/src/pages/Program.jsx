import { motion } from 'framer-motion';

const Program = () => {
    const schedule = [
        {
            day: "Friday, Dec 12",
            title: "Welcome Sunset",
            events: [
                { time: "5:00 PM", name: "Rooftop Drinks", desc: "Join us for cocktails overlooking Table Mountain at The Silo Hotel." },
                { time: "7:00 PM", name: "Welcome Dinner", desc: "Casual dining at the V&A Waterfront." }
            ]
        },
        {
            day: "Saturday, Dec 13",
            title: "The Celebration",
            events: [
                { time: "3:30 PM", name: "Guest Arrival", desc: "Welcome sparkling wine in the Rose Garden." },
                { time: "4:00 PM", name: "Vow Renewal", desc: "The ceremony under the old oak trees." },
                { time: "5:00 PM", name: "Golden Hour", desc: "Canapés and lawn games while the sun sets." },
                { time: "6:30 PM", name: "Reception", desc: "Dinner, toasts, and dancing in the Crystal Barn." }
            ]
        },
        {
            day: "Sunday, Dec 14",
            title: "Recovery",
            events: [
                { time: "11:00 AM", name: "Farewell Brunch", desc: "Kirstenbosch Tea Room. Casual attire." }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-32 px-4 pb-20">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <p className="text-gold font-script text-4xl mb-2">Itinerary</p>
                    <h1 className="text-6xl md:text-8xl font-serif text-charcoal">The Weekend</h1>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {schedule.map((day, dayIndex) => (
                        <motion.div
                            key={dayIndex}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: dayIndex * 0.2 }}
                            className="bg-gray-50 p-8 rounded-sm hover:-translate-y-2 transition-transform duration-500"
                        >
                            <div className="mb-8 border-b border-charcoal border-opacity-10 pb-4">
                                <h2 className="text-2xl font-serif text-charcoal mb-1">{day.day}</h2>
                                <p className="text-gold font-script text-2xl mt-1">{day.title}</p>
                            </div>

                            <div className="space-y-8 relative border-l border-charcoal border-opacity-20 ml-2 pl-6">
                                {day.events.map((event, idx) => (
                                    <div key={idx} className="relative">
                                        <span className="absolute -left-[1.95rem] top-1.5 w-3 h-3 bg-charcoal rounded-full border-2 border-white"></span>
                                        <span className="text-xs font-bold text-gray-400 block mb-1">{event.time}</span>
                                        <h3 className="text-lg font-serif text-charcoal">{event.name}</h3>
                                        <p className="text-sm text-gray-600 font-light leading-relaxed mt-1">{event.desc}</p>
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
