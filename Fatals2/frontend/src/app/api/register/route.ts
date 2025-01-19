// src/app/api/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Sending registration request:', body);

    const response = await fetch('http://127.0.0.1:8000/api/register/', {
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
      // Include more detailed error information
      return NextResponse.json(
        { 
          error: data.message || data.detail || 'Registration failed',
          details: data
        },
        { status: response.status }
      );
    }

    // If successful, return the data including the token
    return NextResponse.json({
      message: data.message,
      token: data.token,
      username: data.username
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Registration failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}