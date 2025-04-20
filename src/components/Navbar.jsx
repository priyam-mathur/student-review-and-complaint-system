import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // Get logged-in user details

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">
          Student Complaint System
        </h1>

        {/* Navigation Links */}
        <ul className="flex space-x-8 text-white font-medium">
          <li>
            <Link
              to="/"
              className="hover:text-indigo-300 transition duration-200"
            >
              Home
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-indigo-300 transition duration-200"
                >
                  Dashboard
                </Link>
              </li>

              {/* Student-specific links */}
              {user.role === "student" && (
                <>
                  <li>
                    <Link
                      to="/submit-complaint"
                      className="hover:text-indigo-300 transition duration-200"
                    >
                      Submit Complaint
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/track-complaints"
                      className="hover:text-indigo-300 transition duration-200"
                    >
                      Track Complaints
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/messages"
                      className="hover:text-indigo-300 transition duration-200"
                    >
                      Messages
                    </Link>
                  </li>
                </>
              )}

              {/* Admin (HOD) specific links */}
              {user.role === "admin" && (
                <>
                  <li>
                    <Link
                      to="/manage-complaints"
                      className="hover:text-indigo-300 transition duration-200"
                    >
                      Manage Complaints
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin-dashboard"
                      className="hover:text-indigo-300 transition duration-200"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                </>
              )}

              {/* Common to both roles */}
              <li>
                <Link
                  to="/profile"
                  className="hover:text-indigo-300 transition duration-200"
                >
                  Profile
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Profile & Logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-white font-medium">Hi, {user.name}!</span>
              <button
                onClick={logout}
                className="text-sm text-white bg-red-600 px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm text-white bg-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
