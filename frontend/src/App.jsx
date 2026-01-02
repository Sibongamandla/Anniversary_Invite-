import { useState, lazy, Suspense, useEffect } from 'react';
import Preloader from './components/Preloader';
import { GuestProvider } from './context/GuestContext';

// Lazy Load the heavy app content
const MainContent = lazy(() => import('./MainContent'));

function App() {
  const [loading, setLoading] = useState(true);

  // Start preloading the main app bundle immediately
  useEffect(() => {
    const loadMain = async () => {
      try {
        await import('./MainContent');
      } catch (e) {
        console.error("Failed to load main content", e);
      }
    };
    loadMain();
  }, []);

  return (
    <GuestProvider>
      {/* Main App Content - Rendered immediately behind preloader */}
      <Suspense fallback={<div className="h-screen w-screen bg-rich-black" />}>
        <MainContent />
      </Suspense>

      {/* Preloader overlay - Only unmounts after exit animation completes */}
      {loading && <Preloader onComplete={() => setLoading(false)} />}
    </GuestProvider>
  );
}

export default App;
