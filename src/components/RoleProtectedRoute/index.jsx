import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        if (!allowedRoles.includes(role)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
}