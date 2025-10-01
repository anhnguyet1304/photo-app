# 📸 Photo App

Ứng dụng **Photo App** giúp lưu trữ, quản lý và hiển thị ảnh cá nhân.  
Dự án được xây dựng bằng **React + Vite** và triển khai đa nền tảng qua **Capacitor** (Android/iOS).

---

## 🚀 Yêu cầu môi trường

Trước khi bắt đầu, hãy chắc chắn rằng bạn đã cài đặt:

- **Node.js** (phiên bản >= 16)
- **npm** (đi kèm với Node.js) hoặc **yarn**
- **Git**
- **Capacitor CLI** (`npm install @capacitor/cli -g`)
- (Tuỳ chọn) **Android Studio** – để build & chạy Android
- (Tuỳ chọn) **Xcode** – để build & chạy iOS (chỉ trên macOS)

---

## 📥 Cài đặt dự án

Clone dự án về máy:

```bash
git clone https://github.com/anhnguyet1304/photo-app.git
cd photo-app
```
Cài đặt dependencies:

```bash
npm install
```
# 🖥️ Chạy ứng dụng Web (development)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

# 📦 Build dự án (production)
```bash

npm run build
```
Kết quả build nằm trong thư mục dist/.

Xem trước bản build:

```bash

npm run preview
```
# 📱 Chạy ứng dụng trên Android/iOS với Capacitor
1. Đồng bộ build ra Capacitor
```bash
npx cap sync
```
2. Chạy trên Android
```bash
npx cap open android
```
Ứng dụng sẽ mở bằng Android Studio. Bạn có thể build và chạy trên thiết bị ảo (AVD) hoặc điện thoại thật.

3. Chạy trên iOS
```bash
npx cap open ios
```
Ứng dụng sẽ mở bằng Xcode. Bạn có thể build và chạy trên iPhone Simulator hoặc thiết bị thật (cần Apple Developer account).
