import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const targetUrl = `https://portlinkpy.vercel.app${url.pathname}${url.search}`

  return await fetch(targetUrl, {
    headers: request.headers,
    method: request.method,
  })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const targetUrl = `https://portlinkpy.vercel.app${url.pathname}${url.search}`

  return await fetch(targetUrl, {
    headers: request.headers,
    method: request.method,
    body: request.body,
  })
}

// Add similar functions for other HTTP methods you need (PUT, DELETE, etc.)