import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Table, Button, Pagination } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <nav className="bg-transparent w-full z-20 top-0 start-0 border-b mb-4 border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4 relative">
                {/* Logo - Left */}
                <div className="absolute left-0">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={150}
                            height={50}
                            className="h-auto w-auto"
                        />
                    </Link>
                </div>

                {/* Menu Items - Center */}
                <div className="flex-1 flex justify-center">
                    <div
                        className={`items-center ${
                            isMobileMenuOpen ? 'block' : 'hidden'
                        } w-full md:flex md:w-auto`}
                    >
                        <ul className="flex flex-col md:flex-row p-4 md:p-0 mt-4 md:mt-0 font-medium md:space-x-8 rtl:space-x-reverse">
                            <li>
                                <Link
                                    href="/analytics"
                                    className="block py-2 px-3 text-white rounded"
                                    aria-current="page"
                                >
                                    Draft Cheat Sheet
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/DraftAssistant"
                                    className="block py-2 px-3 text-white rounded"
                                >
                                    Draft Assistant
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="block py-2 px-3 text-white rounded"
                                >
                                    Team Manager
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Button and Mobile Menu - Right */}
                <div className="absolute right-0 flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-white border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Logout
                    </button>

                    <a
                        type="button"
                        href="/Settings"
                        className="text-white border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Settings
                    </a>

                    <button
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900 w-full">
                    <ul className="flex flex-col p-4 font-medium">
                        <li>
                            <Link
                                href="/analytics"
                                className="block py-2 px-3 text-white rounded"
                                aria-current="page"
                            >
                                Draft Cheat Sheet
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="block py-2 px-3 text-white rounded"
                            >
                                Draft Assistance
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/services"
                                className="block py-2 px-3 text-white rounded"
                            >
                                Team Manager
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;