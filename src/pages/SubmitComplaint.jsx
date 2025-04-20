import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SubmitComplaint = () => {
  const { user } = useAuth(); // Get current user info (make sure user is authenticated)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    setLoading(true);
    setError("");

    // Prepare form data to submit
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("userId", user.id);
    if (media) {
      formData.append("media", media);
    }

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint.");
      }

      // Reset the form
      setTitle("");
      setDescription("");
      setStatus("Pending");
      setMedia(null);
      alert("Complaint submitted successfully!");
    } catch (error) {
      setError("Error submitting complaint. Please try again.");
      console.error("Error submitting complaint:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <h1 className="text-3xl font-semibold text-gray-700 text-center mb-8">
        Submit a Complaint
      </h1>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="media" className="block text-lg font-medium text-gray-700">
              Upload Media (Optional)
            </label>
            <input
              type="file"
              id="media"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md"
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
          </div>

          <div className="mb-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
