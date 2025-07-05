import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AuthService } from '../appwrite/auth';
import type { Models } from 'appwrite';

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

type AuthProviderProps = {
    children: ReactNode;
    authService: AuthService;
};

export const AuthProvider = ({ children, authService }: AuthProviderProps) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkCurrentUser = async () => {
            setLoading(true);
            try {

                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
    
        checkCurrentUser();
    
        // Subscribe to auth changes
        const unsubscribe = authService.subscribeToAuth((user) => {
            setUser(user);
            setLoading(false);
        });
    
        return () => {
            unsubscribe();
            authService.cleanup();
        };
    }, []);

    const login = async (email: string, password: string) => {
        await authService.login(email, password);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || null);
    };

    const register = async (email: string, password: string, name: string) => {
        await authService.register(email, password, name);
        await authService.account.createEmailPasswordSession(email, password);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser || null);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };


    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
