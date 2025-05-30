
export interface StoredFile {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  size: number;
}

export interface ImageBatch {
  id: string;
  files: StoredFile[];
  expiryTimestamp: number;
  createdAt: number;
}

export interface PreviewFile extends File {
  preview: string;
  id: string;
}
