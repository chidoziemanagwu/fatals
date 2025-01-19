"use client"
// src/app/players/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PlayerProfile = () => {
    const router = useRouter();
    const { id } = router.query;
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchPlayer = async () => {
                const response = await fetch(`/api/players/${id}/`);
                const data = await response.json();
                setPlayer(data);
            };
            fetchPlayer();
        }
    }, [id]);

    if (!player) return <div>Loading...</div>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">{player.name}</h1>
            <p>Position: {player.position}</p>
            <p>Score: {player.score}</p>
            {/* Add more player details as needed */}
        </div>
    );
};

export default PlayerProfile;