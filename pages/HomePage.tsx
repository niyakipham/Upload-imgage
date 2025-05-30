
import React, { useState, useCallback } from 'react';
import ImageUploader from '../components/ImageUploader';
import ShareModal from '../components/ShareModal';
import { useImageStorage } from '../hooks/useImageStorage';
import { ImageBatch } from '../types';
import ImageGrid from '../components/ImageGrid';
import { formatRelativeTime } from '../utils/formatter';
import { AlertTriangleIcon, Trash2Icon, ImageIcon } from '../components/Icons'; // Added ImageIcon here

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const { addImageBatch, allBatches, deleteBatchById } = useImageStorage();

  const handleFilesProcessed = useCallback(async (files: File[]) => {
    setIsLoading(true);
    try {
      const batchId = await addImageBatch(files);
      if (batchId) {
        const currentUrl = window.location.href.split('#')[0]; // Get base URL without existing hash
        setShareUrl(`${currentUrl}#/share/${batchId}`);
      } else {
        // Error already handled in useImageStorage or ImageUploader by alert
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      alert("An unexpected error occurred while saving images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [addImageBatch]);

  const closeShareModal = () => {
    setShareUrl(null);
    // Optionally, clear selected files from uploader if ImageUploader state is lifted or reset
  };

  const handleDeleteBatch = (batchId: string) => {
    if (window.confirm("Are you sure you want to delete this image batch? This action cannot be undone.")) {
        deleteBatchById(batchId);
    }
  }

  return (
    <div className="space-y-12">
      <ImageUploader onFilesProcessed={handleFilesProcessed} isLoading={isLoading} />

      {shareUrl && <ShareModal shareUrl={shareUrl} onClose={closeShareModal} />}

      {allBatches.length > 0 && (
        <section className="mt-12 p-6 bg-slate-800/50 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-100 mb-6">Your Locally Stored Batches</h2>
          <div className="space-y-8">
            {allBatches.map((batch: ImageBatch) => (
              <div key={batch.id} className="p-4 bg-slate-700/50 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <p className="text-sm text-indigo-400">
                            Share Link ID: <span className="font-mono text-indigo-300">{batch.id}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                            Created: {new Date(batch.createdAt).toLocaleString()} (Expires {formatRelativeTime(batch.expiryTimestamp)})
                        </p>
                    </div>
                    <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-md transition-colors"
                        title="Delete this batch"
                    >
                        <Trash2Icon className="w-5 h-5"/>
                    </button>
                </div>
                <ImageGrid files={batch.files} />
              </div>
            ))}
          </div>
        </section>
      )}

      {allBatches.length === 0 && !isLoading && (
         <div className="mt-12 text-center p-8 bg-slate-800/30 rounded-lg">
            <ImageIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl text-slate-400">No image batches stored yet.</h3>
            <p className="text-slate-500">Upload some images to get started!</p>
        </div>
      )}

      <div className="mt-10 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-200">
        <div className="flex items-start">
          <AlertTriangleIcon className="w-6 h-6 mr-3 text-yellow-400 flex-shrink-0"/>
          <div>
            <h4 className="font-semibold text-yellow-300">Important Note on Storage & Sharing:</h4>
            <p className="text-sm">
              Images are stored directly in your web browser's local storage. They are NOT uploaded to any server.
            </p>
            <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
              <li>Links work by referencing this local browser storage.</li>
              <li>Clearing your browser data will permanently delete these images.</li>
              <li>These links are generally <strong className="text-yellow-300">not shareable with other people on different computers</strong> as they cannot access your local browser data. This app demonstrates client-side storage capabilities.</li>
              <li>Local storage has size limits (typically 5-10MB). Uploading very large files or too many files may cause issues.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
