"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    username: string;
    lastLogin: string | null; // or Date if you prefer
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null; // Use the User type here
    login: (token: string, username: string, lastLogin: string | null) => void; // Update the login function signature
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null); // Use User type here
    const router = useRouter();

    useEffect(() => {
        // Check authentication status on mount
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsAuthenticated(true);
            // Optionally decode token to get user info
            try {
                const userInfo = JSON.parse(atob(token.split('.')[1]));
                setUser(userInfo); // Ensure userInfo matches User type
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, username: string, lastLogin: string | null) => {
        localStorage.setItem('authToken', token); // Use consistent key
        setIsAuthenticated(true);
        
        // Set user info
        setUser({ username, lastLogin }); // Ensure this matches User type
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
        router.push("/login");
    };

    if (isLoading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};