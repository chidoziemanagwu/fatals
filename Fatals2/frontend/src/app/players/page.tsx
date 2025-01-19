'use client'

// src/app/players/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Players = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await fetch('/api/players/');
            const data = await response.json();
            setPlayers(data);
        };
        fetchPlayers();
    }, []);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Players</h1>
            <ul>
                {players.map((player) => (
                    <li key={player.id} className="border p-4 my-2">
                        <Link href={`/players/${player.id}`}>
                            {player.name} - {player.position} - Score: {player.score}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Players;