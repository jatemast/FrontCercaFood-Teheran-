import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import './dashboard.css';

function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      logout();
    }
  }, [logout]);

  const handleGetRestaurants = () => {
    setLoading(true);
    setError("");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchRestaurants(latitude, longitude);
        },
        () => {
          setError("No se pudo obtener la ubicación.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocalización no disponible.");
      setLoading(false);
    }
  };

  const fetchRestaurants = async (lat, lng) => {
    if (!token) {
      setError("No hay token de autenticación.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/search?lat=${lat}&lng=${lng}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en la solicitud.");
      }

      const data = await res.json();
      setRestaurants(data.length ? data : []);
      if (data.length) await saveSearch(lat, lng, data);
    } catch (error) {
      setError("No se pudieron obtener los restaurantes.");
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (lat, lng, restaurants) => {
    if (!user?.id || !token) return;

    try {
      const res = await fetch("http://localhost:3000/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lat, lng, query: "restaurantes", restaurants }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar historial.");
      }
    } catch (error) {
      console.error("Error al guardar búsqueda:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Hola, {user?.name || "Usuario"}</h2>
      <div className="button-container">
        <button onClick={logout}>Cerrar Sesión</button>
        <button onClick={handleGetRestaurants} disabled={loading}>
          {loading ? "Buscando restaurantes..." : "Ver Restaurantes Cercanos"}
        </button>
        <button onClick={() => navigate("/history")}>Ver Historial</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <div className="restaurant-card" key={index}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.vicinity}</p>
            <p>{restaurant.rating ? `⭐ ${restaurant.rating}` : "Sin calificación"}</p>
            {restaurant.place_id && (
              <a href={`https://www.google.com/maps/search/?api=1&query=restaurantes&query_place_id=${restaurant.place_id}`} target="_blank" rel="noopener noreferrer">
                Ver en Google Maps
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
