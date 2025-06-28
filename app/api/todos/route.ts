import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET /api/todos - List all todos
export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const todos = await db.collection('todos').find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json(todos);
}

// POST /api/todos - Add a new todo
export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid todo' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('todos').insertOne({ text, createdAt: new Date() });
  return NextResponse.json({ _id: result.insertedId, text });
}
