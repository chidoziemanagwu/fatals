"use client"
// src/app/leagues/[id]/rankings/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const LeagueRankings = () => {
    const router = useRouter();
    const { id } = router.query;
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        if (id) {
            const fetchRankings = async () => {
                const response = await fetch(`/api/leagues/${id}/rankings/`);
                const data = await response.json();
                setRankings(data.rankings);
            };
            fetchRankings();
        }
    }, [id]);

    if (!rankings.length) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">League Rankings</h1>
            <ul>
                {rankings.map((player, index) => (
                    <li key={index} className="border p-4 my-2">
                        {index + 1}. {player}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeagueRankings;