import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsersCog, FaListAlt, FaCommentAlt, FaChartBar } from 'react-icons/fa';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-indigo-800 mb-12 text-center drop-shadow-lg">
          Welcome to Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <Link
            to="/manage-complaints"
            className="rounded-3xl shadow-2xl p-10 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-8 border-indigo-500"
          >
            <div className="flex items-center space-x-6">
              <FaListAlt className="text-6xl text-indigo-700" />
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-1">Manage Complaints</h2>
                <p className="text-lg text-gray-600">View and resolve student complaints efficiently.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/send-messages"
            className="rounded-3xl shadow-2xl p-10 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-8 border-indigo-500"
          >
            <div className="flex items-center space-x-6">
              <FaCommentAlt className="text-6xl text-indigo-700" />
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-1">Send Messages</h2>
                <p className="text-lg text-gray-600">Communicate updates or responses to students.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/student-list"
            className="rounded-3xl shadow-2xl p-10 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-8 border-indigo-500"
          >
            <div className="flex items-center space-x-6">
              <FaUsersCog className="text-6xl text-indigo-700" />
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-1">Student Management</h2>
                <p className="text-lg text-gray-600">See all registered students and their complaints.</p>
              </div>
            </div>
          </Link>

          <Link
            to="/analytics"
            className="rounded-3xl shadow-2xl p-10 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-8 border-indigo-500"
          >
            <div className="flex items-center space-x-6">
              <FaChartBar className="text-6xl text-indigo-700" />
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-1">Dashboard Analytics</h2>
                <p className="text-lg text-gray-600">Analyze complaint trends and system usage.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-20 text-center">
          <p className="text-xl text-gray-700">
            Need help? Contact the developer or check system logs for issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
