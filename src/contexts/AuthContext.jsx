import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '@/api/auth.api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    if (response.success && response.data?.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    if (response.success && response.data?.user) {
      setUser(response.data.user);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = () => {
    return fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
