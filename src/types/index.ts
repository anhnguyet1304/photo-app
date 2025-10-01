export interface Photo {
  id: string;
  filepath: string;
  title: string;
  webviewPath?: string;
  createdAt: string;
}

export interface PhotoGalleryState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
}
