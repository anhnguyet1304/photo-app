import React from "react";
import { Link } from "react-router-dom";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import type { Photo } from "../types";

/**
 * Component cho một ảnh trong gallery grid
 */
const PhotoItem: React.FC<{ photo: Photo }> = ({ photo }) => {
  return (
    <Link
      to={`/photo/${photo.id}`}
      className="group relative bg-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="aspect-square">
        <img
          src={photo.webviewPath || "/placeholder-image.png"}
          alt={photo.title || "Untitled Photo"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Fallback nếu ảnh không load được
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTA1SDg1Vjc1WiIgZmlsbD0iI0Q1RDNENyIvPgo8cGF0aCBkPSJNNzAgMTI1SDE0NVYxNDVINzBWMTI1WiIgZmlsbD0iI0Q1RDNENyIvPgo8L3N2Zz4K";
          }}
        />
      </div>

      {/* Overlay với title */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-end">
        <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-sm font-medium truncate">
            {photo.title || "Untitled Photo"}
          </p>
          <p className="text-xs text-gray-300">
            {new Date(photo.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </Link>
  );
};

/**
 * Trang Gallery - hiển thị grid layout của tất cả ảnh đã lưu
 */
const GalleryPage: React.FC = () => {
  const { photos, loading, error } = usePhotoGallery();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải ảnh...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Photo Gallery
          </h1>
          <p className="text-gray-600">
            {photos.length > 0
              ? `Bạn có ${photos.length} ảnh trong bộ sưu tập`
              : "Chưa có ảnh nào trong bộ sưu tập"}
          </p>
        </div>

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-8xl mb-6">📸</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chưa có ảnh nào
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Bắt đầu chụp ảnh đầu tiên của bạn để tạo ra bộ sưu tập cá nhân!
            </p>
            <Link
              to="/add-photo"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">📷</span>
              Chụp ảnh đầu tiên
            </Link>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {photos.map((photo) => (
                <PhotoItem key={photo.id} photo={photo} />
              ))}
            </div>

            {/* Add More Photos Button */}
            <div className="text-center">
              <Link
                to="/add-photo"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">➕</span>
                Thêm ảnh mới
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
