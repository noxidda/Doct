import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import defaultProfilePic from '../assets/profilepic.png';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const DEFAULT_AVATAR = defaultProfilePic;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  useEffect(() => {
    const syncSession = async () => {
      if (!isLoaded) {
        setLoading(true);
        return;
      }

      if (userId && clerkUser) {
        try {
          const token = await getToken();
          if (token) {
            localStorage.setItem('doct_clerk_token', token);
          }
          
          const hasCustomImage = clerkUser.hasImage === true;
          const mappedUser = {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress.split('@')[0] || 'User',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            role: clerkUser.publicMetadata?.role || 'Owner', // Default to owner so they have full access
            avatar: hasCustomImage ? clerkUser.imageUrl : DEFAULT_AVATAR,
            bio: clerkUser.publicMetadata?.bio || 'Workspace Member',
            timezone: 'UTC',
            preferences: { notifications: 'all', theme: 'dark' }
          };
          
          setUser(mappedUser);
          localStorage.setItem('doct_user', JSON.stringify(mappedUser));
        } catch (err) {
          console.error('Error syncing Clerk session:', err);
        }
      } else {
        setUser(null);
        localStorage.removeItem('doct_user');
        localStorage.removeItem('doct_clerk_token');
      }
      setLoading(false);
    };

    syncSession();
  }, [isLoaded, userId, clerkUser, getToken]);

  const login = async () => {
    // Handled by Clerk components directly
    return { success: true };
  };

  const signup = async () => {
    // Handled by Clerk components directly
    return { success: true };
  };

  const logout = async () => {
    localStorage.removeItem('doct_user');
    localStorage.removeItem('doct_clerk_token');
    setUser(null);
    await signOut();
  };

  const resetPassword = async () => {
    // Handled by Clerk components directly
    return { success: true };
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
      isDemoMode: false,
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
