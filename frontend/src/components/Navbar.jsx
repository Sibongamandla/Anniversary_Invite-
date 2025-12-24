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

    // Admin routes shouldn't show the guest navbar
    if (location.pathname.startsWith('/admin')) return null;

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Our Story', path: '/story' },
        { name: 'The Venue', path: '/venue' },
        { name: 'Program', path: '/program' },
        { name: 'Guide', path: '/guide' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${scrolled ? 'bg-white bg-opacity-90 backdrop-blur-md py-4 border-b border-charcoal border-opacity-5 shadow-sm' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className={`text-2xl font-serif font-bold tracking-widest hover:opacity-80 transition-opacity ${scrolled ? 'text-charcoal' : 'text-white mix-blend-difference'}`}>
                    ANNIVERSARY
                </Link>

                {/* Only show nav links if unlocked */}
                {guestCode && (
                    <>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-10">
                            {links.map((link) => (
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
                        <button className={`md:hidden hover:text-gold transition-colors ${scrolled ? 'text-charcoal' : 'text-white mix-blend-difference'}`} onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Mobile Menu */}
                        {isOpen && (
                            <div className="absolute top-full left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 md:hidden z-40">
                                {links.map((link) => (
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
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
