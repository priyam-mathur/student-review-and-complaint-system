// src/pages/admin/Messages.jsx
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const Messages = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      message: 'Your complaint has been resolved.',
      date: '2025-04-25',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      message: 'Your complaint is under review.',
      date: '2025-04-24',
    },
    // Add more dummy messages here
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          studentName: 'Student Name', // Replace with actual student name from context or db
          message: message,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-10 text-center">
          Send Messages to Students
        </h1>

        {/* Message sending form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl mb-10">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Compose a New Message</h2>
          <form onSubmit={handleSendMessage}>
            <textarea
              className="w-full p-4 mb-4 border border-indigo-300 rounded-lg text-lg"
              rows="5"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="text-right">
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-indigo-500 transition duration-300"
              >
                <FaPaperPlane /> <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of messages */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">Sent Messages</h2>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 border border-indigo-300 rounded-lg shadow-md">
                <h3 className="font-semibold text-xl text-indigo-700">{msg.studentName}</h3>
                <p className="text-lg text-gray-700 mt-2">{msg.message}</p>
                <p className="text-sm text-gray-500 mt-1">{msg.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
