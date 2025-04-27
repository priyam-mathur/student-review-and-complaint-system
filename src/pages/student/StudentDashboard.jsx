import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaClipboardList, FaEnvelopeOpenText } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-10 text-center">
          Welcome to Your Student Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <Link
            to="/submit-complaint"
            className="rounded-3xl shadow-2xl p-8 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-4 border-indigo-500"
          >
            <div className="flex items-center space-x-5">
              <FaFileAlt className="text-5xl text-indigo-700" />
              <div>
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">Submit Complaint</h2>
                <p className="text-gray-600 text-lg">
                  Facing an issue? Submit a new complaint easily.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/track-complaints"
            className="rounded-3xl shadow-2xl p-8 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-4 border-indigo-500"
          >
            <div className="flex items-center space-x-5">
              <FaClipboardList className="text-5xl text-indigo-700" />
              <div>
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">Track Complaints</h2>
                <p className="text-gray-600 text-lg">
                  Check the status of your previous complaints.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/messages"
            className="rounded-3xl shadow-2xl p-8 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300 border-t-4 border-indigo-500"
          >
            <div className="flex items-center space-x-5">
              <FaEnvelopeOpenText className="text-5xl text-indigo-700" />
              <div>
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">Messages</h2>
                <p className="text-gray-600 text-lg">
                  Read replies and messages from the Admin.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* BIG BEAUTIFUL SECTION BELOW */}
        <div className="mt-20 bg-indigo-600 text-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="flex justify-center mb-4">
            <BsStars className="text-5xl animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Empower Your Voice 💬
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Your feedback shapes the future of your campus. Speak up and make your student experience even better. Let’s build a better place — together!
          </p>
          <p className="italic text-md">PIET</p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl text-gray-700">Need help? Reach out to support or your faculty.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
