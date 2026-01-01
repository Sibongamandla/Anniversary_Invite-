import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useGuest } from '../context/GuestContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const { guestCode } = useGuest();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Admin routes shouldn't show the guest navbar (when actually ON the admin page)
    // Hide Navbar on Admin Dashboard
    if (location.pathname.startsWith('/admin/dashboard')) {
        return null;
    }
    // Reverting that thought: The existing check `if (location.pathname.startsWith('/admin')) return null;` hides the navbar when you are viewing the dashboard. This is standard.
    // The user wants a LINK to get there.

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Our Story', path: '/story' },
        { name: 'The Venue', path: '/venue' },
        { name: 'Program', path: '/program' },
        { name: 'Guide', path: '/guide' },
        { name: 'Admin', path: '/admin/login' }, // Added Admin
    ];

    // Filter links based on auth state
    const visibleLinks = links.filter(link => {
        if (link.name === 'Admin') return true; // Always show Admin (per request)
        if (link.name === 'Home') return true;  // Always show Home
        return guestCode; // Only show others if unlocked
    });

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${scrolled ? 'bg-white/95 backdrop-blur-md py-4 border-b border-charcoal/5 shadow-sm' : 'bg-transparent py-4 md:py-8'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className={`text-xl md:text-2xl font-serif font-bold tracking-widest hover:opacity-80 transition-opacity z-50 ${isOpen ? 'text-charcoal' : (scrolled ? 'text-charcoal' : 'text-white mix-blend-difference')}`}>
                    ANNIVERSARY
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-10">
                    {visibleLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold ${scrolled ? (location.pathname === link.path ? 'text-gold' : 'text-gray-600') : (location.pathname === link.path ? 'text-gold' : 'text-gray-300 mix-blend-difference')}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden z-50 hover:text-gold transition-colors ${isOpen ? 'text-charcoal' : (scrolled ? 'text-charcoal' : 'text-white mix-blend-difference')}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu */}
                <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 md:hidden transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {visibleLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-2xl font-serif ${location.pathname === link.path ? 'text-gold' : 'text-charcoal'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
