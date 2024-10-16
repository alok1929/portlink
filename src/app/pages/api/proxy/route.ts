import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const targetUrl = `https://portlinkpy.vercel.app${url.pathname}${url.search}`

  const response = await fetch(targetUrl, {
    headers: request.headers,
    method: request.method,
  })

  return NextResponse.json(await response.json())
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const targetUrl = `https://portlinkpy.vercel.app${url.pathname}${url.search}`

  const response = await fetch(targetUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
  })

  return NextResponse.json(await response.json())
}

// Add similar functions for other HTTP methods you need (PUT, DELETE, etc.)