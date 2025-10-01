import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GalleryPage from "./pages/GalleryPage";
import AddPhotoPage from "./pages/AddPhotoPage";
import PhotoDetailPage from "./pages/PhotoDetailPage";

/**
 * Main App component với routing setup
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/add-photo" element={<AddPhotoPage />} />
            <Route path="/photo/:id" element={<PhotoDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
