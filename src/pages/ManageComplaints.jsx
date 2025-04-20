import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ManageComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state
  const [updatingComplaint, setUpdatingComplaint] = useState(null); // Track which complaint is being updated

  useEffect(() => {
    if (user && user.role === "admin") {
      const fetchComplaints = async () => {
        try {
          const response = await fetch(`/api/admin/complaints`);
          if (!response.ok) throw new Error("Failed to fetch complaints.");
          const data = await response.json();
          setComplaints(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchComplaints();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  const handleStatusChange = async (id, newStatus) => {
    // Confirm status change
    if (!window.confirm("Are you sure you want to change the status of this complaint?")) {
      return;
    }

    setUpdatingComplaint(id); // Set the complaint being updated

    try {
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to update status.");

      // Optimistic UI update
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status: newStatus } : complaint
        )
      );
    } catch (error) {
      setError(error.message); // Set error if something fails
    } finally {
      setUpdatingComplaint(null); // Reset updating status
    }
  };

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-800">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-4 md:px-10 dark:bg-gray-900">
        <h1 className="text-3xl font-semibold">Manage Complaints</h1>
        <p className="text-sm mt-2">Admin can resolve and manage complaints here.</p>
      </header>

      {/* Complaint Table */}
      <section className="py-8 px-4 md:px-10">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">Complaints</h2>
        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 text-left">
              <tr>
                <th className="px-6 py-4">Complaint ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-t dark:border-gray-600">
                  <td className="px-6 py-4">{complaint.id}</td>
                  <td className="px-6 py-4">{complaint.title}</td>
                  <td className="px-6 py-4">{complaint.status}</td>
                  <td className="px-6 py-4">
                    {complaint.status === "Pending" ? (
                      <button
                        onClick={() => handleStatusChange(complaint.id, "Resolved")}
                        disabled={updatingComplaint === complaint.id}
                        className={`text-sm ${
                          updatingComplaint === complaint.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-700"
                        } text-white px-4 py-2 rounded-lg shadow transition`}
                      >
                        {updatingComplaint === complaint.id ? "Updating..." : "Mark as Resolved"}
                      </button>
                    ) : (
                      <span className="text-gray-500">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ManageComplaints;
