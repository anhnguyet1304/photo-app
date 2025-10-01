import { useState, useEffect } from "react";
import {
  Camera,
  CameraResultType,
  CameraSource,
  type Photo as CameraPhoto,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import type { Photo, PhotoGalleryState } from "../types";
import {
  isWeb,
  capturePhotoWeb,
  isCameraSupported,
} from "../utils/cameraUtils";

const PHOTO_STORAGE = "photos";

/**
 * Custom hook để quản lý tất cả logic liên quan đến photo gallery
 * Bao gồm: chụp ảnh, lưu trữ, đọc, xóa, sửa và chia sẻ ảnh
 */
export const usePhotoGallery = () => {
  const [state, setState] = useState<PhotoGalleryState>({
    photos: [],
    loading: false,
    error: null,
  });

  // Load photos từ storage khi component mount
  useEffect(() => {
    loadSavedPhotos();
  }, []);

  /**
   * Chụp ảnh mới sử dụng camera (hỗ trợ cả web và mobile)
   */
  const takePhoto = async (): Promise<Photo | null> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Kiểm tra nếu đang chạy trên web
      if (isWeb()) {
        // Kiểm tra support camera trên web
        if (!isCameraSupported()) {
          throw new Error("Trình duyệt không hỗ trợ camera");
        }

        // Sử dụng Web Camera API
        const imageData = await capturePhotoWeb();
        if (!imageData) {
          setState((prev) => ({ ...prev, loading: false }));
          return null; // User cancelled
        }

        // Tạo mock CameraPhoto object cho web
        const webPhoto: CameraPhoto = {
          webPath: imageData,
          format: "jpeg",
          saved: false,
        };

        return await savePicture(webPhoto);
      } else {
        // Sử dụng Capacitor Camera cho mobile
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera, // Chỉ sử dụng camera
          quality: 90,
          allowEditing: false, // Không cho phép edit trước khi lưu
          saveToGallery: false, // Không tự động lưu vào gallery của hệ thống
          width: 1920, // Giới hạn width để tối ưu performance
          height: 1920, // Giới hạn height để tối ưu performance
        });

        return await savePicture(photo);
      }
    } catch (error) {
      let errorMessage = "Lỗi khi chụp ảnh";

      if (error instanceof Error) {
        // Xử lý các lỗi phổ biến
        if (error.message.includes("User cancelled")) {
          errorMessage = "Đã hủy chụp ảnh";
        } else if (error.message.includes("Camera not available")) {
          errorMessage = "Camera không khả dụng trên thiết bị này";
        } else if (error.message.includes("Permission denied")) {
          errorMessage = "Vui lòng cấp quyền camera cho ứng dụng trong cài đặt";
        } else {
          errorMessage = error.message;
        }
      }

      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      return null;
    }
  };

  /**
   * Lưu ảnh vào filesystem và preferences
   */
  const savePicture = async (
    photo: CameraPhoto,
    fileName?: string
  ): Promise<Photo> => {
    const timestamp = Date.now().toString();
    const finalFileName = fileName || `photo_${timestamp}.jpeg`;

    let base64Data: string;

    // Xử lý khác nhau cho web và mobile
    if (isWeb() && photo.webPath?.startsWith("data:")) {
      // Trên web, webPath đã là base64 data URL
      base64Data = photo.webPath;
    } else {
      // Trên mobile, cần fetch và convert
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await convertBlobToBase64(blob)) as string;
    }

    let savedFile: { uri: string };

    if (isWeb()) {
      // Trên web, lưu vào localStorage thay vì filesystem
      const photoData = {
        path: finalFileName,
        data: base64Data,
      };

      // Lưu vào localStorage với key là filename
      localStorage.setItem(`photo_${finalFileName}`, JSON.stringify(photoData));

      // Tạo mock saved file object
      savedFile = {
        uri: `local://${finalFileName}`,
      };
    } else {
      // Trên mobile, sử dụng Capacitor Filesystem
      savedFile = await Filesystem.writeFile({
        path: finalFileName,
        data: base64Data,
        directory: Directory.Data,
      });
    }

    const newPhoto: Photo = {
      id: timestamp,
      filepath: savedFile.uri,
      title: "",
      webviewPath: isWeb()
        ? base64Data
        : Capacitor.convertFileSrc(savedFile.uri),
      createdAt: new Date().toISOString(),
    };

    // Cập nhật state và lưu vào preferences
    setState((prev) => {
      const updatedPhotos = [newPhoto, ...prev.photos];
      savePhotosToPreferences(updatedPhotos);
      return {
        ...prev,
        photos: updatedPhotos,
        loading: false,
      };
    });

    return newPhoto;
  };

  /**
   * Lưu metadata của ảnh với title
   */
  const savePhotoWithTitle = async (
    photo: Photo,
    title: string
  ): Promise<void> => {
    const updatedPhoto = { ...photo, title };

    setState((prev) => {
      const updatedPhotos = prev.photos.map((p) =>
        p.id === photo.id ? updatedPhoto : p
      );
      savePhotosToPreferences(updatedPhotos);
      return {
        ...prev,
        photos: updatedPhotos,
      };
    });
  };

  /**
   * Cập nhật title của ảnh
   */
  const updatePhotoTitle = async (
    photoId: string,
    newTitle: string
  ): Promise<void> => {
    setState((prev) => {
      const updatedPhotos = prev.photos.map((photo) =>
        photo.id === photoId ? { ...photo, title: newTitle } : photo
      );
      savePhotosToPreferences(updatedPhotos);
      return {
        ...prev,
        photos: updatedPhotos,
      };
    });
  };

  /**
   * Xóa ảnh khỏi filesystem và storage
   */
  /**
   * Xóa ảnh khỏi filesystem và storage
   */
  const deletePhoto = async (photo: Photo): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      if (isWeb()) {
        // Trên web, xóa từ localStorage
        const fileName = photo.filepath.replace("local://", "");
        localStorage.removeItem(`photo_${fileName}`);
      } else {
        // Trên mobile, xóa file từ filesystem
        await Filesystem.deleteFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
      }

      // Cập nhật state và preferences
      setState((prev) => {
        const updatedPhotos = prev.photos.filter((p) => p.id !== photo.id);
        savePhotosToPreferences(updatedPhotos);
        return {
          ...prev,
          photos: updatedPhotos,
          loading: false,
        };
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi xóa ảnh";
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    }
  };

  /**
   * Chia sẻ ảnh
   */
  const sharePhoto = async (photo: Photo): Promise<void> => {
    try {
      await Share.share({
        title: photo.title || "Chia sẻ ảnh",
        text: photo.title,
        url: photo.filepath,
        dialogTitle: "Chia sẻ ảnh của bạn",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi chia sẻ ảnh";
      setState((prev) => ({ ...prev, error: errorMessage }));
    }
  };

  /**
   * Lấy ảnh theo ID
   */
  const getPhotoById = (photoId: string): Photo | undefined => {
    return state.photos.find((photo) => photo.id === photoId);
  };

  // Helper functions

  /**
   * Load photos đã lưu từ preferences
   */
  const loadSavedPhotos = async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      let photosInPreferences: Photo[] = [];

      if (isWeb()) {
        // Trên web, lấy từ localStorage
        const storedData = localStorage.getItem(PHOTO_STORAGE);
        photosInPreferences = storedData ? JSON.parse(storedData) : [];
      } else {
        // Trên mobile, lấy từ Preferences
        const { value } = await Preferences.get({ key: PHOTO_STORAGE });
        photosInPreferences = value ? JSON.parse(value) : [];
      }

      // Verify files still exist và tạo webviewPath
      const validPhotos: Photo[] = [];
      for (const photo of photosInPreferences) {
        try {
          if (isWeb()) {
            // Trên web, kiểm tra localStorage
            const fileName = photo.filepath.replace("local://", "");
            const photoData = localStorage.getItem(`photo_${fileName}`);

            if (photoData) {
              const parsedData = JSON.parse(photoData);
              const photoWithWebPath = {
                ...photo,
                webviewPath: parsedData.data, // Base64 data URL
              };
              validPhotos.push(photoWithWebPath);
            } else {
              console.warn(`Photo file not found in localStorage: ${fileName}`);
            }
          } else {
            // Trên mobile, kiểm tra filesystem
            await Filesystem.stat({
              path: photo.filepath,
              directory: Directory.Data,
            });

            // Add webviewPath for display
            const photoWithWebPath = {
              ...photo,
              webviewPath: Capacitor.convertFileSrc(photo.filepath),
            };
            validPhotos.push(photoWithWebPath);
          }
        } catch {
          // File không tồn tại, bỏ qua
          console.warn(`Photo file not found: ${photo.filepath}`);
        }
      }

      setState((prev) => ({
        ...prev,
        photos: validPhotos,
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi tải ảnh";
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    }
  };

  /**
   * Lưu danh sách photos vào preferences
   */
  const savePhotosToPreferences = async (photos: Photo[]): Promise<void> => {
    if (isWeb()) {
      // Trên web, lưu vào localStorage
      localStorage.setItem(PHOTO_STORAGE, JSON.stringify(photos));
    } else {
      // Trên mobile, lưu vào Preferences
      await Preferences.set({
        key: PHOTO_STORAGE,
        value: JSON.stringify(photos),
      });
    }
  };

  /**
   * Convert blob sang base64
   */
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return {
    photos: state.photos,
    loading: state.loading,
    error: state.error,
    takePhoto,
    savePhotoWithTitle,
    updatePhotoTitle,
    deletePhoto,
    sharePhoto,
    getPhotoById,
    clearError,
  };
};
