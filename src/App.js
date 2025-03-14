import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthContext";
import HomePage from "./features/home/HomePage";
import LoginPage from "./features/auth/LoginPage";
import SignupPage from "./features/auth/SignupPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import HistoryPage from "./features/history/HistoryPage";
import PrivateRoute from "./components/PrivateRoute";
 

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Usa PrivateRoute para proteger el acceso a estas rutas */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<DashboardPage />} />}
          />
          <Route
            path="/history"
            element={<PrivateRoute element={<HistoryPage />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
