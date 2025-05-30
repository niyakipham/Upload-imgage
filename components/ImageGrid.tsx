
import React from 'react';
import { StoredFile } from '../types';
import { formatBytes } from '../utils/formatter';
import { ImageIcon } from './Icons';

interface ImageGridProps {
  files: StoredFile[];
  batchDate?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ files, batchDate }) => {
  if (!files || files.length === 0) {
    return (
      <div className="text-center py-10">
        <ImageIcon className="w-16 h-16 mx-auto text-slate-500 mb-4" />
        <p className="text-xl text-slate-400">No images to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {batchDate && (
         <p className="text-sm text-slate-400">Uploaded on: {new Date(batchDate).toLocaleString()}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => (
          <div key={file.id} className="group relative aspect-w-1 aspect-h-1 bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-indigo-500/30">
            <img
              src={file.dataUrl}
              alt={file.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
              <h3 className="text-sm font-medium text-white truncate" title={file.name}>{file.name}</h3>
              <p className="text-xs text-slate-300">{formatBytes(file.size)}</p>
            </div>
             <a
              href={file.dataUrl}
              download={file.name}
              className="absolute top-2 right-2 p-1.5 bg-indigo-600/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              title="Download image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
    