import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <AuthProvider>{children}</AuthProvider>
    </UserProvider>
  );
};

export default AppProvider;
