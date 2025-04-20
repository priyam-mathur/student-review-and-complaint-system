import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Dashboard = () => {
  const { user } = useAuth(); // Get the authenticated user
  const [stats, setStats] = useState({ pending: 0, resolved: 0 }); // Stats for pending and resolved complaints
  const [recentComplaints, setRecentComplaints] = useState([]); // Store recent complaints

  // Fetch dashboard data (complaints stats and recent complaints) when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch the stats (pending and resolved complaints) from the backend
        const statsRes = await axios.get("http://localhost:5000/api/complaints/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token for authentication
          },
        });
        setStats(statsRes.data); // Set the fetched stats

        // Fetch the recent complaints for the logged-in user
        const complaintsRes = await axios.get("http://localhost:5000/api/complaints/recent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRecentComplaints(complaintsRes.data); // Set the fetched recent complaints
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array means this runs only once when the component mounts

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-4 md:px-10 dark:bg-gray-900">
        <h1 className="text-3xl font-semibold">Welcome, {user?.name || "User"}!</h1>
        <p className="text-sm mt-2">Manage and track all your activities from one place.</p>
      </header>

      {/* Summary Widgets */}
      <section className="py-8 px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-700 shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Pending Complaints</h2>
          <p className="text-4xl font-bold text-blue-500 dark:text-blue-400">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-700 shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Resolved Complaints</h2>
          <p className="text-4xl font-bold text-green-500 dark:text-green-400">{stats.resolved}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 px-4 md:px-10 bg-gray-100 dark:bg-gray-700">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {user?.role === "student" && (
            <Link to="/submit-complaint" className="bg-indigo-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Submit Complaint</h3>
              <p>Raise a new complaint about any issue you're facing.</p>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/manage" className="bg-indigo-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2">Manage Complaints</h3>
              <p>View and handle submitted complaints.</p>
            </Link>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-8 px-4 md:px-10">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Recent Activity</h2>
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 text-left">
              <tr>
                <th className="px-6 py-4">Complaint ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <tr key={complaint._id} className="border-t dark:border-gray-600">
                    <td className="px-6 py-4">#{complaint._id.slice(-4)}</td>
                    <td className="px-6 py-4">{complaint.title}</td>
                    <td className="px-6 py-4 text-yellow-600 dark:text-yellow-400">
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">No recent activity.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
