import React, { useEffect, useState } from "react";
import "./history.css";
const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener historial.");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("❌ Error obteniendo historial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Historial de Búsquedas</h2>
      {loading ? (
        <p className="text-center">Cargando historial...</p>
      ) : history.length === 0 ? (
        <p className="text-center">No hay búsquedas registradas.</p>
      ) : (
        <ul className="history-list space-y-4">
          {history.map((item, index) => (
            <li key={index} className="history-item bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm text-gray-500">📅 <strong>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Fecha no disponible"}</strong></p>
              <p className="text-sm text-gray-700">🌍 
                <a
                  href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {item.location_name || "Lugar no disponible"}
                </a>
              </p>
              <p className="text-sm text-gray-600">Búsqueda: <strong>{item.search_query}</strong></p>
              {item.restaurant_list && (
                <div className="mt-2">
                  <h4 className="font-semibold">Restaurantes:</h4>
                  <pre className="text-sm text-gray-600">{item.restaurant_list}</pre>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryPage;
