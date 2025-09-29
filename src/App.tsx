import { useState } from 'react';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'main'>('landing');
  const [searchQuery, setSearchQuery] = useState('');

  const handleEnter = (query: string) => {
    setSearchQuery(query);
    setCurrentView('main');
  };

  return (
    currentView === 'landing' ? (
      <LandingPage onEnter={handleEnter} />
    ) : (
      <MainPage initialSearchQuery={searchQuery} />
    )
  );
}