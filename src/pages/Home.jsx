// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaChartLine, FaHandsHelping } from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar"; // Import Navbar

const Home = () => {
  const [stats, setStats] = useState({ pending: 0, resolved: 0 });
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/api/complaints/stats");
        setStats(statsRes.data);

        const testimonialsRes = await axios.get("http://localhost:5000/api/testimonials");
        setTestimonials(testimonialsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching home data", err);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 pt-20">
      {/* Navbar */}
      <Navbar /> {/* Add the Navbar component here */}

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-24 md:py-32">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-bounce">
            Welcome to the Student Review and Complaint System
          </h1>
          <p className="text-lg md:text-xl mb-8">
            A seamless platform to voice your concerns and track resolutions with transparency and ease.
          </p>
          <Link
            to="/register"
            aria-label="Register for the Complaint System"
            className="bg-white text-indigo-600 hover:text-blue-500 py-4 px-8 rounded-full text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-semibold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 text-4xl mb-4 mx-auto">
                <FaClipboardList />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Easy Complaint Submission</h3>
              <p className="text-gray-600">
                Submit complaints regarding campus issues effortlessly with our user-friendly interface.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-600 text-4xl mb-4 mx-auto">
                <FaChartLine />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Stay updated with real-time tracking of your complaint status.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-yellow-600 text-4xl mb-4 mx-auto">
                <FaHandsHelping />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Transparent Communication</h3>
              <p className="text-gray-600">
                Ensure clear and efficient interaction between students and authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-semibold mb-8">What Students Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial._id} className="p-6 bg-white rounded-lg shadow-lg">
                  <p className="italic text-gray-600">{testimonial.content}</p>
                  <h4 className="mt-4 text-xl font-semibold">- {testimonial.studentName}</h4>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">No testimonials available.</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 Student Review and Complaint System. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
