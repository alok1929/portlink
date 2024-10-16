import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  // Proxy the file upload to Flask backend
  const response = await fetch('https://portlinkpy.vercel.app/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return NextResponse.json(data);
}

export const config = {
  api: {
    bodyParser: false,  // Ensure Next.js doesn't parse the body
  },
};
