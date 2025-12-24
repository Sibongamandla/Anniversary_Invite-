import { motion } from 'framer-motion';
import venueImage from '../assets/venue.png';

const Venue = () => {
    return (
        <div className="min-h-screen bg-white">

            <div className="pt-32 px-4 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                {/* Title Section */}
                <div className="lg:col-span-12 mb-12">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="text-6xl md:text-9xl font-serif text-charcoal leading-[0.8]"
                    >
                        The Grand<br />
                        <span className="text-gold italic ml-10 md:ml-32">Ballroom.</span>
                    </motion.h1>
                </div>

                {/* Image Block */}
                <div className="lg:col-span-7 h-[60vh] md:h-[80vh] overflow-hidden rounded-sm relative">
                    <motion.img
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={venueImage}
                        alt="Venue"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                </div>

                {/* Details Block */}
                <div className="lg:col-span-5 flex flex-col justify-end pb-12">
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Location</h3>
                            <p className="text-3xl font-serif text-charcoal">The Grand Estate</p>
                            <p className="text-gray-600 mt-2 font-light">
                                Constantia Main Road<br />
                                Cape Town, South Africa
                            </p>
                            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs uppercase tracking-widest border-b border-charcoal pb-1 hover:text-gold transition-colors text-charcoal">Get Directions</a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Dress Code</h3>
                            <p className="text-3xl font-serif text-charcoal">Black Tie</p>
                            <p className="text-gray-600 mt-2 font-light">
                                We invite you to dress in your finest evening attire.
                                Tuxedos and evening gowns are encouraged.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Accommodation</h3>
                            <p className="text-xl font-serif text-charcoal">Exclusive Room Block</p>
                            <p className="text-gray-600 mt-2 font-light text-sm">
                                Mention "Smith Anniversary" for special rates.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Venue;
