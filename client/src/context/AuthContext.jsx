import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Simulated Mock Users for demonstration
  const mockUsers = {
    owner: {
      id: 'usr_owner',
      name: 'Arthur Bauhaus',
      email: 'owner@wattker.com',
      role: 'Owner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Principal designer & system architect. Clean lines, clean code.',
      timezone: 'Europe/Berlin',
      preferences: { notifications: 'all', theme: 'dark' }
    },
    admin: {
      id: 'usr_admin',
      name: 'Gropius Admin',
      email: 'admin@wattker.com',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Wattker workspace supervisor and developer.',
      timezone: 'America/New_York',
      preferences: { notifications: 'mentions', theme: 'dark' }
    },
    manager: {
      id: 'usr_manager',
      name: 'Mies Manager',
      email: 'manager@wattker.com',
      role: 'Manager',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Project and sprint coordinator.',
      timezone: 'Asia/Kolkata',
      preferences: { notifications: 'mentions', theme: 'dark' }
    },
    member: {
      id: 'usr_member',
      name: 'Anni Albers',
      email: 'member@wattker.com',
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      bio: 'Frontend developer and content writer.',
      timezone: 'UTC',
      preferences: { notifications: 'none', theme: 'dark' }
    }
  };

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('wattker_user');
    const storedMode = localStorage.getItem('wattker_demo_mode');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Default to owner for easy evaluation out of the box
      setUser(mockUsers.owner);
      localStorage.setItem('wattker_user', JSON.stringify(mockUsers.owner));
    }
    
    if (storedMode !== null) {
      setIsDemoMode(storedMode === 'true');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Find matching mock user
    const matchedKey = Object.keys(mockUsers).find(
      key => mockUsers[key].email.toLowerCase() === email.toLowerCase()
    );
    
    if (matchedKey) {
      const loggedUser = mockUsers[matchedKey];
      setUser(loggedUser);
      localStorage.setItem('wattker_user', JSON.stringify(loggedUser));
      setLoading(false);
      return { success: true, user: loggedUser };
    }
    
    // Create simple mock account if doesn't exist
    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0],
      email: email,
      role: 'Member',
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      bio: 'New Wattker Member',
      timezone: 'UTC',
      preferences: { notifications: 'all', theme: 'dark' }
    };
    setUser(newUser);
    localStorage.setItem('wattker_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, user: newUser };
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      email: email,
      role: 'Member',
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      bio: 'New Wattker Member',
      timezone: 'UTC',
      preferences: { notifications: 'all', theme: 'dark' }
    };
    setUser(newUser);
    localStorage.setItem('wattker_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wattker_user');
  };

  const resetPassword = async (email, newPassword) => {
    return { success: true, message: 'Password reset successful' };
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('wattker_user', JSON.stringify(newUser));
  };

  // Helper to switch roles easily during evaluation
  const switchRole = (roleName) => {
    const key = roleName.toLowerCase();
    if (mockUsers[key]) {
      setUser(mockUsers[key]);
      localStorage.setItem('wattker_user', JSON.stringify(mockUsers[key]));
    }
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
      updateProfile,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
