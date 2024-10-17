
// app/api/create-vercel-project/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-vercel-project`, {
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to create Vercel project';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}