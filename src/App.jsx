import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import TrackComplaints from "./pages/TrackComplaints";
import Messages from "./pages/Messages";
import SubmitComplaint from "./pages/SubmitComplaint";
import { ThemeProvider } from "./context/ThemeContext";
import ManageComplaints from "./pages/ManageComplaints";
const App = () => {
  return (
    <ThemeProvider>
       <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/profile" element={<PrivateRoute>  <Profile /></PrivateRoute> }/>
        <Route path="/messages" element={<Messages />} />
        <Route path="/track-complaints" element={<TrackComplaints />} />
        <Route path="/submit-complaint" element={<SubmitComplaint/>}/>
        <Route path="/manage-complaints" element={<ManageComplaints/>} />
      </Routes>
    </Router>
    </ThemeProvider>
   
  );
};

export default App;
