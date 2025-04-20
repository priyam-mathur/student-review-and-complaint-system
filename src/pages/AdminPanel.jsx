import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from the backend on component mount
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the local state with the updated complaint
      const updatedComplaints = complaints.map((complaint) =>
        complaint._id === id ? { ...complaint, status: newStatus } : complaint
      );
      setComplaints(updatedComplaints);
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Admin Panel</h2>
      <ul className="mt-4">
        {complaints.map((complaint) => (
          <li key={complaint._id} className="border-b py-4">
            <h3 className="font-bold">{complaint.title}</h3>
            <p>{complaint.details}</p>
            {complaint.media && (
              <div className="mt-2">
                <img
                  src={`http://localhost:5000${complaint.media}`}
                  alt="Complaint media"
                  className="max-w-xs"
                />
              </div>
            )}
            <div className="mt-2">
              <span>Status: {complaint.status}</span>
              <div className="mt-2">
                <button
                  onClick={() => handleStatusChange(complaint._id, "Resolved")}
                  className="bg-green-500 text-white p-2 mx-1 rounded"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleStatusChange(complaint._id, "In Progress")}
                  className="bg-yellow-500 text-white p-2 mx-1 rounded"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange(complaint._id, "Pending")}
                  className="bg-red-500 text-white p-2 mx-1 rounded"
                >
                  Pending
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
