import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ROUTES = ['/', '/story', '/venue', '/program', '/guide'];

const ScrollNavigator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNavigating, setIsNavigating] = useState(false);
    const lastScrollTime = useRef(Date.now());

    useEffect(() => {
        const handleWheel = (e) => {
            // Prevent rapid-fire based navigation
            if (isNavigating || Date.now() - lastScrollTime.current < 1000) return;

            const currentIndex = ROUTES.indexOf(location.pathname);
            if (currentIndex === -1) return; // Not on a navigational route (e.g., auth, rsvp)

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 2;
            const isAtTop = scrollTop === 0;

            // Scroll Down (Next Route)
            if (e.deltaY > 0 && isAtBottom) {
                if (currentIndex < ROUTES.length - 1) {
                    setIsNavigating(true);
                    lastScrollTime.current = Date.now();
                    navigate(ROUTES[currentIndex + 1]);
                    setTimeout(() => setIsNavigating(false), 1000); // Debounce duration matched to transition
                }
            }

            // Scroll Up (Previous Route)
            else if (e.deltaY < 0 && isAtTop) {
                if (currentIndex > 0) {
                    setIsNavigating(true);
                    lastScrollTime.current = Date.now();
                    navigate(ROUTES[currentIndex - 1]);
                    setTimeout(() => setIsNavigating(false), 1000);
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [location.pathname, navigate, isNavigating]);

    return null; // This component handles logic only
};

export default ScrollNavigator;
