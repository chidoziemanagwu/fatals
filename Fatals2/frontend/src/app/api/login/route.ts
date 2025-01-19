// src/app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Sending login request:', body);

    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: data.message || data.detail || 'Login failed',
          details: data
        },
        { status: response.status }
      );
    }

    // If successful, return the data including the token
    return NextResponse.json({
      message: data.message,
      token: data.token,
      username: data.username // Ensure this is included
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Login failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}