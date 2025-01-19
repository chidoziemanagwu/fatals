// src/app/api/players/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    const response = await fetch('http://localhost:8000/api/players/');
    const players = await response.json();
    return NextResponse.json(players);
}