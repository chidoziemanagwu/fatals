"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Table, Pagination } from "flowbite-react";
import Header from "@/components/Header";
import FilterPopup from "@/components/FilterPopup"; // Import the FilterPopup component
import Head from "next/head"; // Import Head from next/head

interface Player {
    rank: number;
    tier: number;
    position: string;
    name: string;
    fas: number;
    posRank: number;
    adp: number;
}

const Analytics = () => {
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
        <div className="flex flex-col min-h-screen bg-customBlue ">
            <Head>
                <title>Draft Cheat Sheet - Fatals Fantasy Baseball App</title>
                <meta name="description" content="Draft Cheat Sheet - Fatals Fantasy Baseball App" />
            </Head>
            <div className="container mx-auto pb-0 pt-6 flex-grow">
                {user && (
                    <>
                        <Header />
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold">Welcome, {user.username}</h2>
                                    <p className="text-sm text-gray-600">
                                        Last Login: {new Date(user.lastLogin || "").toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-4">
                                2024 Draft Cheat Sheet
                            </h1>
                            <div className="mb-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search players..."
                                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    onClick={() => setIsFilterPopupOpen(true)} // Open the filter popup
                                    className="ml-2 bg-customGreen text-white px-4 py-2 rounded-lg"
                                >
                                    Filter
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto shadow-md mb-4 text-2xl">
                            <Table hoverable className="text-2xl">
                                <Table.Head className="bg-gray-100">
                                    {[
                                        { key: "rank", label: "Rank" },
                                        { key: "tier", label: "Tier" },
                                        { key: "position", label: "POS" },
                                        { key: "name", label: "Name" },
                                        { key: "fas", label: "FAS" },
                                        { key: "posRank", label: "Pos. Rank" },
                                        { key: "adp", label: "ADP" },
                                    ].map((column) => (
                                        <Table.HeadCell
                                            key={column.key}
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort(column.key as keyof Player)}
                                        >
                                            <div className="flex items-center">
                                                {column.label}
                                                {sortConfig.key === column.key && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === "ascending"
                                                            ? "↑"
                                                            : "↓"}
                                                    </span>
                                                )}
                                            </div>
                                        </Table.HeadCell>
                                    ))}
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {currentRecords.map((player) => (
                                        <Table.Row
                                            key={player.rank}
                                            className="bg-white hover:bg-gray-50"
                                        >
                                            <Table.Cell>{player.rank}</Table.Cell>
                                            <Table.Cell>{player.tier}</Table.Cell>
                                            <Table.Cell>{player.position}</Table.Cell>
                                            <Table.Cell className="font-medium text-gray-900">
                                                {player.name}
                                            </Table.Cell>
                                            <Table.Cell>{player.fas.toFixed(1)}</Table.Cell>
                                            <Table.Cell>{player.posRank}</Table.Cell>
                                            <Table.Cell>{player.adp}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>

                        <div className="flex items-center justify-center text-center my-8">
                            <div className="inline-flex items-center gap-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil(filteredPlayers.length / recordsPerPage)}
                                    onPageChange={setCurrentPage}
                                    layout="pagination"
                                    theme={{
                                        base: "flex text-gray-700 gap-2",
                                        pages: {
                                            base: "xs:mt-0 mt-2 inline-flex items-center gap-2",
                                            showIcon: "inline-flex h-10 w-10 items-center justify-center rounded-lg",
                                            previous: {
                                                base: "mr-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-white ",
                                            },
                                            next: {
                                                base: "ml-3 inline-flex h-10 w-10 items-center justify-center rounded-lg  text-white ",
                                            },
                                            selector: {
                                                base: "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                                                active: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white border-blue-500",
                                            },
                                        },
                                    }}
                                />
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

export default Analytics;