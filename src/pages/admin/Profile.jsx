// src/pages/Profile.jsx
import React from 'react';
import useAuth from "../../hooks/useAuth";
const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h2>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-4">
          <strong>Name:</strong> <span className="text-gray-600">{user.name}</span>
        </div>
        <div className="mb-4">
          <strong>Email:</strong> <span className="text-gray-600">{user.email}</span>
        </div>
        <div className="mb-4">
          <strong>Role:</strong> <span className="text-gray-600">{user.role}</span>
        </div>
        <button className="bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition duration-300">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
