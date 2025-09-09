import { useState, useMemo } from 'react';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'main'>('landing');

  return (
    currentView === 'landing' ? (
      <LandingPage onEnter={() => setCurrentView('main')} />
    ) : (
      <MainPage />
    )
  );
}