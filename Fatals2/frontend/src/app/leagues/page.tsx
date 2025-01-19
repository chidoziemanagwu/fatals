// src/app/leagues/page.tsx
"use client"; // Add this line

import { useEffect, useState } from 'react';
import { League } from '../../types/League'; // Adjust the import path as necessary

const Leagues = () => {
    const [leagues, setLeagues] = useState<League[]>([]); // Specify the type here

    useEffect(() => {
        const fetchLeagues = async () => {
            const response = await fetch('/api/leagues/');
            const data = await response.json();
            setLeagues(data); // Ensure the data matches the League type
        };

        fetchLeagues();
    }, []);

    return (
        <div>
            <h1>Leagues</h1>
            <ul>
                {leagues.map((league) => (
                    <li key={league.id} className="border p-4 my-2">
                        {league.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leagues;