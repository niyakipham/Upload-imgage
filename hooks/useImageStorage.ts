
import { useState, useCallback, useEffect } from 'react';
import { ImageBatch, StoredFile } from '../types';
import { EXPIRY_DURATION_MS, LOCAL_STORAGE_KEY } from '../constants';

const generateId = (): string => Math.random().toString(36).substring(2, 15);

const getBatchesFromStorage = (): Record<string, ImageBatch> => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData) as Record<string, ImageBatch>;
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return {};
};

const saveBatchesToStorage = (batches: Record<string, ImageBatch>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(batches));
  } catch (error)
  {
    console.error("Error writing to localStorage:", error);
    alert("Could not save images. Local storage might be full or disabled.");
  }
};

export const useImageStorage = () => {
  const [batches, setBatches] = useState<Record<string, ImageBatch>>(getBatchesFromStorage());

  const cleanupExpiredBatches = useCallback(() => {
    const now = Date.now();
    const currentBatches = getBatchesFromStorage();
    let changed = false;
    const validBatches: Record<string, ImageBatch> = {};
    for (const id in currentBatches) {
      if (currentBatches[id].expiryTimestamp > now) {
        validBatches[id] = currentBatches[id];
      } else {
        changed = true;
        console.log(`Batch ${id} expired and removed.`);
      }
    }
    if (changed) {
      saveBatchesToStorage(validBatches);
      setBatches(validBatches);
    }
    return validBatches;
  }, []);

  useEffect(() => {
    const updatedBatches = cleanupExpiredBatches();
    setBatches(updatedBatches); // Ensure state is in sync after initial cleanup
    const intervalId = setInterval(cleanupExpiredBatches, 60 * 60 * 1000); // Check hourly
    return () => clearInterval(intervalId);
  }, [cleanupExpiredBatches]);

  const addImageBatch = useCallback(async (files: File[]): Promise<string | null> => {
    const currentBatches = cleanupExpiredBatches();
    const batchId = generateId();
    const now = Date.now();
    
    const storedFiles: StoredFile[] = [];
    for (const file of files) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        });
        storedFiles.push({
          id: generateId(),
          name: file.name,
          type: file.type,
          dataUrl,
          size: file.size,
        });
      } catch (error) {
        console.error("Error processing file:", file.name, error);
        // Skip this file or handle error appropriately
        alert(`Error processing file ${file.name}. It might be too large or corrupted.`);
        return null; 
      }
    }

    if (storedFiles.length === 0 && files.length > 0) {
      // All files failed to process
      return null;
    }

    const newBatch: ImageBatch = {
      id: batchId,
      files: storedFiles,
      expiryTimestamp: now + EXPIRY_DURATION_MS,
      createdAt: now,
    };

    const updatedBatches = { ...currentBatches, [batchId]: newBatch };
    saveBatchesToStorage(updatedBatches);
    setBatches(updatedBatches);
    return batchId;
  }, [cleanupExpiredBatches]);

  const getBatchById = useCallback((batchId: string): ImageBatch | null => {
    const currentBatches = cleanupExpiredBatches(); // Ensure we check against fresh data
    const batch = currentBatches[batchId];
    if (batch && batch.expiryTimestamp > Date.now()) {
      return batch;
    }
    if (batch && batch.expiryTimestamp <= Date.now()) {
        // If batch exists but is expired, ensure it's removed
        const {[batchId]: _removed, ...remainingBatches} = currentBatches;
        saveBatchesToStorage(remainingBatches);
        setBatches(remainingBatches);
    }
    return null;
  }, [cleanupExpiredBatches]);
  
  const deleteBatchById = useCallback((batchId: string): void => {
    const currentBatches = cleanupExpiredBatches();
    const {[batchId]: _deleted, ...remainingBatches} = currentBatches;
    saveBatchesToStorage(remainingBatches);
    setBatches(remainingBatches);
  },[cleanupExpiredBatches]);

  return { addImageBatch, getBatchById, deleteBatchById, allBatches: Object.values(batches).filter(b => b.expiryTimestamp > Date.now()).sort((a,b) => b.createdAt - a.createdAt) };
};
