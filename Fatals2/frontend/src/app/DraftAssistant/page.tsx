"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import FilterPopup from "@/components/FilterPopup"; // Import the FilterPopup component

interface Player {
    rank: number;
    tier: number;
    position: string;
    name: string;
    fas: number;
    posRank: number;
    adp: number;
}

const Modal = ({ player, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="bg-black text-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">{player.name}</h3>
                <div className="flex flex-col">
                    <button className="mb-2 p-2 bg-green-500 rounded" onClick={() => { /* Handle Mark as Taken */ onClose(); }}>
                        Mark as taken
                    </button>
                    <button className="mb-2 p-2 bg-blue-500 rounded" onClick={() => { /* Handle Draft */ onClose(); }}>
                        Draft
                    </button>
                    <button className="p-2 bg-red-500 rounded" onClick={() => { /* Handle Remove from Draft List */ onClose(); }}>
                        Remove from draft list
                    </button>
                </div>
                <button className="mt-4 p-2 bg-gray-500 rounded" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

const DraftAssistant = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Player | null;
        direction: "ascending" | "descending";
    }>({ key: null, direction: "ascending" });
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false); // State for the filter popup
    const [filters, setFilters] = useState<{ category: string; position: string }>({ category: "all", position: "" }); // State for filters
    const [modalPlayer, setModalPlayer] = useState<Player | null>(null); // State for the modal player
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    const recordsPerPage = 10;

    useEffect(() => {
        const fetchPlayers = async () => {
            if (!isAuthenticated) {
                router.push("/login");
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(
                    "https://statsapi.mlb.com/api/v1/sports/1/players"
                );
                const data = await response.json();

                const transformedData: Player[] = data.people
                    .map((player: any, index: number) => ({
                        rank: index + 1,
                        tier: Math.floor(index / 5) + 1,
                        position: player.primaryPosition.abbreviation,
                        name: `${player.firstName} ${player.lastName}`,
                        fas: Math.random() * 1000,
                        posRank: Math.floor(Math.random() * 20) + 1,
                        adp: Math.floor(Math.random() * 300) + 1,
                    }))
                    .slice(0, 100);

                setPlayers(transformedData);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch players:", error);
                setIsLoading(false);
            }
        };

        fetchPlayers();
        console.log(user);
    }, [isAuthenticated, router]);

    const handleSort = (key: keyof Player) => {
        const direction =
            sortConfig.key === key && sortConfig.direction === "ascending"
                ? "descending"
                : "ascending";

        setSortConfig({ key, direction });

        const sortedPlayers = [...players].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });

        setPlayers(sortedPlayers);
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    // Apply filters based on selected criteria
    const filteredPlayers = players.filter((player) => {
        const matchesSearchTerm =
            player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.position.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            filters.category === "all" ||
            (filters.category === "hitters" && player.position !== "SP") || // Assuming SP is for pitchers
            (filters.category === "pitchers" && player.position === "SP");

        const matchesPosition =
            !filters.position || player.position === filters.position;

        return matchesSearchTerm && matchesCategory && matchesPosition;
    });

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredPlayers.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );

    const handlePlayerClick = (player: Player) => {
        setModalPlayer(player);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalPlayer(null);
    };

    if (!isAuthenticated) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-customBlue text-green-400">
            <div className="container mx-auto pb-0 pt-6 flex-grow">
                {user && (
                    <>
                        <Header />
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-black p-4 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Your Players</h3>
                                <div className="overflow-y-auto h-96">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="text-green-400">POS</th>
                                                <th className="text-green-400">Your Players</th>
                                                <th className="text-green-400">Ovr. Rank</th>
                                                <th className="text-green-400">Pos. Rank</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.map((player) => (
                                                <tr key={player.rank}>
                                                    <td>{player.position}</td>
                                                    <td>{player.name}</td>
                                                    <td>{player.rank}</td>
                                                    <td>{player.posRank}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-black p-4 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Best Available Hitters</h3>
                                <div className="overflow-y-auto h-96">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="text-green-400">POS</th>
                                                <th className="text-green-400">Name</th>
                                                <th className="text-green-400">Tier</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players
                                                .filter(player => player.position !== "SP") // Filter for hitters
                                                .map(player => (
                                                    <tr key={player.rank} onClick={() => handlePlayerClick(player)} className="cursor-pointer hover:bg-gray-700">
                                                        <td>{player.position}</td>
                                                        <td>{player.name}</td>
                                                        <td>{player.tier}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-black p-4 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-2">Best Available Pitchers</h3>
                                <div className="overflow-y-auto h-96">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="text-green-400">POS</th>
                                                <th className="text-green-400">Name</th>
                                                <th className="text-green-400">Tier</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players
                                                .filter(player => player.position === "SP") // Filter for pitchers
                                                .map(player => (
                                                    <tr key={player.rank}>
                                                        <td>{player.position}</td>
                                                        <td>{player.name}</td>
                                                        <td>{player.tier}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black p-4 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Best Available By Position</h3>
                            <div className="overflow-y-auto h-96">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="text-green-400">Tier</th>
                                            <th className="text-green-400">Name</th>
                                            <th className="text-green-400">FAS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.map(player => (
                                            <tr key={player.rank}>
                                                <td>{player.tier}</td>
                                                <td>{player.name}</td>
                                                <td>{player.fas.toFixed(1)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {isModalOpen && modalPlayer && (
                            <Modal player={modalPlayer} onClose={closeModal} />
                        )}

                        <div className="flex items-center justify-center text-center my-8">
                            <div className="inline-flex items-center gap-4">
                                {/* Pagination can be added here if needed */}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Render the FilterPopup component */}
            <FilterPopup isOpen={isFilterPopupOpen} onClose={(filters) => {
                setFilters(filters);
                setIsFilterPopupOpen(false);
            }} />
        </div>
    );
};

export default DraftAssistant;