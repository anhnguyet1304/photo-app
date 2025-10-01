import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { isWeb, isCameraSupported } from "../utils/cameraUtils";
import type { Photo } from "../types";

/**
 * Trang chụp ảnh với nút camera, preview ảnh và form nhập tiêu đề
 */
const AddPhotoPage: React.FC = () => {
  const navigate = useNavigate();
  const { takePhoto, savePhotoWithTitle, loading, error, clearError } =
    usePhotoGallery();

  const [capturedPhoto, setCapturedPhoto] = useState<Photo | null>(null);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Xử lý chụp ảnh
   */
  const handleTakePhoto = async () => {
    clearError();
    const photo = await takePhoto();
    if (photo) {
      setCapturedPhoto(photo);
    }
  };

  /**
   * Xử lý lưu ảnh với tiêu đề
   */
  const handleSavePhoto = async () => {
    if (!capturedPhoto) return;

    setIsSaving(true);
    try {
      await savePhotoWithTitle(capturedPhoto, title);
      // Redirect về gallery sau khi lưu thành công
      navigate("/");
    } catch (err) {
      console.error("Error saving photo:", err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Hủy và chụp lại
   */
  const handleRetake = () => {
    setCapturedPhoto(null);
    setTitle("");
    clearError();
  };

  /**
   * Hủy và quay về gallery
   */
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chụp ảnh mới
          </h1>
          <p className="text-gray-600">
            Sử dụng camera để chụp ảnh và thêm tiêu đề để lưu vào bộ sưu tập
          </p>
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

        {/* Camera Section - Hiển thị khi chưa chụp ảnh */}
        {!capturedPhoto && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-6xl text-gray-400">📷</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Sẵn sàng chụp ảnh bằng camera?
              </h2>
              <p className="text-gray-600 mb-2">
                Nhấn nút bên dưới để mở camera và chụp ảnh trực tiếp
              </p>
              <p className="text-gray-500 text-sm">
                📷 Ứng dụng sẽ mở camera của thiết bị để bạn chụp ảnh
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleTakePhoto}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang mở camera...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📸</span>
                    Mở Camera & Chụp ảnh
                  </>
                )}
              </button>

              <button
                onClick={handleCancel}
                className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Photo Preview và Title Input - Hiển thị sau khi chụp ảnh */}
        {capturedPhoto && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Photo Preview */}
            <div className="relative">
              <img
                src={capturedPhoto.webviewPath}
                alt="Captured photo"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Đã chụp
                </span>
              </div>
            </div>

            {/* Title Input Form */}
            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tiêu đề ảnh
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề cho bức ảnh này..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {title.length}/100 ký tự
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSavePhoto}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">💾</span>
                      Lưu ảnh
                    </>
                  )}
                </button>

                <button
                  onClick={handleRetake}
                  disabled={isSaving}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  <span className="mr-2">🔄</span>
                  Chụp lại
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 bg-red-300 text-red-700 py-3 px-6 rounded-lg font-medium hover:bg-red-400 transition-colors disabled:opacity-50"
                >
                  <span className="mr-2">❌</span>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>
            💡 Mẹo: Bạn có thể để trống tiêu đề và thêm sau khi xem chi tiết ảnh
          </p>
          <div className="bg-blue-50 rounded-lg p-3 text-blue-700">
            <p className="font-medium">📷 Lưu ý về chụp ảnh:</p>
            <p className="text-sm">
              • Ứng dụng chỉ sử dụng camera để chụp ảnh trực tiếp
            </p>
            <p className="text-sm">• Không hỗ trợ chọn ảnh từ thư viện</p>
            {isWeb() ? (
              <>
                <p className="text-sm">
                  • Trên web: Sử dụng camera máy tính/laptop
                </p>
                <p className="text-sm">
                  • Cần cấp quyền camera cho trình duyệt
                </p>
                {!isCameraSupported() && (
                  <p className="text-sm text-red-600">
                    ⚠️ Trình duyệt không hỗ trợ camera
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm">• Đảm bảo cấp quyền camera cho ứng dụng</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPhotoPage;
