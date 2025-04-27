// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo and Home link */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="school">
            🏫
          </span>
          Complaint System
        </Link>

        <div className="flex gap-4 items-center">
          {/* Login option for users who are not logged in */}
          {!user ? (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 font-medium"
            >
              Login
            </Link>
          ) : (
            <>
              {/* Links for logged-in students */}
              {user?.role === "student" && (
                <>
                  <Link to="/student/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                  <Link to="/student/submit-complaint" className="hover:underline">
                    Submit Complaint
                  </Link>
                  <Link to="/student/track-complaints" className="hover:underline">
                    Track Complaints
                  </Link>
                  <Link to="/student/messages" className="hover:underline">
                    Messages
                  </Link>
                </>
              )}

              {/* Links for logged-in admins */}
              {user?.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                  <Link to="/admin/manage-complaints" className="hover:underline">
                    Manage Complaints
                  </Link>
                  <Link to="/admin/messages" className="hover:underline">
                    Messages
                  </Link>
                </>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
