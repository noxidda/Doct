import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23E7E0EC"/><circle cx="12" cy="8" r="4" fill="%2379747E"/><path d="M12 14c-6.1 0-8 4-8 4h16s-1.9-4-8-4z" fill="%2379747E"/></svg>`;

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
          
          const hasCustomImage = clerkUser.hasImage || (clerkUser.imageUrl && !clerkUser.imageUrl.includes('default-user-image') && !clerkUser.imageUrl.includes('placeholder'));
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
