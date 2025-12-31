import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import RSVP from './pages/RSVP';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Story from './pages/Story';
import Venue from './pages/Venue';
import Program from './pages/Program';
import Guide from './pages/Guide';
import VisualEffects from './components/VisualEffects';
import ScrollNavigator from './components/ScrollNavigator';
import ScrollToTop from './components/ScrollToTop';
import { GuestProvider, useGuest } from './context/GuestContext';

const ProtectedRoute = ({ children }) => {
  const { guestCode } = useGuest();
  // For the seamless demo, we might want to be lenient or ensure auth is persisted.
  // Assuming guestCode is present after "unlock" or default for demo.
  if (!guestCode) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
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
        <Route path="/guide" element={<ProtectedRoute><PageTransition><Guide /></PageTransition></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <GuestProvider>
      <Router>
        <ScrollToTop />
        <VisualEffects />
        <ScrollNavigator />

        <div className="text-white min-h-screen font-sans antialiased relative">
          <AnimatePresence>
            {loading && <Preloader onComplete={handleLoadingComplete} />}
          </AnimatePresence>

          {!loading && (
            <>
              <div className="grain-overlay" />
              <Navbar />
              <AnimatedRoutes />
            </>
          )}
        </div>
      </Router>
    </GuestProvider>
  );
}

export default App;
