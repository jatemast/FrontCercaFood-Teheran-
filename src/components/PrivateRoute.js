import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";

const PrivateRoute = ({ element }) => {
  const { token } = useContext(AuthContext); // Verifica que token se esté gestionando correctamente

  if (!token) {
    return <Navigate to="/login" />; // Redirige a login si no hay token
  }

  return element; // Renderiza el elemento si el usuario está autenticado
};

export default PrivateRoute;
