import axios from 'axios';

const API_URL = '/api/messages/';

// Send a message from the admin to a student
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(API_URL, messageData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message', error);
    throw error;
  }
};

// Get all messages for the logged-in student
export const getMessages = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages', error);
    throw error;
  }
};
