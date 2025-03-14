import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../auth/auth.css';


const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Registro exitoso. Por favor inicia sesión.");
                navigate("/login");
            } else {
                setError(data.message || "Error al registrarse");
            }
        } catch (error) {
            console.error("Error en signup:", error);
            setError("Error de conexión. Intente nuevamente más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <form onSubmit={handleSignup}>
                    <h2>Crear Cuenta</h2>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <input 
                        type="text" 
                        placeholder="Nombre completo" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                    
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Procesando..." : "Registrarse"}
                    </button>
                    
                    <Link to="/login" className="auth-link">
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;