import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import VisualEffects from './components/VisualEffects';
import ScrollNavigator from './components/ScrollNavigator';
import ScrollToTop from './components/ScrollToTop';
import { useGuest } from './context/GuestContext';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const RSVP = lazy(() => import('./pages/RSVP'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Story = lazy(() => import('./pages/Story'));
const Venue = lazy(() => import('./pages/Venue'));
const Program = lazy(() => import('./pages/Program'));
const Guide = lazy(() => import('./pages/Guide'));

const ProtectedRoute = ({ children }) => {
    const { guestCode } = useGuest();
    if (!guestCode) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const PageTransition = ({ children }) => {
    return (
        <m.div
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
        >
            {children}
        </m.div>
    );
};

const PREFETCH_MAP = {
    '/': () => import('./pages/Home'),
    '/story': () => import('./pages/Story'),
    '/venue': () => import('./pages/Venue'),
    '/program': () => import('./pages/Program'),
    '/guide': () => import('./pages/Guide'),
    '/rsvp': () => import('./pages/RSVP'),
};

const AnimatedRoutes = () => {
    const location = useLocation();

    // Prefetch Next Route Logic
    useEffect(() => {
        const ROUTES = ['/', '/story', '/venue', '/program', '/guide', '/rsvp'];
        const currentIndex = ROUTES.indexOf(location.pathname);

        if (currentIndex !== -1 && currentIndex < ROUTES.length - 1) {
            const nextRoute = ROUTES[currentIndex + 1];
            const prefetcher = PREFETCH_MAP[nextRoute];
            if (prefetcher) {
                // Low priority prefetch
                setTimeout(() => {
                    prefetcher()
                        .then(() => console.log(`Prefetched: ${nextRoute}`))
                        .catch(err => console.error("Prefetch error:", err));
                }, 1000); // Wait 1s after load to start prefetching
            }
        }
    }, [location.pathname]);

    return (
        <Suspense fallback={<div className="h-screen w-screen bg-rich-black" />}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/join/:code" element={<RSVP />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />

                    {/* Seamless Story Routes */}
                    <Route path="/story" element={<ProtectedRoute><PageTransition><Story /></PageTransition></ProtectedRoute>} />
                    <Route path="/venue" element={<ProtectedRoute><PageTransition><Venue /></PageTransition></ProtectedRoute>} />
                    <Route path="/program" element={<ProtectedRoute><PageTransition><Program /></PageTransition></ProtectedRoute>} />
                    <Route path="/guide" element={<ProtectedRoute><PageTransition><Guide /></PageTransition></ProtectedRoute>} />
                    <Route path="/rsvp" element={<ProtectedRoute><PageTransition><RSVP /></PageTransition></ProtectedRoute>} />
                </Routes>
            </AnimatePresence>
        </Suspense>
    );
}

export default function MainContent() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        window.lenis = lenis; // Expose for ScrollNavigator & ScrollToTop

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <LazyMotion features={domAnimation}>
                <div className="text-white min-h-screen font-sans antialiased relative">
                    <ScrollNavigator />
                    <VisualEffects />
                    <div className="grain-overlay" />
                    <Navbar />
                    <AnimatedRoutes />
                </div>
            </LazyMotion>
        </Router>
    );
}
