import React from 'react';
import { FaUserCircle, FaCommentDots } from 'react-icons/fa';

const dummyMessages = [
  {
    id: 1,
    sender: 'Admin (HOD)',
    message: 'Your complaint about the library has been resolved. Thank you for your patience!',
    date: 'April 20, 2025',
  },
  {
    id: 2,
    sender: 'Admin (HOD)',
    message: 'The maintenance team is looking into the water issue you reported.',
    date: 'April 22, 2025',
  },
  {
    id: 3,
    sender: 'Admin (HOD)',
    message: 'Your feedback is valuable. We are working on improving canteen hygiene.',
    date: 'April 23, 2025',
  },
];

const Messages = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center">
          <FaCommentDots className="inline-block mr-2 text-indigo-600" />
          Messages from Admin
        </h1>

        <div className="space-y-6">
          {dummyMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white shadow-xl rounded-2xl p-6 border-l-8 border-indigo-500 transition duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center mb-2 text-indigo-700 font-semibold">
                <FaUserCircle className="text-2xl mr-2" />
                {msg.sender}
              </div>
              <p className="text-gray-800 text-lg mb-2">{msg.message}</p>
              <p className="text-sm text-gray-500 italic">{msg.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
