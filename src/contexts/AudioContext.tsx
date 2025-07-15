import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";
import { toast } from "sonner";
import axios from "axios";
import { encryptData, importKey } from "@/utils/crypto";

interface AudioContextType {
  generatedAudioURL: string | null;
  isGenerating: boolean;
  generateMusic: (prompt: string, duration: number) => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [generatedAudioURL, setGeneratedAudioURL] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const { setUser, user, setCurrentGeneratedTrack } = useUser();

  const generateMusic = async (prompt: string, duration: number) => {
    if (!prompt || !duration) {
      toast.error("Prompt and duration are required");
      return;
    }

    try {
      setIsGenerating(true);

      const response = await axios.post(
        `${BASE_URL}/audio/generate`,
        { prompt, duration },
        { withCredentials: true }
      );

      console.log("response", response);

      const { url, credits, message } = response.data;

      if (!url || credits === undefined) {
        throw new Error("Invalid response from server.");
      }

      setGeneratedAudioURL(url);
      toast.success(message || "Music generated succesfully");

      if (user) {
        const updatedUser = { ...user, credits };
        setUser(updatedUser);

        const key = await importKey();

        const { encrypted, iv } = await encryptData(updatedUser, key);

        localStorage.setItem("user_encrypted", encrypted);
        localStorage.setItem("user_iv", iv);
      }

      if (setCurrentGeneratedTrack) {
        const newTrack = {
          id: `track_${Date.now()}`,
          title: prompt.slice(0, 30) + (prompt.length > 30 ? "..." : ""),
          url: url,
          duration: duration,
          dateCreated: new Date().toISOString(),
        };

        setCurrentGeneratedTrack(newTrack);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to generate audio");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AudioContext.Provider
      value={{ generatedAudioURL, isGenerating, generateMusic }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
