import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null=loading, false=anon, obj=user
  const [token, setToken] = useState(() => localStorage.getItem("hilltrack_token"));

  useEffect(() => {
    if (!token) { setUser(false); return; }
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => {
      localStorage.removeItem("hilltrack_token");
      setToken(null); setUser(false);
    });
  }, [token]);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("hilltrack_token", data.token);
    setToken(data.token);
    setUser({ username: data.username, role: "admin" });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("hilltrack_token");
    setToken(null); setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
