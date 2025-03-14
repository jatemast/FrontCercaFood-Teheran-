import './home.css';
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="homepage">
            <div className="homepage-overlay">
                <div className="container">
                    <div className="logo-container">
                        <span className="logo-icon">🍽️</span>
                    </div>
                    
                    <h1>CercaFood <span className="brand-highlight">Teheran</span></h1>
                    
                    <div className="tagline">
                        Tu guía gastronómica personal
                    </div>
                    
                    <p>Descubre los mejores restaurantes cerca de ti. Navega entre opciones locales, revisa calificaciones y encuentra tu próximo lugar favorito para comer en segundos.</p>
                    
                    <div className="features">
                        <div className="feature">
                            <span className="feature-icon">📍</span>
                            <span>Geolocalización</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">⭐</span>
                            <span>Reseñas</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">🔍</span>
                            <span>Búsqueda rápida</span>
                        </div>
                    </div>
                    
                    <div className="homepage-buttons">
                        <Link to="/signup" className="btn-primary">Registrarse</Link>
                        <Link to="/login" className="btn-secondary">Iniciar sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;