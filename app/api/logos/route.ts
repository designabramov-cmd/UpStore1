// app/api/logos/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logosDir = path.join(process.cwd(), 'public', 'src', 'logoanim');
    
    try {
      const files = await fs.readdir(logosDir);
      const logos = files
        .filter((file) => /\.(png|jpg|jpeg|svg|webp)$/i.test(file))
        .map((file) => `/src/logoanim/${file}`);
      
      return NextResponse.json(logos);
    } catch {
      // Directory doesn't exist
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching logos:', error);
    return NextResponse.json({ error: 'Failed to fetch logos' }, { status: 500 });
  }
}
