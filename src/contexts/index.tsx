import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { AudioProvider } from "./AudioContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <AuthProvider>
        <AudioProvider>{children}</AudioProvider>
      </AuthProvider>
    </UserProvider>
  );
};

export default AppProvider;
