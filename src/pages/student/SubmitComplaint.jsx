import React, { useState } from 'react';
import axios from 'axios';

const SubmitComplaint = ({ onComplaintSubmitted }) => {
  const [title, setTitle] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [media, setMedia] = useState(null);

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('complaintText', complaintText);
    if (media) {
      formData.append('media', media);
    }

    axios
      .post('/api/complaints', formData)
      .then((res) => {
        alert('Complaint submitted successfully');
        onComplaintSubmitted(); // Notify parent component to refresh complaints list
      })
      .catch((err) => {
        console.error('Error submitting complaint:', err);
        alert('Error submitting complaint');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Submit a New Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium" htmlFor="title">
            Complaint Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium" htmlFor="complaintText">
            Complaint Description
          </label>
          <textarea
            id="complaintText"
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
            rows="4"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium" htmlFor="media">
            Upload Media (Optional)
          </label>
          <input
            type="file"
            id="media"
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
