import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const isTokenValid = () => {
        if (!token || !tokenExpiration) return false;
        return Date.now() < parseInt(tokenExpiration, 10);
    };

    if (!isTokenValid()) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}