// src/hooks/useAuth.js

import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [user, setUser] = useState(null); // For storing user data
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Attach JWT token from localStorage
          },
        });
        setUser(response.data); // Set the user data
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Error fetching user data", err);
        setLoading(false); // Set loading to false even on error
      }
    };

    // If there's a token in localStorage, fetch user data
    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      setLoading(false); // If no token, set loading to false immediately
    }
  }, []); // Run only once when the component mounts

  return { user, loading }; // Return user data and loading state
};

export default useAuth;
