import React, { createContext, useContext, useState, useEffect } from "react";

interface Societe {
  id: number;
  raisonSociale: string;
}

interface PointDeVente {
  id: number;
  name: string;
}

interface ContexteDefaut {
  societe: Societe;
  pointDeVente: PointDeVente | null;
  role: string;
}

interface User {
  identiteNom: string;
  identiteType: string;
  username: string;
  contexteDefaut: ContexteDefaut;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data based on your Token structure
const MOCK_USER: User = {
  identiteNom: "Iskander Ben Ali",
  identiteType: "EMPLOYE",
  username: "iskander",
  contexteDefaut: {
    societe: { id: 1, raisonSociale: "Ashil Solutions" },
    pointDeVente: { id: 1, name: "Magasin Principal" },
    role: "SUPER_ADMIN"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_USER);

  const login = (token: string) => {
    // Simulation de décodage de token
    setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
    window.location.href = "/vitrine";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};