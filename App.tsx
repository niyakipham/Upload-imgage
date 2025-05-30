
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewSharedPage from './pages/ViewSharedPage';
import { ClockIcon, ImageIcon, LinkIcon } from './components/Icons';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100">
      <header className="py-6 px-4 sm:px-8 shadow-lg bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold flex items-center group">
            <ImageIcon className="w-10 h-10 mr-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 group-hover:opacity-90 transition-opacity">
              Ephemeral Share
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            <span className="text-sm text-slate-400 flex items-center">
              <ClockIcon className="w-4 h-4 mr-1.5 text-indigo-400" />
              72-Hour Storage
            </span>
             <span className="text-sm text-slate-400 flex items-center">
              <LinkIcon className="w-4 h-4 mr-1.5 text-indigo-400" />
              Local Sharing
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/share/:batchId" element={<ViewSharedPage />} />
        </Routes>
      </main>

      <footer className="py-6 px-4 sm:px-8 text-center text-slate-400 border-t border-slate-700 bg-slate-900/50 backdrop-blur-md">
        <p>&copy; {new Date().getFullYear()} Ephemeral Image Share. Images are stored in your browser's local storage.</p>
        <p className="text-xs mt-1">For true cross-device sharing, a backend solution would be required.</p>
      </footer>
    </div>
  );
};

export default App;
