import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
}

interface SavedTrack {
  id: string;
  title: string;
  url: string;
  duration: number;
  dateCreated: string;
}

interface UserContextType {
  user: User | null;
  savedTracks: SavedTrack[];
  currentGeneratedTrack: SavedTrack | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
  saveTrack: (track: SavedTrack) => void;
  removeTrack: (trackId: string) => void;
  updateProfile: (updates: { name?: string; email?: string }) => void;
  setCurrentGeneratedTrack: (track: SavedTrack | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [currentGeneratedTrack, setCurrentGeneratedTrack] = useState<SavedTrack | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('musemind_user');
    const savedTracksData = localStorage.getItem('musemind_tracks');
    const savedCurrentTrack = localStorage.getItem('musemind_current_track');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedTracksData) {
      setSavedTracks(JSON.parse(savedTracksData));
    }
    if (savedCurrentTrack) {
      setCurrentGeneratedTrack(JSON.parse(savedCurrentTrack));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('musemind_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('musemind_user');
    }
  }, [user]);

  // Save tracks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('musemind_tracks', JSON.stringify(savedTracks));
  }, [savedTracks]);

  // Save current generated track to localStorage
  useEffect(() => {
    if (currentGeneratedTrack) {
      localStorage.setItem('musemind_current_track', JSON.stringify(currentGeneratedTrack));
    } else {
      localStorage.removeItem('musemind_current_track');
    }
  }, [currentGeneratedTrack]);

  const login = async (email: string, password: string) => {
    // Simulate login - in real app this would be an API call
    const mockUser: User = {
      id: 'user_' + Date.now(),
      name: email.split('@')[0],
      email,
      credits: 120
    };
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate signup - in real app this would be an API call
    const mockUser: User = {
      id: 'user_' + Date.now(),
      name,
      email,
      credits: 50 // Starting credits
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setSavedTracks([]);
  };

  const deductCredits = (amount: number) => {
    setUser(prev => prev ? { ...prev, credits: Math.max(0, prev.credits - amount) } : null);
  };

  const addCredits = (amount: number) => {
    setUser(prev => prev ? { ...prev, credits: prev.credits + amount } : null);
  };

  const saveTrack = (track: SavedTrack) => {
    setSavedTracks(prev => [...prev, track]);
  };

  const removeTrack = (trackId: string) => {
    setSavedTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const updateProfile = (updates: { name?: string; email?: string }) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <UserContext.Provider value={{
      user,
      savedTracks,
      currentGeneratedTrack,
      isLoggedIn: !!user,
      login,
      signup,
      logout,
      deductCredits,
      addCredits,
      saveTrack,
      removeTrack,
      updateProfile,
      setCurrentGeneratedTrack
    }}>
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
