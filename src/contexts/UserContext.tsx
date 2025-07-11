import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptData, importKey } from "@/utils/crypto";

// ---------- Types ----------
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
  logout: () => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
  saveTrack: (track: SavedTrack) => void;
  removeTrack: (trackId: string) => void;
  updateProfile: (updates: { name?: string; email?: string }) => void;
  setCurrentGeneratedTrack: (track: SavedTrack | null) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Added for AuthContext usage
}

// ---------- Context ----------
const UserContext = createContext<UserContextType | undefined>(undefined);

// ---------- Provider ----------
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedTracks, setSavedTracks] = useState<SavedTrack[]>([]);
  const [currentGeneratedTrack, setCurrentGeneratedTrack] =
    useState<SavedTrack | null>(null);

  // -------- Load Encrypted User on Mount --------
  useEffect(() => {
    const loadUserFromEncryptedStorage = async () => {
      const encrypted = localStorage.getItem("user_encrypted");
      const iv = localStorage.getItem("user_iv");

      if (encrypted && iv) {
        try {
          const key = await importKey();
          const userData = await decryptData(encrypted, iv, key);
          setUser(userData);
        } catch (error) {
          console.error("Decryption error:", error);
          setUser(null);
        }
      }
    };
    loadUserFromEncryptedStorage();
  }, []);

  // -------- Load Saved Tracks and Current Track on Mount --------
  useEffect(() => {
    const savedTracksData = localStorage.getItem("musemind_tracks");
    const savedCurrentTrack = localStorage.getItem("musemind_current_track");

    if (savedTracksData) {
      setSavedTracks(JSON.parse(savedTracksData));
    }
    if (savedCurrentTrack) {
      setCurrentGeneratedTrack(JSON.parse(savedCurrentTrack));
    }
  }, []);

  // -------- Persist Saved Tracks --------
  useEffect(() => {
    localStorage.setItem("musemind_tracks", JSON.stringify(savedTracks));
  }, [savedTracks]);

  // -------- Persist Current Generated Track --------
  useEffect(() => {
    if (currentGeneratedTrack) {
      localStorage.setItem(
        "musemind_current_track",
        JSON.stringify(currentGeneratedTrack)
      );
    } else {
      localStorage.removeItem("musemind_current_track");
    }
  }, [currentGeneratedTrack]);

  // -------- Core Functions --------
  const logout = () => {
    setUser(null);
    setSavedTracks([]);
    localStorage.removeItem("user_encrypted");
    localStorage.removeItem("user_iv");
  };

  const deductCredits = (amount: number) => {
    setUser((prev) =>
      prev ? { ...prev, credits: Math.max(0, prev.credits - amount) } : null
    );
  };

  const addCredits = (amount: number) => {
    setUser((prev) =>
      prev ? { ...prev, credits: prev.credits + amount } : null
    );
  };

  const saveTrack = (track: SavedTrack) => {
    setSavedTracks((prev) => [...prev, track]);
  };

  const removeTrack = (trackId: string) => {
    setSavedTracks((prev) => prev.filter((track) => track.id !== trackId));
  };

  const updateProfile = (updates: { name?: string; email?: string }) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        savedTracks,
        currentGeneratedTrack,
        isLoggedIn: !!user,
        logout,
        deductCredits,
        addCredits,
        saveTrack,
        removeTrack,
        updateProfile,
        setCurrentGeneratedTrack,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ---------- Hook ----------
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
