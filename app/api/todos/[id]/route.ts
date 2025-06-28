import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db();
  await db.collection('todos').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
