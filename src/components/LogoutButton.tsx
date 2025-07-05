import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { Button } from "./index";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { logout: authLogout } = useAuth();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("Logout button clicked");
        try {
            await authLogout();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <Button 
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
            type="button" 
        >
            Logout
        </Button>
    );
};

export default LogoutButton;