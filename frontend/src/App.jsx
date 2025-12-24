import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
import { GuestProvider, useGuest } from './context/GuestContext';

const ProtectedRoute = ({ children }) => {
  const { guestCode } = useGuest();
  if (!guestCode) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/join/:code" element={<RSVP />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Protected Routes */}
        <Route path="/story" element={<ProtectedRoute><Story /></ProtectedRoute>} />
        <Route path="/venue" element={<ProtectedRoute><Venue /></ProtectedRoute>} />
        <Route path="/program" element={<ProtectedRoute><Program /></ProtectedRoute>} />
        <Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

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
      import ScrollToTop from './components/ScrollToTop';

      // ... (lines omitted)

      <GuestProvider>
        <Router>
          <ScrollToTop />
          <div className="text-white min-h-screen font-sans antialiased">
            <AnimatePresence>
              {loading && <Preloader onComplete={() => setLoading(false)} />}
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
