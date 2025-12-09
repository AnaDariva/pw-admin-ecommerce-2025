
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

export default function RequireAdmin() {
    const { authenticated, authenticatedUser } = useAuth();

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (authenticatedUser?.role !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    console.log("RequireAdmin -> Auth:", authenticated, authenticatedUser);

    return <Outlet />;
}