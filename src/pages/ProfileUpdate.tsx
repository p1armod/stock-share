import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { profileStart, profileSuccess, profileFailure } from "../store/profileSlice";
import profileService from "../appwrite/profile";
import { Button, Input, LoadingSpinner } from "../components";
import { ID } from "appwrite";
import {type  RootState } from "../store/store";
import { useEffect, useState } from "react";

const ProfileUpdate = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const { user } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { profile, error: profileError } = useSelector((state: RootState) => state.profile);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        if (!user) {
            dispatch(profileFailure("User not found"));
            return;
        }
        dispatch(profileStart());
        setLoading(true);
        try {
            let avatarId = '';
            if (data.avatar && data.avatar[0]) {
                const avatar = await profileService.createAvatar(data.avatar[0]);
                if (!avatar) {
                    throw new Error("Avatar not created");
                }
                avatarId = avatar.$id;
            } else if (profile?.avatar) {
                avatarId = profile.avatar;
            }

            const profileData = {
                userId: user.$id,
                name: data.name,
                email: data.email,
                bio: data.bio,
                avatar: avatarId,
                $id: profile?.$id || ID.unique(),
                title: `${data.name}'s Profile`
            };

            const response = await profileService.createOrUpdateProfile(profileData);
            if (!response) {
                throw new Error("Failed to save profile");
            }
            dispatch(profileSuccess(profileData));
            navigate("/profile", { replace: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
            dispatch(profileFailure(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile) {
            setValue('name', profile.name || '');
            setValue('email', profile.email || '');
            setValue('bio', profile.bio || '');
        }
    }, [profile, setValue]);

    if (!user) {
        navigate("/login", { replace: true });
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner message="Updating profile..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-600 text-white">
                    <h1 className="text-2xl font-bold">Update Profile</h1>
                    <p className="text-blue-100">Update your profile information</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    <Input
                        label="Name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                    />
                    
                    <Input
                        label="Email"
                        type="email"
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        error={errors.email?.message}
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                            {...register("bio")}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("avatar")}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                        {profileError && (
                            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 mb-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm">{profileError}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" className="mr-2" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;