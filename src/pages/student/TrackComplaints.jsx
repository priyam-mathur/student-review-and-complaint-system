import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const TrackComplaints = () => {
  const { user, token } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch the complaints for the logged-in student
    if (user) {
      axios
        .get('/api/complaints', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setComplaints(res.data))
        .catch((err) => console.error('Error fetching complaints:', err));
    }
  }, [user, token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Track Your Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="border p-4 rounded-md shadow-md">
              <h3 className="text-xl font-semibold">{complaint.title}</h3>
              <p className="mt-2">{complaint.complaintText}</p>
              {complaint.media && (
                <div className="mt-2">
                  <img
                    src={`/uploads/${complaint.media}`}
                    alt="Complaint Media"
                    className="max-w-full h-auto"
                  />
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600">Status: {complaint.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackComplaints;
