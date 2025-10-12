import React, { createContext, useState, useContext } from 'react';
import { User, UserRole } from '../types.js';
interface UserContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User> = {
  Admin: { id: 'user1', name: 'Admin User', role: 'Admin' },
  Moderator: { id: 'user2', name: 'Moderator User', role: 'Moderator' },
  'Content Creator': { id: 'user3', name: 'Content Creator', role: 'Content Creator' },
};


export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.Admin);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};