import React, { useEffect, useState } from "react";
import axios from "axios";

const ComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints");
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h1 className="text-4xl font-bold text-center">Complaints List</h1>
        <p className="text-center mt-2 text-xl">Manage and view complaints</p>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-4 text-left">Complaint Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="border-b border-gray-200">
                  <td className="p-4">{complaint.title}</td>
                  <td className="p-4 capitalize">{complaint.category}</td>
                  <td className="p-4">
                    <span
                      className={`${
                        complaint.status === "Pending"
                          ? "text-yellow-500"
                          : complaint.status === "Resolved"
                          ? "text-green-500"
                          : "text-blue-500"
                      } font-semibold`}
                    >
                      {complaint.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md">View</button>
                  </td>
                </tr>
              ))}
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ComplaintsList;
