import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [media, setMedia] = useState(null);

  // Assume you get userId from a global state or auth context
  const userId = 'dynamic_user_id'; // Replace with actual user ID from auth logic

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('userId', userId); // Include userId
    if (media) formData.append('media', media);

    try {
      const response = await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Complaint submitted successfully!');
      setTitle('');
      setDescription('');
      setCategory('');
      setMedia(null);
    } catch (error) {
      console.error('Error submitting the complaint:', error);
      alert('Error submitting complaint!');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
        <h1 className="text-4xl font-bold text-center">Submit a New Complaint</h1>
        <p className="text-center mt-2 text-xl">We are here to listen and help!</p>
      </header>

      <main className="container mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700">Complaint Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700">Complaint Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="facilities">Facilities</option>
              <option value="faculty">Faculty</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="media" className="block text-gray-700">Upload Media (Optional)</label>
            <input
              type="file"
              id="media"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
            Submit Complaint
          </button>
        </form>
      </main>
    </div>
  );
};

export default ComplaintForm;
