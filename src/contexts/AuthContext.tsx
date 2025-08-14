import { createContext, useContext, ReactNode } from "react";
import axios from "../api/axiosConfig";
import { toast } from "sonner";
import { encryptData, importKey } from "@/utils/crypto";
import { useUser } from "./UserContext";
import { updateEncryptedUser } from "@/utils/secureStorage";

// ---------- Types ----------
interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  signup: (
    formData: SignupData,
    navigate: (path: string) => void
  ) => Promise<void>;
  login: (
    formData: LoginData,
    navigate: (path: string) => void
  ) => Promise<void>;
  logout: (navigate: (path: string) => void) => Promise<void>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------- Context ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Provider ----------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setUser, setSavedTracks } = useUser();

  const signup = async (
    formData: SignupData,
    navigate: (path: string) => void
  ) => {
    try {
      console.log("formdata from the context for signup", formData);
      const response = await axios.post(`${BASE_URL}/auth/signup`, formData, {
        withCredentials: true,
      });
      const userData = response.data.user;
      const transformedUser = {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        credits: userData.credits,
        createdAt: userData.createdAt,
      };
      console.log("response", response.data);

      await updateEncryptedUser(transformedUser);

      setUser(transformedUser);

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup Failed");
      throw error;
    }
  };

  const login = async (
    formData: LoginData,
    navigate: (path: string) => void
  ) => {
    try {
      console.log("formdata from the context for login", formData);
      const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      const userData = response.data.user;
      const transformedUser = {
        id: userData.id,
        name: userData.username,
        email: userData.email,
        credits: userData.credits,
        createdAt: userData.createdAt,
      };
      console.log("response", response.data);

      await updateEncryptedUser(transformedUser);

      setUser(transformedUser);

      toast.success(response.data.message);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login Failed");
      throw error;
    }
  };

  const logout = async (navigate: (path: string) => void) => {
    try {
      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null);
      setSavedTracks([]);
      localStorage.removeItem("user_encrypted");
      localStorage.removeItem("user_iv");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------- Hook ----------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
