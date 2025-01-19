"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // New loading state
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true); // Set loading to true

        if (!username || !password) {
            toast.error("Username and password are required");
            setLoading(false); // Reset loading state
            return;
        }

        const loadingToast = toast.loading("Logging in...");

        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            toast.dismiss(loadingToast);

            if (response.ok) {
                login(data.token, data.username, data.lastLogin); // Ensure you capture lastLogin
                toast.success(data.message || "Login successful!");
                setTimeout(() => {
                    router.push('/analytics');
                }, 1000);
            } else {
                toast.error(data.error || data.message || "Login failed");
                setError(data.error || data.message || "Login failed");
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error("Connection error. Please try again later.");
            setError("Connection error. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="bg-landing">
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: "#10B981",
                            color: "white",
                        },
                    },
                    error: {
                        style: {
                            background: "#EF4444",
                            color: "white",
                        },
                    },
                    loading: {
                        style: {
                            background: "#3B82F6",
                            color: "white",
                        },
                    },
                }}
            />

            <div className="min-h-screen bg-black/50 flex justify-end items-center pr-80">
                <div className="text-center w-full max-w-md">
                    <div className="mb-4">
                        <Image
                            src="/logo.png"
                            alt="Fantasy Baseball Logo"
                            width={400}
                            height={100}
                            className="mx-auto"
                        />
                    </div>
                    <p className="text-4xl text-white mb-8">Fantasy Sports Tools</p>

                    <form onSubmit={handleLogin} className="flex flex-col h-[400px]">
                        <h1 className="text-2xl font-bold text-white mb-6">Login</h1>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <ul className="space-y-4 mb-auto">
                            <li>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 text-white p-3 rounded focus:outline-none focus:border-customGreen placeholder-white/50"
                                    required
                                />
                            </li>
                            <li>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 text-white p-3 rounded focus:outline-none focus:border-customGreen placeholder-white/50"
                                    required
                                />
                            </li>
                            <li className="flex items-center justify-between text-white">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember-me"
                                        className="mr-2 accent-customGreen"
                                    />
                                    <label htmlFor="remember-me">Remember me</label>
                                </div>
                                <Link href="#" className="text-customGreen hover:underline">
                                    Forgot password?
                                </Link>
                            </li>
                        </ul>

                        <button
                            type="submit" // Use type="submit" for form submission
                            disabled={loading} // Disable button while loading
                            className={`bg-customGreen hover:bg-opacity-90 text-white py-3 px-6 rounded transition-all duration-300 mt-auto w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Logging in..." : "Login"} {/* Change button text based on loading state */}
                        </button>

                        <p className="text-white mt-4">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-customGreen hover:underline">
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;