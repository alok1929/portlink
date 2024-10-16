import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    // Proxy the request to Flask backend
    const response = await fetch('https://portlinkpy.vercel.app/create-vercel-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Vercel project:', error);
    return NextResponse.json({ error: 'Failed to create Vercel project' }, { status: 500 });
  }
}