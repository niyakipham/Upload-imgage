
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon, XIcon, LinkIcon, ClockIcon } from './Icons';
import { EXPIRY_DURATION_HOURS } from '../constants';

interface ShareModalProps {
  shareUrl: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-400 flex items-center">
            <LinkIcon className="w-7 h-7 mr-2" />
            Your Share Link is Ready!
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <XIcon className="w-7 h-7" />
          </button>
        </div>

        <p className="text-slate-300 mb-4">
          Copy the link below to share your images. Remember, this link provides access to images stored
          <strong className="text-indigo-400"> locally in your browser</strong>. Others can only view them if you send the link and they open it in a browser that can access your local data (which is generally not possible across different computers/users).
        </p>
        
        <div className="flex items-center space-x-3 bg-slate-700 p-3 rounded-lg mb-6">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-grow bg-transparent text-slate-200 focus:outline-none p-2"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-150 ease-in-out flex items-center
              ${copied 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800'
              }`}
          >
            {copied ? <CheckIcon className="w-5 h-5 mr-2" /> : <CopyIcon className="w-5 h-5 mr-2" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="bg-slate-700/50 p-4 rounded-lg text-sm text-slate-400">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-indigo-400"/>
            <span>These images will be accessible via this link for <strong className="text-indigo-300">{EXPIRY_DURATION_HOURS} hours</strong>, provided your browser data is not cleared.</span>
          </div>
           <p className="mt-2 text-xs">
            This application demonstrates temporary, client-side storage. For persistent, widely shareable storage, a backend server would be required.
          </p>
        </div>

        <button
            onClick={onClose}
            className="mt-8 w-full px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
          >
            Close
        </button>
      </div>
      {/*
        The <style jsx global> tag, which was here, has been removed to fix a TypeScript error.
        The class 'animate-modal-appear' is still applied to the div above.
        For this animation to work, its @keyframes 'modal-appear' and the 
        '.animate-modal-appear' class definition must be present in a global CSS file 
        (e.g., index.css or equivalent loaded by your application) or defined in your 
        Tailwind CSS configuration (tailwind.config.js).

        Example CSS to add globally:
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      */}
    </div>
  );
};

export default ShareModal;
