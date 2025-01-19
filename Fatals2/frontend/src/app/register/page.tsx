"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Add this import

const Register = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [referralCode, setReferralCode] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleRegister = async () => {
        try {
            setError("");

            if (!username || !password) {
                toast.error("Username and password are required");
                return;
            }

            const loadingToast = toast.loading("Registering...");

            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    referral_code: referralCode,
                }),
            });

            const data = await response.json();
            toast.dismiss(loadingToast);

            if (response.ok) {
                if (data.token) {
                    // Log in the user with the token and username
                    login(data.token, username, null); // Pass username and null for lastLogin

                    // Show success message
                    toast.success("Registration successful!");

                    // Redirect to analytics page
                    setTimeout(() => {
                        router.push("/analytics");
                    }, 1000);
                } else {
                    throw new Error("No token received from server");
                }
            } else {
                // Show detailed error message
                const errorMessage = data.error || data.details || "Registration failed";
                toast.error(errorMessage);
                setError(errorMessage);
                console.error("Registration error details:", data);
            }
        } catch (err) {
            console.error("Registration error:", err);
            toast.error("Connection error. Please try again later.");
            setError("Connection error. Please try again later.");
        }
    };

    return (
        <div className="bg-landing">
            {/* Add Toaster component */}
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: "#10B981", // Green background
                            color: "white",
                        },
                    },
                    error: {
                        style: {
                            background: "#EF4444", // Red background
                            color: "white",
                        },
                    },
                    loading: {
                        style: {
                            background: "#3B82F6", // Blue background
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

                    <div className="flex flex-col h-[400px]">
                        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <ul className="space-y-4 mb-auto">
                            <li>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 text-white p-3 rounded focus:outline-none focus:border-customGreen placeholder-white/50"
                                />
                            </li>
                            <li>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 text-white p-3 rounded focus:outline-none focus:border-customGreen placeholder-white/50"
                                />
                            </li>
                            <li>
                                <input
                                    type="text"
                                    placeholder="Referral Code (optional)"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 text-white p-3 rounded focus:outline-none focus:border-customGreen placeholder-white/50"
                                />
                            </li>
                        </ul>

                        <button
                            onClick={handleRegister}
                            className="bg-customGreen hover:bg-opacity-90 text-white py-3 px-6 rounded transition-all duration-300 mt-auto w-full"
                        >
                            Register
                        </button>

                        <p className="text-white mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-customGreen hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;