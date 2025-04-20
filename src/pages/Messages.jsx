import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns"; // For date formatting

const Messages = () => {
  const { user } = useAuth(); // Get current user info (make sure user is authenticated)
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To store error messages

  useEffect(() => {
    if (user) {
      // Fetch messages for the logged-in user from the backend
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages/${user.id}`); // Adjust the API path based on your backend
          if (!response.ok) {
            throw new Error("Failed to fetch messages.");
          }
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          setError("Error fetching messages. Please try again later.");
          console.error("Error fetching messages:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border text-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-700 text-center mb-8">
        Messages
      </h1>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">You have no messages.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="mb-4">
              <p className="text-gray-700">{message.content}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(message.date), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
