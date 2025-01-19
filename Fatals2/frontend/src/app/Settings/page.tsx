"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header"; // Assuming you have a Header component

const SettingsPage = () => {
    const router = useRouter();

    // State for ranking weights
    const [rankingWeights, setRankingWeights] = useState({
        hitters: {
            runsScored: 1,
            homeRuns: 2,
            hits: 1,
            stolenBases: 1,
            walks: 1,
            rbi: 1,
            soMinus: 1,
        },
        pitchers: {
            saves: 6,
            wins: 5,
            so: 1,
            ip: 3,
            hitsMinus: 1,
        },
    });

    // Handle input change
    const handleChange = (category, stat, value) => {
        setRankingWeights((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [stat]: value,
            },
        }));
    };

    // Reset to default values
    const resetDraft = () => {
        setRankingWeights({
            hitters: {
                runsScored: 1,
                homeRuns: 2,
                hits: 1,
                stolenBases: 1,
                walks: 1,
                rbi: 1,
                soMinus: 1,
            },
            pitchers: {
                saves: 6,
                wins: 5,
                so: 1,
                ip: 3,
                hitsMinus: 1,
            },
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-green-400">
            <Header />
            <div className="container mx-auto pt-6 flex-grow">
                <h1 className="text-4xl font-bold mb-4">Fantasy Baseball</h1>
                <h2 className="text-2xl mb-4">2024 Draft Cheat Sheet</h2>
                <h2 className="text-2xl mb-4">Settings</h2>
                <h3 className="text-xl font-bold mb-2">Ranking Weights</h3>
                <p className="mb-4">Start with your league scoring then adjust to your liking</p>

                <div className="mb-6">
                    <h4 className="text-lg font-bold">Hitters</h4>
                    {Object.entries(rankingWeights.hitters).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between mb-2">
                            <label className="flex-1">{stat.replace(/([A-Z])/g, ' \$1')}</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => handleChange("hitters", stat, parseInt(e.target.value))}
                                className="bg-gray-800 text-white border border-yellow-500 rounded p-1 w-16 text-center"
                            />
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <h4 className="text-lg font-bold">Pitchers</h4>
                    {Object.entries(rankingWeights.pitchers).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between mb-2">
                            <label className="flex-1">{stat.replace(/([A-Z])/g, ' \$1')}</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => handleChange("pitchers", stat, parseInt(e.target.value))}
                                className="bg-gray-800 text-white border border-yellow-500 rounded p-1 w-16 text-center"
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={resetDraft}
                    className="bg-green-500 text-black px-4 py-2 rounded-lg mb-4"
                >
                    RESET DRAFT
                </button>
                <button
                    onClick={() => router.push('/')} // Navigate back to the main page or wherever appropriate
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
                >
                    Back
                </button>
            </div>

            <footer className="bg-black text-center text-white py-2">
                Copyright © 2024 - Fatals Fantasy Sports
            </footer>
        </div>
    );
};

export default SettingsPage;