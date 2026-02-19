import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGuest } from '../context/GuestContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const RSVP = () => {
    const { code } = useParams(); // URL param from /join/:code
    const { guestCode, unlock } = useGuest(); // Context state
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form Fields
    const [name, setName] = useState('');
    const [status, setStatus] = useState('attending');

    const [questions, setQuestions] = useState('');

    // New Fields
    const [preferredNames, setPreferredNames] = useState('');

    const [song, setSong] = useState('');
    const [shuttleAirport, setShuttleAirport] = useState(false);
    const [shuttleVenue, setShuttleVenue] = useState(false);
    const [accommodationNeeded, setAccommodationNeeded] = useState(false);
    const [sunsetAttendance, setSunsetAttendance] = useState(false);
    const [showSunsetModal, setShowSunsetModal] = useState(false);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);

    const activeCode = code || guestCode;
    const isAttending = status === 'attending';

    const getDeviceId = () => {
        let deviceId = localStorage.getItem('device_id');
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem('device_id', deviceId);
        }
        return deviceId;
    };

    useEffect(() => {
        const init = async () => {
            if (!activeCode) {
                // Should not happen due to ProtectedRoute, but safeguard
                navigate('/');
                return;
            }

            // Mode 1: Authentication Entry (/join/:code)
            if (code) {
                try {
                    const deviceId = getDeviceId();
                    // Attempt to claim this code for this device
                    await api.post(`/rsvp/claim/${code}`, { device_id: deviceId });

                    unlock(code); // Authenticate globally
                    navigate('/', { replace: true }); // Redirect to Home immediately
                    return;
                } catch (err) {
                    if (err.response && err.response.status === 403) {
                        setPageError({
                            title: "Access Restricted Link",
                            message: "This invitation code is already linked to another device.",
                            suggestion: "For security, invitations are locked to the first device used. Please use your original device."
                        });
                    } else if (err.response && err.response.status === 404) {
                        setPageError({
                            title: "Invitation Not Found",
                            message: "We couldn't seem to find an invitation with that code.",
                            suggestion: "It might be a simple typo. Please double-check the code, or contact the hosts if you continue to have trouble."
                        });
                    } else {
                        setPageError({
                            title: "Connection Issue",
                            message: "We were unable to verify your invitation at this moment.",
                            suggestion: "Please check your internet connection and try again."
                        });
                    }
                    setLoading(false);
                    return;
                }
            }

            // Mode 2: RSVP Page (/rsvp) - User is already authenticated
            try {
                // Ideally this GET should also validate device_id, but for now we trust the session 
                // or we could update the GET endpoint to accept device_id query param for strictness.
                // Sticking to "Claim" enforcement for Entry.
                const response = await api.get(`/rsvp/${activeCode}`);
                setName(response.data.name || '');

                if (response.data.rsvp_status && response.data.rsvp_status !== 'pending') {
                    setStatus(response.data.rsvp_status);
                    // Set success message to bypass form and show "Already RSVP'd" state
                    if (response.data.rsvp_status === 'attending') {
                        setSuccessMsg("You have already accepted. We eagerly await our celebration.");
                    } else if (response.data.rsvp_status === 'declined') {
                        setSuccessMsg("You have already declined. You will be missed.");
                    }
                } else if (response.data.rsvp_status) {
                    setStatus(response.data.rsvp_status);
                }

                // Pre-fill new fields if they exist
                if (response.data.preferred_names) setPreferredNames(response.data.preferred_names);

                if (response.data.song_request) setSong(response.data.song_request);
                if (response.data.shuttle_airport) setShuttleAirport(response.data.shuttle_airport);
                if (response.data.shuttle_venue) setShuttleVenue(response.data.shuttle_venue);
                if (response.data.shuttle_venue) setShuttleVenue(response.data.shuttle_venue);
                if (response.data.accommodation_needed) setAccommodationNeeded(response.data.accommodation_needed);
                if (response.data.sunset_surprise_attendance) setSunsetAttendance(response.data.sunset_surprise_attendance);

            } catch (err) {
                console.error("Failed to fetch guest info", err);
                if (err.response && err.response.status === 404) {
                    setPageError({
                        title: "Invitation Not Found",
                        message: "This invitation code no longer exists or has been removed.",
                        suggestion: "Please contact the hosts if you believe this is an error."
                    });
                } else {
                    setPageError({
                        title: "Connection Issue",
                        message: "We were unable to verify your invitation at this moment.",
                        suggestion: "Please check your internet connection and try again."
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [code, activeCode, navigate, unlock]);

    const submitRSVP = async (sunsetStatus) => {
        try {
            const notesParts = [];
            const compiledNotes = notesParts.join(' | ');

            await api.post(`/rsvp/${activeCode}`, {
                rsvp_status: status,
                notes: compiledNotes,
                name: name,
                plus_one_count: 0,
                preferred_names: preferredNames,

                song_request: song,
                shuttle_airport: shuttleAirport,
                shuttle_venue: shuttleVenue,
                accommodation_needed: accommodationNeeded,
                sunset_surprise_attendance: sunsetStatus
            });

            setSuccessMsg('Kindly delivered. We eagerly await our celebration.');
            setShowSunsetModal(false);

            if (sunsetStatus) {
                navigate('/guide?tab=Surprise');
            }
        } catch (err) {
            setSubmitError('The courier stumbled. Please try sending again.');
            setShowSunsetModal(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (status === 'attending') {
            setShowSunsetModal(true);
        } else {
            // If declined, just submit with sunset = false
            submitRSVP(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen bg-rich-black text-gold font-serif italic">Checking Guest List...</div>;

    if (pageError) return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#faf9f6]/95 backdrop-blur-sm p-8 rounded shadow-[0_0_50px_rgba(255,215,0,0.1)] text-center border border-gold/30">
                <div className="text-red-900 text-5xl mb-4">❦</div>
                <h2 className="font-serif text-3xl text-red-900 mb-4">{pageError.title}</h2>
                <p className="font-serif text-gray-800 text-lg mb-4">{pageError.message}</p>
                <p className="font-sans text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">{pageError.suggestion}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-rich-black text-gold px-8 py-3 font-serif uppercase tracking-widest hover:bg-gold hover:text-rich-black transition-all duration-300 rounded-sm border border-gold/50"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    // Standard Render for Mode 2 (Form)
    return (
        <div className="min-h-screen bg-rich-black flex items-center justify-center p-4 md:p-8 relative pb-12 md:pb-32">

            {/* Background Texture/Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-red-900/10 pointer-events-none"
            />

            <div className="relative z-10 w-full max-w-2xl mt-12 md:mt-24">

                {/* The Physical Card Container */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="bg-[#faf9f6] text-gray-800 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                    style={{
                        boxShadow: "0 0 0 1px #e5e5e5, 0 20px 40px -10px rgba(0,0,0,0.4)",
                        borderRadius: "2px" // Sharp paper corners
                    }}
                >
                    {/* Gold Foil Border Effect inside Card */}
                    <div className="absolute inset-3 border-2 border-gold/40 pointer-events-none" />
                    <div className="absolute inset-4 border border-gold/20 pointer-events-none" />

                    <div className="relative z-10 text-center space-y-8">

                        {/* Header */}
                        <div className="space-y-4">
                            <p className="font-serif italic text-gold text-lg">Répondez s'il vous plaît</p>
                            <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-gray-900">
                                The Pleasure of Your Reply
                            </h1>
                            <div className="h-px w-24 bg-gold mx-auto" />
                            <p className="font-serif text-gray-500 text-sm tracking-widest uppercase">Is Requested By February 26th, 2026</p>
                        </div>

                        {successMsg && !isEditing ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 space-y-6"
                            >
                                <div className="text-gold text-5xl">❦</div>
                                <h2 className="text-4xl font-serif text-gold mb-4">Confirmed</h2>
                                <p className="font-serif text-2xl text-gray-800 italic">{successMsg}</p>

                                <div className="space-y-4 pt-8 max-w-xs mx-auto">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-transparent border border-gold text-gold px-8 py-3 w-full hover:bg-gold hover:text-rich-black transition-colors uppercase tracking-widest text-sm"
                                    >
                                        Update My Details
                                    </button>

                                    <Link
                                        to="/guide?tab=Abode"
                                        target="_blank"
                                        className="block text-center text-xs uppercase tracking-widest text-gray-500 hover:text-gold transition-colors underline decoration-gray-700 underline-offset-4"
                                    >
                                        View Accommodation Options
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-10 text-left mt-8 max-w-lg mx-auto">

                                {/* 1. Name */}
                                <div className="group">
                                    <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-gold transition-colors font-semibold">Guest Name(s)</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-400 py-2 font-serif text-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold transition-colors text-center"
                                        placeholder="M."
                                        required
                                    />
                                </div>

                                {/* 2. Attendance */}
                                <div className="text-center space-y-6">
                                    <p className="font-serif text-xl italic text-gray-600">Will you be celebrating with us?</p>
                                    <div className="flex justify-center gap-8 md:gap-16">
                                        <label className="cursor-pointer group flex flex-col items-center gap-2">
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${status === 'attending' ? 'border-gold bg-gold' : 'border-gray-300 group-hover:border-gold'}`}>
                                                {status === 'attending' && <span className="text-white text-xs">✓</span>}
                                            </div>
                                            <span className={`font-serif text-lg ${status === 'attending' ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Accepts with Pleasure</span>
                                            <input type="radio" name="status" value="attending" checked={status === 'attending'} onChange={() => setStatus('attending')} className="hidden" />
                                        </label>

                                        <label className="cursor-pointer group flex flex-col items-center gap-2">
                                            <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${status === 'declined' ? 'border-gray-800 bg-gray-800' : 'border-gray-300 group-hover:border-gray-500'}`}>
                                            </div>
                                            <span className={`font-serif text-lg ${status === 'declined' ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>Declines with Regret</span>
                                            <input type="radio" name="status" value="declined" checked={status === 'declined'} onChange={() => setStatus('declined')} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                {/* Conditional Fields for Attendees */}
                                <AnimatePresence>
                                    {isAttending && (
                                        <motion.div
                                            key="attendee-fields"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-8 overflow-hidden"
                                        >
                                            <div className="h-px w-full bg-gray-100" />

                                            {/* Preferred Names */}
                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-gold transition-colors font-semibold">Preferred Names of Attendees</label>
                                                <input
                                                    type="text"
                                                    value={preferredNames}
                                                    onChange={(e) => setPreferredNames(e.target.value)}
                                                    className="w-full bg-transparent border-b border-gray-400 py-1 font-serif text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold transition-colors"
                                                    placeholder="e.g. John & Jane Doe"
                                                />
                                            </div>

                                            {/* Menu Selection - External Link */}
                                            <div className="space-y-6 text-center pt-8">
                                                <div className="flex items-center justify-center gap-4 mb-4">
                                                    <div className="h-px w-8 bg-gold/50" />
                                                    <p className="font-serif text-xl md:text-2xl text-gold uppercase tracking-widest font-bold">Menu Selection</p>
                                                    <div className="h-px w-8 bg-gold/50" />
                                                </div>

                                                <p className="text-gray-600 font-serif mb-4">
                                                    Please kindly make your meal selection via the form below.
                                                </p>

                                                <a
                                                    href="https://forms.gle/Uev6YgVWEzcwX3K79"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block border border-gold text-gold px-6 py-2 text-xs uppercase tracking-widest hover:bg-gold hover:text-white transition-colors"
                                                >
                                                    Select Your Meal
                                                </a>
                                            </div>


                                            {/* Shuttle Service */}
                                            <div className="space-y-4 pt-8">
                                                <div className="flex items-center justify-center gap-4 mb-4">
                                                    <div className="h-px w-8 bg-gold/50" />
                                                    <p className="font-serif text-xl md:text-2xl text-gold uppercase tracking-widest font-bold">Shuttle Service</p>
                                                    <div className="h-px w-8 bg-gold/50" />
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                    <label className="flex items-center gap-4 cursor-pointer group">
                                                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${shuttleAirport ? 'bg-gold border-gold' : 'border-gray-300 group-hover:border-gold'}`}>
                                                            {shuttleAirport && <span className="text-white text-xs">✓</span>}
                                                        </div>
                                                        <span className="font-serif text-gray-700">Shuttle – From Airport to Accommodation</span>
                                                        <input type="checkbox" checked={shuttleAirport} onChange={(e) => setShuttleAirport(e.target.checked)} className="hidden" />
                                                    </label>

                                                    <label className="flex items-center gap-4 cursor-pointer group">
                                                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${shuttleVenue ? 'bg-gold border-gold' : 'border-gray-300 group-hover:border-gold'}`}>
                                                            {shuttleVenue && <span className="text-white text-xs">✓</span>}
                                                        </div>
                                                        <span className="font-serif text-gray-700">Shuttle – Accommodation to Venue</span>
                                                        <input type="checkbox" checked={shuttleVenue} onChange={(e) => setShuttleVenue(e.target.checked)} className="hidden" />
                                                    </label>

                                                    <label className="flex items-center gap-4 cursor-pointer group mt-2 pt-2 border-t border-gray-100">
                                                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${accommodationNeeded ? 'bg-gold border-gold' : 'border-gray-300 group-hover:border-gold'}`}>
                                                            {accommodationNeeded && <span className="text-white text-xs">✓</span>}
                                                        </div>
                                                        <span className="font-serif text-gray-700">I require assistance to find accommodation</span>
                                                        <input type="checkbox" checked={accommodationNeeded} onChange={(e) => setAccommodationNeeded(e.target.checked)} className="hidden" />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Song Choice */}
                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-gold transition-colors font-semibold">A song that gets you on the dance floor</label>
                                                <input
                                                    type="text"
                                                    value={song}
                                                    onChange={(e) => setSong(e.target.value)}
                                                    className="w-full bg-transparent border-b border-gray-400 py-1 font-serif text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold transition-colors"
                                                    placeholder="A song that gets you on the dance floor"
                                                />
                                            </div>

                                            <div className="h-px w-full bg-gray-100" />

                                            {/* Dress Code Info */}





                                            {/* Dietary */}


                                            {/* Questions */}
                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-gray-600 mb-2 group-focus-within:text-gold transition-colors font-semibold">Questions or Messages</label>
                                                <textarea
                                                    value={questions}
                                                    onChange={(e) => setQuestions(e.target.value)}
                                                    className="w-full bg-transparent border-b border-gray-400 py-1 font-serif text-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gold transition-colors resize-none"
                                                    placeholder="Any questions for the couple?"
                                                    rows={1}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit Button */}
                                <div className="pt-8 text-center">
                                    {submitError && <p className="text-red-500 font-serif italic mb-4">{submitError}</p>}
                                    <button
                                        type="submit"
                                        className="bg-rich-black text-white font-serif italic text-xl px-12 py-3 hover:bg-gold hover:text-white transition-colors duration-500 shadow-lg"
                                    >
                                        Deliver Response
                                    </button>
                                </div>

                            </form>

                        )}

                        {/* Accommodation Link Footer */}
                        {!successMsg && (
                            <div className="pt-8 border-t border-gray-200 mt-8">
                                <p className="font-serif text-gray-800 italic text-center mb-4">Travel & Stay</p>
                                <div className="flex justify-center flex-col items-center gap-2">
                                    <Link to="/guide?tab=Abode" target="_blank" className="text-xs uppercase tracking-widest text-gold border-b border-gold pb-1 hover:text-rich-black hover:border-rich-black transition-colors">
                                        View Accommodation Areas
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div >

            {/* Footer Credit */}
            < div className="absolute bottom-4 left-0 w-full text-center z-20 pointer-events-none" >
                <p className="text-white/20 text-[10px] uppercase tracking-widest font-sans pointer-events-auto">
                    Designed by <a href="https://www.isutech.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">iSuTech</a>
                </p>
            </div >
            {/* Sunset Surprise Modal */}
            < AnimatePresence >
                {showSunsetModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rich-black/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#faf9f6] text-rich-black p-8 md:p-12 max-w-lg w-full relative shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                            style={{ borderRadius: "2px" }}
                        >
                            <div className="absolute inset-2 border border-gold/40 pointer-events-none" />

                            <div className="text-center space-y-6 relative z-10">
                                <div className="text-gold text-4xl">❦</div>
                                <h3 className="font-serif text-3xl text-gray-900">One Last Question...</h3>
                                <div className="space-y-4">
                                    <p className="font-serif text-xl text-gray-900 leading-relaxed font-medium">
                                        Do you want to join the <span className="text-gold italic font-bold">Sunset Surprise</span> with the Bangers?
                                    </p>
                                    <p className="font-serif text-base text-gray-800 italic leading-relaxed px-4">
                                        This is a complimentary, all-expenses-paid experience curated for your enjoyment.
                                        Please know that your attendance is entirely optional—join us only if you wish.
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold pt-2">
                                    March 6th • Post-Ceremony
                                </p>

                                <div className="grid grid-cols-1 gap-4 pt-4">
                                    <button
                                        onClick={() => submitRSVP(true)}
                                        className="bg-gold text-rich-black px-8 py-4 font-serif italic text-xl hover:bg-rich-black hover:text-gold transition-all duration-300 border border-transparent hover:border-gold shadow-lg"
                                    >
                                        Yes, I'm In!
                                    </button>
                                    <button
                                        onClick={() => submitRSVP(false)}
                                        className="bg-transparent border border-gray-300 text-gray-500 px-8 py-3 font-serif hover:border-gold hover:text-gold transition-all duration-300 uppercase tracking-widest text-xs"
                                    >
                                        No, Thank You
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >
        </div >
    );
};

export default RSVP;
