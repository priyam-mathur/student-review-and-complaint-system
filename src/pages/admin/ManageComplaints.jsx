// src/pages/admin/ManageComplaints.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints');
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComplaints(sorted);
      setFiltered(sorted);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const updatedStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
    try {
      await axios.put(`/api/complaints/${id}`, { status: updatedStatus });
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  useEffect(() => {
    let result = [...complaints];

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Filter by search
    if (searchTerm.trim() !== '') {
      result = result.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(result);
  }, [statusFilter, searchTerm, complaints]);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Manage Complaints</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full md:w-1/2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full md:w-1/3"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No complaints found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-indigo-500"
              >
                <h2 className="text-2xl font-semibold text-indigo-800 mb-2">{complaint.title}</h2>
                <p className="text-gray-700 mb-4">{complaint.description}</p>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-bold px-4 py-1 rounded-full ${
                      complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {complaint.status}
                  </span>
                  <button
                    onClick={() => toggleStatus(complaint._id, complaint.status)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Mark as {complaint.status === 'resolved' ? 'Pending' : 'Resolved'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageComplaints;
