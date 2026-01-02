import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Instant jump using Lenis if available
        if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
            window.lenis.start(); // Re-enable scrolling in case it was stopped
        }

        // Fallback for native
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);

        // Ensure it sticks
        const timeout = setTimeout(() => {
            if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
            window.scrollTo(0, 0);
        }, 50);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}
