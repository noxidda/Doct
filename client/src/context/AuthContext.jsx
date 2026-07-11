import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('doct_user');
    const storedMode = localStorage.getItem('doct_demo_mode');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    
    if (storedMode !== null) {
      setIsDemoMode(storedMode === 'true');
    } else {
      setIsDemoMode(false);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Create session profile on the fly
    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0],
      email: email,
      role: 'Owner', // Default to owner so they have full access to workspace settings on fresh logins
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      bio: 'Workspace Owner',
      timezone: 'UTC',
      preferences: { notifications: 'all', theme: 'dark' }
    };
    setUser(newUser);
    localStorage.setItem('doct_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, user: newUser };
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      email: email,
      role: 'Owner', // Default to owner for fresh signups
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      bio: 'Workspace Owner',
      timezone: 'UTC',
      preferences: { notifications: 'all', theme: 'dark' }
    };
    setUser(newUser);
    localStorage.setItem('doct_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('doct_user');
  };

  const resetPassword = async (email, newPassword) => {
    return { success: true, message: 'Password reset successful' };
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('doct_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemoMode,
      login,
      signup,
      logout,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
