
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useImageStorage } from '../hooks/useImageStorage';
import { ImageBatch } from '../types';
import ImageGrid from '../components/ImageGrid';
import { ClockIcon, AlertTriangleIcon, LinkIcon } from '../components/Icons';
import { formatRelativeTime } from '../utils/formatter';
import { EXPIRY_DURATION_HOURS } from '../constants';

const ViewSharedPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const { getBatchById } = useImageStorage();
  const [batch, setBatch] = useState<ImageBatch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    if (batchId) {
      const foundBatch = getBatchById(batchId);
      if (foundBatch) {
        setBatch(foundBatch);
      } else {
        setError(`Image batch not found or has expired. Links are valid for ${EXPIRY_DURATION_HOURS} hours and depend on local browser storage.`);
      }
    } else {
      setError("No batch ID provided.");
    }
    setIsLoading(false);
  }, [batchId, getBatchById]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <svg className="animate-spin h-12 w-12 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-slate-300">Loading image batch...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-red-900/30 border border-red-700 rounded-xl shadow-xl">
        <AlertTriangleIcon className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-red-300 mb-2">Access Error</h2>
        <p className="text-red-200 mb-6 max-w-md">{error}</p>
        <Link
          to="/"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  if (!batch) {
     // This case should ideally be covered by error state, but as a fallback:
    return (
      <div className="text-center p-6 bg-slate-800/50 rounded-xl shadow-xl">
        <p className="text-xl text-slate-400">Image batch could not be loaded.</p>
         <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl shadow-xl space-y-6">
      <div className="pb-4 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-indigo-400 mb-2">Image Batch</h1>
        <p className="text-slate-300">
          Displaying <span className="font-semibold text-indigo-300">{batch.files.length}</span> image{batch.files.length === 1 ? '' : 's'}.
        </p>
        <p className="text-sm text-slate-400 flex items-center mt-1">
          <ClockIcon className="w-4 h-4 mr-1.5 text-indigo-400" />
          Uploaded {formatRelativeTime(batch.createdAt)}. Expires {formatRelativeTime(batch.expiryTimestamp)}.
        </p>
        <p className="text-xs text-slate-500 mt-2 flex items-start">
            <AlertTriangleIcon className="w-3.5 h-3.5 mr-1.5 mt-0.5 text-yellow-500 flex-shrink-0"/>
            <span>These images are loaded from the local browser storage of the device where they were originally uploaded.</span>
        </p>
      </div>
      
      <ImageGrid files={batch.files} />

      <div className="pt-6 border-t border-slate-700 text-center">
        <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <LinkIcon className="w-5 h-5 mr-2" />
            Upload More Images
        </Link>
      </div>
    </div>
  );
};

export default ViewSharedPage;
    