import { useForm, type SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { registerStart, registerSuccess, registerFailure } from "../store/authSlice";   
import { Input, Button, LoadingSpinner } from "./index";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string; password: string; name: string }>();
    const dispatch = useDispatch();
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: SubmitHandler<{ email: string; password: string; name: string }> = async (data) => {
        try {
            setIsLoading(true);
            dispatch(registerStart());
            const response = await authRegister(data.email, data.password, data.name);
            dispatch(registerSuccess(response));
            navigate("/");
        } catch (error) {
            dispatch(registerFailure(error));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner message="Creating your account..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Signup</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <Input 
                    className="mb-2 w-96 px-2 py-1 border border-gray-300 rounded" 
                    type="email" 
                    placeholder="Email" 
                    {...register("email", { required: true })} 
                />
                <Input 
                    className="mb-2 w-96 px-2 py-1 border border-gray-300 rounded" 
                    type="password" 
                    placeholder="Password" 
                    {...register("password", { required: true })} 
                />
                <Input 
                    className="mb-2 w-96 px-2 py-1 border border-gray-300 rounded" 
                    type="text" 
                    placeholder="Name" 
                    {...register("name", { required: true })} 
                />
                <Button 
                    type="submit" 
                    className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300 flex justify-center items-center"
                    disabled={isLoading || isSubmitting}
                >
                    {isLoading || isSubmitting ? (
                        <>
                            <LoadingSpinner size="small" className="mr-2" />
                            Creating Account...
                        </>
                    ) : 'Register'}
                </Button>
                <Link className="text-blue-500 hover:underline block" to="/login">
                    Already have an account? Login
                </Link>
            </form>
        </div>
    );
}

export default Signup