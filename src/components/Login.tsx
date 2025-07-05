import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../store/authSlice";
import { Input, Button, LoadingSpinner } from "./index";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const {register,handleSubmit} = useForm<{email: string; password: string}>();
    const dispatch = useDispatch();
    const {login: authLogin} = useAuth();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [loading,setLoading] = useState(false);
    
    const onSubmit: SubmitHandler<{email: string; password: string}> = (data) => {
        dispatch(loginStart());
        setLoading(true);
        authLogin(data.email,data.password).then((response) => {
            dispatch(loginSuccess(response));
            if(user){
                navigate("/");
            }
        }).catch((error) => {
            dispatch(loginFailure(error));
        }).finally(() => {
            setLoading(false);
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner message="Signing in..." />
            </div>
        );
    }

    return (
       <>
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <Input className="mb-2 w-96 px-2 py-1 border border-gray-300 rounded" type="email" placeholder="Email" {...register("email")} />
                <Input className="mb-2 w-96 px-2 py-1 border border-gray-300 rounded" type="password" placeholder="Password" {...register("password")} />
                <Button 
                    className="mb-2 w-96 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 flex justify-center items-center" 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Logging in...
                        </>
                    ) : 'Login'}
                </Button>
                <Link className="text-blue-500 hover:underline block" to="/signup">Don't have an account? Sign up</Link>
            </form>
        </div>
       </>
    )
}

export default Login;