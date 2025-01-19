// src/app/api/leagues/route.ts
import { NextResponse } from 'next/server';

const fetchLeagues = async () => {
    return [
        { id: 1, name: "League One" },
        { id: 2, name: "League Two" },
    ];
};

export async function GET() {
    try {
        const leagues = await fetchLeagues();
        return NextResponse.json(leagues);
    } catch (error) {
        console.error("Error fetching leagues:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}