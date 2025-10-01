import { Capacitor } from "@capacitor/core";

/**
 * Utility để kiểm tra platform và xử lý camera cho web/mobile
 */

/**
 * Kiểm tra xem có đang chạy trên web không
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === "web";
};

/**
 * Chụp ảnh sử dụng Web Camera API (cho web browser)
 */
export const capturePhotoWeb = async (): Promise<string | null> => {
  try {
    // Request camera permission và stream
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "environment", // Ưu tiên camera sau
      },
    });

    return new Promise((resolve, reject) => {
      // Tạo video element để hiển thị stream
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;

      // Tạo canvas để capture frame
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Tạo modal để hiển thị camera
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;

      // Style cho video
      video.style.cssText = `
        max-width: 90%;
        max-height: 70%;
        border-radius: 8px;
      `;

      // Tạo button container
      const buttonContainer = document.createElement("div");
      buttonContainer.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 15px;
      `;

      // Nút chụp ảnh
      const captureBtn = document.createElement("button");
      captureBtn.textContent = "📸 Chụp ảnh";
      captureBtn.style.cssText = `
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      captureBtn.onmouseover = () => (captureBtn.style.background = "#2563eb");
      captureBtn.onmouseout = () => (captureBtn.style.background = "#3b82f6");

      // Nút hủy
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "❌ Hủy";
      cancelBtn.style.cssText = `
        background: #ef4444;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      `;
      cancelBtn.onmouseover = () => (cancelBtn.style.background = "#dc2626");
      cancelBtn.onmouseout = () => (cancelBtn.style.background = "#ef4444");

      // Thêm title
      const title = document.createElement("h2");
      title.textContent = "Camera Web";
      title.style.cssText = `
        color: white;
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
      `;

      // Event handlers
      const cleanup = () => {
        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(modal);
      };

      captureBtn.onclick = () => {
        // Set canvas dimensions based on video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data as base64
        const imageData = canvas.toDataURL("image/jpeg", 0.9);

        cleanup();
        resolve(imageData);
      };

      cancelBtn.onclick = () => {
        cleanup();
        resolve(null);
      };

      // Assemble modal
      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      modal.appendChild(title);
      modal.appendChild(video);
      modal.appendChild(buttonContainer);

      document.body.appendChild(modal);

      // Wait for video to be ready
      video.onloadedmetadata = () => {
        video.play();
      };

      // Handle errors
      video.onerror = () => {
        cleanup();
        reject(new Error("Không thể truy cập camera"));
      };
    });
  } catch (error) {
    console.error("Error accessing camera:", error);

    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        throw new Error("Vui lòng cấp quyền camera cho trình duyệt");
      } else if (error.name === "NotFoundError") {
        throw new Error("Không tìm thấy camera trên thiết bị");
      } else if (error.name === "NotSupportedError") {
        throw new Error("Trình duyệt không hỗ trợ camera");
      }
    }

    throw new Error("Không thể truy cập camera của máy tính");
  }
};

/**
 * Kiểm tra xem trình duyệt có hỗ trợ camera không
 */
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};
