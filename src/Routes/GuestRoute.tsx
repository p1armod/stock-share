import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GuestRoute = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" />;
    }
    return <Outlet />;
};

export default GuestRoute;