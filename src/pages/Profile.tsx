import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../appwrite/profile';
import { Button, LoadingSpinner } from '../components';
import type { Profile as ProfileType } from '../types/Profile';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadProfile = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            try {
                const profileData = await profileService.getProfile(user.$id);
                if (isMounted && profileData) {
                    setProfile(profileData);
                    if (profileData.avatar) {
                        const url = await profileService.getAvatarUrl(profileData.avatar);
                        if (isMounted && url) {
                            setAvatarUrl(url);
                        }
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load profile');
                    console.error('Profile load error:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isMounted = false;
        };
    }, [user, navigate]);

    if (loading) {
        return <LoadingSpinner message="Loading profile..." className="min-h-screen" />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-md">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="mt-3 text-xl font-medium text-gray-900">Error Loading Profile</h2>
                        <p className="mt-2 text-gray-500">{error}</p>
                        <div className="mt-6">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/')}
                                className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Return Home
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No profile found</h3>
                    <p className="mt-1 text-sm text-gray-500">The requested profile could not be found.</p>
                    <div className="mt-6">
                        <Button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Return Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="relative">
                                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={avatarUrl || '/default-avatar.png'}
                                        alt={profile.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/default-avatar.png';
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    aria-label="Edit profile"
                                    onClick={() => navigate('/profile/update')}
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-white">
                                <h1 className="text-3xl font-bold">{profile?.name}</h1>
                                <p className="text-blue-100 mt-1">{profile?.email}</p>
                                <p className="mt-3 text-blue-100 max-w-lg">
                                    {profile?.bio || 'No bio provided.'}
                                </p>
                                <div className="mt-4 flex space-x-4 justify-center sm:justify-start">
                                    <Link
                                        to="/profile/update"
                                        className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
                                    >
                                        Edit Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white px-8 py-6 border-b border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-4">
                                <p className="text-2xl font-bold text-gray-900">24</p>
                                <p className="text-sm text-gray-500">Posts</p>
                            </div>
                            <div className="p-4">
                                <p className="text-2xl font-bold text-gray-900">1.2K</p>
                                <p className="text-sm text-gray-500">Followers</p>
                            </div>
                            <div className="p-4">
                                <p className="text-2xl font-bold text-gray-900">847</p>
                                <p className="text-sm text-gray-500">Following</p>
                            </div>
                            <div className="p-4">
                                <p className="text-2xl font-bold text-gray-900">56</p>
                                <p className="text-sm text-gray-500">Watchlist</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Content */}
                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700">
                                    {profile?.bio || 'No additional information provided.'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-gray-700">Joined on {new Date().toLocaleDateString()}</p>
                                </div>
                                {/* Add more activity items as needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 