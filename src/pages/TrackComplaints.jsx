import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";  // Optional for date formatting

const TrackComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      // Fetch complaints for the logged-in user (or for admins)
      const fetchComplaints = async () => {
        try {
          const response = await fetch(`/api/complaints/${user.id}`); // Adjust the API path
          if (!response.ok) {
            throw new Error("Failed to fetch complaints.");
          }
          const data = await response.json();
          setComplaints(data);
        } catch (error) {
          setError("Error fetching complaints. Please try again.");
          console.error("Error fetching complaints:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchComplaints();
    }
  }, [user]);

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-700 text-center mb-8">
        Track Your Complaints
      </h1>

      {/* Error Message */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Complaints Table */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {complaints.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            You have no complaints or your complaints are still being processed.
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-4">Complaint ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-t">
                  <td className="px-6 py-4">{complaint.id}</td>
                  <td className="px-6 py-4">{complaint.title}</td>
                  <td
                    className={`px-6 py-4 ${
                      complaint.status === "Resolved" ? "text-green-500" : "text-blue-600"
                    }`}
                  >
                    {complaint.status}
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(complaint.date), "MMM dd, yyyy")}  {/* Format date */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TrackComplaints;
