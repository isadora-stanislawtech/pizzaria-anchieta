import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, data } = body || {};
    if (!filename || !data) return NextResponse.json({ error: 'filename and data required' }, { status: 400 });

    // data may be a data URL (data:...;base64,AAA) or raw base64
    const matches = String(data).match(/^data:(.+);base64,(.+)$/);
    const base64 = matches ? matches[2] : String(data);
    const buffer = Buffer.from(base64, 'base64');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const safeName = `${Date.now()}-${String(filename).replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${safeName}` });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
