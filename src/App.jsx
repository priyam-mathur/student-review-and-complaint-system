// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SubmitComplaint from "./pages/student/SubmitComplaint";
import TrackComplaints from "./pages/student/TrackComplaints";
import Messages from "./pages/student/Messages";
import AdminMessages from "./pages/admin/Messagess";
import ManageComplaints from "./pages/admin/ManageComplaints";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import Messagess from './pages/admin/Messagess';
import StudentList from "./pages/admin/StudentList";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route element={<PrivateRoute role="student" />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/submit-complaint" element={<SubmitComplaint />} />
                <Route path="/student/track-complaints" element={<TrackComplaints />} />
                <Route path="/student/messages" element={<Messagess />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute role="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/manage-complaints" element={<ManageComplaints />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/messages" element={<Messages />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
