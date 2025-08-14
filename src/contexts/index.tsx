import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { AudioProvider } from "./AudioContext";
import { PromptCacheProvider } from "./PromptCacheContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <AuthProvider>
        <AudioProvider>
          <PromptCacheProvider>{children}</PromptCacheProvider>
        </AudioProvider>
      </AuthProvider>
    </UserProvider>
  );
};

export default AppProvider;
