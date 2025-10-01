import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Header component chung cho toàn bộ ứng dụng
 * Hiển thị navigation và branding
 */
const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">📸</span>
            </div>
            <h1 className="text-xl font-bold">Photo Journal</h1>
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/")
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/add-photo"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/add-photo")
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  Add Photo
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
