
// app/api/create-vercel-project/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const response = await fetch('https://portlinkpy.vercel.app/api/create-vercel-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Vercel project:', error);
    return NextResponse.json({ error: error.message || 'Failed to create Vercel project' }, { status: 500 });
  }
}