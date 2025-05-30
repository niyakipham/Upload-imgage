
import React, { useState, useCallback, useEffect } from 'react';
import { MAX_FILES_UPLOAD } from '../constants';
import { PreviewFile } from '../types';
import { UploadCloudIcon, XIcon, ImageIcon } from './Icons'; // FileIcon was unused, removed.

interface ImageUploaderProps {
  onFilesProcessed: (files: File[]) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesProcessed, isLoading }) => {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((selectedFiles: FileList | null) => {
    setError(null);
    if (!selectedFiles) return;

    const newFilesArray = Array.from(selectedFiles).filter(file => file.type.startsWith('image/'));
    
    if (previewFiles.length + newFilesArray.length > MAX_FILES_UPLOAD) {
      setError(`You can upload a maximum of ${MAX_FILES_UPLOAD} images.`);
      return;
    }

    const newPreviewFiles: PreviewFile[] = newFilesArray.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));

    setPreviewFiles(prev => [...prev, ...newPreviewFiles]);
  }, [previewFiles.length]);

  const removeFile = useCallback((fileId: string) => {
    setPreviewFiles(prev => prev.filter(f => {
      if (f.id === fileId) {
        URL.revokeObjectURL(f.preview); // Clean up object URL
        return false;
      }
      return true;
    }));
    if (previewFiles.length -1 <= MAX_FILES_UPLOAD) {
         setError(null); // Clear error if count is now valid
    }
  }, [previewFiles]); // previewFiles dependency is correct here

  const handleProcessFiles = () => {
    if (previewFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    // Extract original File objects for processing
    const filesToProcess = previewFiles.map(pf => {
        // Create a new File object from the PreviewFile to ensure it's the original
        const originalFile = new File([pf], pf.name, { type: pf.type, lastModified: pf.lastModified });
        return originalFile;
    });
    onFilesProcessed(filesToProcess);
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Necessary to allow drop
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  useEffect(() => {
    // Cleanup object URLs on component unmount
    return () => {
      previewFiles.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [previewFiles]);

  return (
    <div className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-2xl">
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600/70 transition-colors ${isDragging ? 'drag-over' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloudIcon className="w-12 h-12 mb-4 text-indigo-400" />
          <p className="mb-2 text-lg text-slate-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
          <p className="text-sm text-slate-400">PNG, JPG, GIF, WEBP (Max {MAX_FILES_UPLOAD} files)</p>
        </div>
        <input id="file-upload" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
      </label>

      {error && <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}

      {previewFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-200">Selected Files ({previewFiles.length}/{MAX_FILES_UPLOAD}):</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2 bg-slate-700/50 rounded-lg">
            {previewFiles.map((file) => (
              <div key={file.id} className="relative group aspect-square bg-slate-600 rounded-md overflow-hidden shadow-md">
                <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                  <p className="text-xs text-white text-center truncate w-full px-1">{file.name}</p>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-700 transition-colors"
                    aria-label="Remove file"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleProcessFiles}
            disabled={isLoading || previewFiles.length === 0}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 mr-2" />
                Save {previewFiles.length} Image{previewFiles.length === 1 ? '' : 's'} & Get Link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
