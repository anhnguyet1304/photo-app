import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import type { Photo } from "../types";

/**
 * Trang xem chi tiết ảnh với các chức năng sửa tiêu đề, xóa ảnh và chia sẻ
 */
const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getPhotoById,
    updatePhotoTitle,
    deletePhoto,
    sharePhoto,
    loading,
    error,
  } = usePhotoGallery();

  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Load photo data khi component mount
  useEffect(() => {
    if (id) {
      const foundPhoto = getPhotoById(id);
      if (foundPhoto) {
        setPhoto(foundPhoto);
        setTempTitle(foundPhoto.title);
      }
    }
  }, [id, getPhotoById]);

  /**
   * Xử lý lưu title đã chỉnh sửa
   */
  const handleSaveTitle = async () => {
    if (!photo) return;

    try {
      await updatePhotoTitle(photo.id, tempTitle);
      setPhoto({ ...photo, title: tempTitle });
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Error updating title:", err);
    }
  };

  /**
   * Hủy chỉnh sửa title
   */
  const handleCancelEdit = () => {
    setTempTitle(photo?.title || "");
    setIsEditingTitle(false);
  };

  /**
   * Xử lý xóa ảnh
   */
  const handleDeletePhoto = async () => {
    if (!photo) return;

    setIsDeleting(true);
    try {
      await deletePhoto(photo);
      // Redirect về gallery sau khi xóa
      navigate("/");
    } catch (err) {
      console.error("Error deleting photo:", err);
      setIsDeleting(false);
    }
  };

  /**
   * Xử lý chia sẻ ảnh
   */
  const handleSharePhoto = async () => {
    if (!photo) return;

    setIsSharing(true);
    try {
      await sharePhoto(photo);
    } catch (err) {
      console.error("Error sharing photo:", err);
    } finally {
      setIsSharing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Photo not found
  if (!photo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-8xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy ảnh
          </h1>
          <p className="text-gray-600 mb-8">
            Ảnh bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quay về Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <span className="mr-2">←</span>
            Quay về Gallery
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <div>
                <h3 className="text-red-800 font-medium">Có lỗi xảy ra</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Photo Detail Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Photo Display */}
          <div className="relative">
            <img
              src={photo.webviewPath || "/placeholder-image.png"}
              alt={photo.title || "Photo"}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzAgMTIwSDE5MFYxNDBIMTcwVjEyMFoiIGZpbGw9IiNENUQzRDciLz4KPGF0aCBkPSJNMTUwIDE2MEgyNDBWMTgwSDE1MFYxNjBaIiBmaWxsPSIjRDVEM0Q3Ii8+Cjwvc3ZnPgo=";
              }}
            />

            {/* Photo Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-white text-sm">
                📅 {new Date(photo.createdAt).toLocaleDateString("vi-VN")} -{" "}
                {new Date(photo.createdAt).toLocaleTimeString("vi-VN")}
              </p>
            </div>
          </div>

          {/* Photo Details */}
          <div className="p-6">
            {/* Title Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề
              </label>

              {isEditingTitle ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề cho ảnh..."
                    maxLength={100}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTitle}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      ✓ Lưu
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
                    >
                      ✕ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingTitle(true)}
                  className="cursor-pointer group"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 group-hover:bg-gray-100 transition-colors">
                    <p className="text-gray-800 text-lg">
                      {photo.title || "Chưa có tiêu đề"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 group-hover:text-gray-600">
                      👆 Nhấn để chỉnh sửa
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Ngày tạo</p>
                <p className="font-medium">
                  {new Date(photo.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">ID ảnh</p>
                <p className="font-medium text-xs">{photo.id}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Share Button */}
              <button
                onClick={handleSharePhoto}
                disabled={isSharing}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang chia sẻ...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📤</span>
                    Chia sẻ
                  </>
                )}
              </button>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditingTitle(true)}
                className="bg-yellow-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">✏️</span>
                Sửa tiêu đề
              </button>

              {/* Delete Button */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🗑️</span>
                Xóa ảnh
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Xác nhận xóa ảnh
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa ảnh này? Hành động này không thể hoàn
                tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeletePhoto}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDetailPage;
