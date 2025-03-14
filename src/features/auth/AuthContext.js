import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser && storedUser !== "undefined") {
          setUser(JSON.parse(storedUser));
        } else {
          logout(); // Si no hay usuario, cerrar sesión para evitar problemas
        }
      } catch (error) {
        console.error("❌ Error al parsear el usuario desde localStorage:", error);
        logout();
      }
    }
  }, [token]);

  const signup = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      const data = await response.json();
      console.log("✅ Respuesta de signup:", data);

      if (!data.user) {
        console.error("⚠️ No se recibió usuario después del registro.");
        throw new Error("No se pudo registrar el usuario.");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/dashboard");

      return data;
    } catch (error) {
      console.error("❌ Error en signup:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Error en el login");
      }

      const data = await response.json();
      console.log("🔍 Respuesta del backend en login:", data); // Para depuración

      if (!data.user) {
        console.error("⚠️ No se recibió usuario después del login.");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/dashboard"); 

      return data;
    } catch (error) {
      console.error("❌ Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};
