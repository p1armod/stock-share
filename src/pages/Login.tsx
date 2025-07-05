import { Login as LoginComponent }  from "../components";
import { useAuth } from "../contexts/AuthContext";

function Login() {
    const {user} = useAuth();
    if(user){
        return (
            <div>
                <h1>Already logged in</h1>
            </div>
        )
    }
    return (
        <LoginComponent />
    )
}

export default Login;