// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Fantasy Baseball App - Home',
    description: 'Welcome to the Fantasy Baseball App',
};

const Home = () => {
    return (
        <div className="bg-landing">
            {/* Flex container */}
            <div className="min-h-screen bg-black/50 flex justify-end items-center pr-80">
                <div className="text-center">
                    <div className="mb-4">
                        <Image
                            src="/logo.png"
                            alt="Fantasy Baseball Logo"
                            width={400}
                            height={100}
                            className="mx-auto"
                        />
                    </div>
                    <p className="text-4xl text-white mb-8">
                        Fantasy Sports Tools
                    </p>
                    
                    {/* List container with flex to push last item down */}
                    <div className="flex flex-col h-[400px] border"> {/* Adjust height as needed */}
                        {/* First 4 items grouped together */}
                        <div className="space-y-4 mb-auto ">
                            <Link
                                href="/FantasyBaseball"
                                className="block text-white py-2 px-6 hover:bg-blue-700"
                            >
                                Fantasy Baseball
                            </Link>
                            <Link
                                href="/analytics"
                                className="block text-white py-2 px-6 hover:bg-blue-700"
                            >
                                2024 Draft Cheat Sheet
                            </Link>
                            <Link
                                href="/DraftAssistant"
                                className="block text-white py-2 px-6 hover:bg-blue-700"
                            >
                                Draft Assistant
                            </Link>
                            <Link
                                href="/TeamManager"
                                className="block text-white py-2 px-6 hover:bg-blue-700"
                            >
                                Team Manager
                            </Link>
                        </div>
                        
                        {/* Last item pushed to bottom */}
                        <Link
                            href="/Settings"
                            className="block text-white py-2 px-6 mt-auto hover:bg-gray-700"
                        >
                            <b>Settings</b>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;