// src/pages/Dashboard.jsx

import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth(); // Fetch user data and logout function
  const navigate = useNavigate();

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.name}</h2>
      {user?.role === "admin" ? (
        <div>
          <h3>Admin Dashboard</h3>
          <p>Admin-specific content here...</p>
          {/* Add more admin features/content */}
        </div>
      ) : (
        <div>
          <h3>Student Dashboard</h3>
          <p>Student-specific content here...</p>
          {/* Add more student features/content */}
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
