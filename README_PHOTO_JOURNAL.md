# Photo Journal App

Ứng dụng photo journal được xây dựng với React, TypeScript, Vite và Capacitor. Cho phép người dùng chụp ảnh, thêm tiêu đề và quản lý bộ sưu tập ảnh cá nhân.

## ✨ Tính năng chính

### Chức năng cơ bản

- 📸 **Chụp ảnh**: Sử dụng camera của thiết bị để chụp ảnh
- 💾 **Lưu trữ**: Lưu ảnh và metadata vào bộ nhớ thiết bị
- 🖼️ **Gallery**: Hiển thị tất cả ảnh dưới dạng lưới (grid)
- 👁️ **Xem chi tiết**: Xem ảnh ở kích thước lớn với thông tin chi tiết

### Chức năng nâng cao

- ✏️ **Sửa tiêu đề**: Chỉnh sửa tiêu đề ảnh trực tiếp
- 🗑️ **Xóa ảnh**: Xóa ảnh với xác nhận
- 📤 **Chia sẻ**: Chia sẻ ảnh qua các ứng dụng khác
- 📱 **Responsive**: Giao diện tương thích với mobile và desktop

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: React 18 với TypeScript
- **Build Tool**: Vite
- **Mobile Framework**: Capacitor
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)

### Capacitor Plugins:

- `@capacitor/camera`: Chụp ảnh
- `@capacitor/filesystem`: Lưu trữ file
- `@capacitor/preferences`: Lưu metadata
- `@capacitor/share`: Chia sẻ ảnh

## 📁 Cấu trúc dự án

```
src/
├── components/
│   └── Header.tsx              # Header navigation
├── pages/
│   ├── GalleryPage.tsx         # Trang gallery chính
│   ├── AddPhotoPage.tsx        # Trang chụp ảnh
│   └── PhotoDetailPage.tsx     # Trang chi tiết ảnh
├── hooks/
│   └── usePhotoGallery.ts      # Custom hook quản lý logic
├── types/
│   └── index.ts                # Type definitions
├── App.tsx                     # Root component với routing
└── main.tsx                    # Entry point
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### 3. Build cho production

```bash
npm run build
```

### 4. Chạy trên mobile (Capacitor)

#### iOS:

```bash
npm run build
npx cap sync ios
npx cap open ios
```

#### Android:

```bash
npm run build
npx cap sync android
npx cap open android
```

## 📱 Hướng dẫn sử dụng

### 1. Trang Gallery (Trang chủ)

- Hiển thị tất cả ảnh đã lưu dưới dạng lưới
- Click vào ảnh để xem chi tiết
- Nút "Thêm ảnh mới" để chụp ảnh

### 2. Trang Add Photo

- Nhấn "Mở Camera & Chụp ảnh" để mở camera thiết bị
- **Chỉ sử dụng camera để chụp ảnh trực tiếp** (không hỗ trợ chọn từ thư viện)
- **Trên web**: Sử dụng camera máy tính/laptop với WebRTC API
- **Trên mobile**: Sử dụng camera thiết bị với Capacitor Camera API
- Sau khi chụp, xem preview ảnh và nhập tiêu đề
- Nhấn "Lưu ảnh" để lưu vào bộ sưu tập

### 3. Trang Photo Detail

- Xem ảnh ở kích thước lớn
- Click vào tiêu đề để chỉnh sửa
- Các nút chức năng:
  - 📤 **Chia sẻ**: Chia sẻ ảnh
  - ✏️ **Sửa tiêu đề**: Chỉnh sửa tiêu đề
  - 🗑️ **Xóa ảnh**: Xóa ảnh (có xác nhận)

## 🔧 Logic chính trong usePhotoGallery Hook

### Chụp ảnh và lưu trữ:

**Trên Mobile:**

1. Sử dụng `Camera.getPhoto()` với Capacitor Camera API
2. Chuyển đổi ảnh thành base64
3. Lưu file vào `Filesystem` với `Directory.Data`
4. Lưu metadata vào `Preferences`

**Trên Web:**

1. Sử dụng `navigator.mediaDevices.getUserMedia()` để truy cập camera
2. Hiển thị camera stream trong modal popup
3. Capture frame từ video stream thành canvas
4. Chuyển đổi canvas thành base64 data URL
5. Lưu ảnh vào `localStorage` thay vì filesystem
6. Lưu metadata vào `localStorage`

### Quản lý state:

- Sử dụng `useState` để quản lý danh sách ảnh, loading, error
- `useEffect` để load ảnh đã lưu khi app khởi động

### Lưu trữ:

**Mobile:**

- **File ảnh**: Lưu trong filesystem của thiết bị với Capacitor Filesystem
- **Metadata**: Lưu trong Preferences dưới dạng JSON array

**Web:**

- **File ảnh**: Lưu trong localStorage của trình duyệt (base64)
- **Metadata**: Lưu trong localStorage dưới dạng JSON array

## 📝 Lưu ý phát triển

### Permissions cần thiết:

- **Camera**: Để chụp ảnh
- **Storage**: Để lưu file ảnh
- **Photos**: Để truy cập thư viện ảnh (iOS)

### Cấu hình Capacitor:

File `capacitor.config.ts` đã được cấu hình sẵn với:

- Android scheme: https
- Camera permissions
- Filesystem permissions

### Web Development:

Khi phát triển trên web, một số tính năng Capacitor có thể không hoạt động đầy đủ. Sử dụng các fallback thích hợp.

## 🐛 Troubleshooting

### 1. Camera không hoạt động:

- Kiểm tra permissions trong cài đặt thiết bị
- Đảm bảo đang chạy trên HTTPS (required cho camera API)

### 2. Ảnh không hiển thị:

- Kiểm tra file có tồn tại trong filesystem
- Kiểm tra đường dẫn webviewPath

### 3. Build errors với Tailwind:

- Đảm bảo đã cài `@tailwindcss/postcss`
- Kiểm tra cấu hình `postcss.config.js`

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.
