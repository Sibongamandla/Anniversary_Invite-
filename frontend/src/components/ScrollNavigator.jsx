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
            // Looser tolerance for "bottom" on mobile and parallax pages
            const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
            const isAtTop = scrollTop <= 10;

            // Scroll Down (Next Route)
            if (e.deltaY > 0 && isAtBottom) {
                if (currentIndex < ROUTES.length - 1) {
                    setIsNavigating(true);
                    lastScrollTime.current = Date.now();
                    navigate(ROUTES[currentIndex + 1]);
                    setTimeout(() => setIsNavigating(false), 1000);
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

        let touchStartY = 0;

        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            if (isNavigating || Date.now() - lastScrollTime.current < 1000) return;

            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY; // Positive = Dragging Up (Scrolling Down)

            const currentIndex = ROUTES.indexOf(location.pathname);
            if (currentIndex === -1) return;

            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50; // Generous hit area
            const isAtTop = scrollTop <= 0;

            // Swipe Up (Go Next)
            if (deltaY > 50 && isAtBottom) { // 50px threshold
                if (currentIndex < ROUTES.length - 1) {
                    setIsNavigating(true);
                    lastScrollTime.current = Date.now();
                    navigate(ROUTES[currentIndex + 1]);
                    setTimeout(() => setIsNavigating(false), 1000);
                }
            }
            // Swipe Down (Go Prev)
            else if (deltaY < -50 && isAtTop) {
                if (currentIndex > 0) {
                    setIsNavigating(true);
                    lastScrollTime.current = Date.now();
                    navigate(ROUTES[currentIndex - 1]);
                    setTimeout(() => setIsNavigating(false), 1000);
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        // Use passive: false if we ever want to preventDefault, but for now strict listening is okay
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [location.pathname, navigate, isNavigating]);

    return null; // This component handles logic only
};

export default ScrollNavigator;
