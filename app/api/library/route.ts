import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await db.promptEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, prompt, score, tags } = await req.json() as { title?: string; prompt?: string; score?: number; tags?: string[] }

  if (!prompt || !title) {
    return NextResponse.json({ error: 'Missing title or prompt' }, { status: 400 })
  }

  const entry = await db.promptEntry.create({
    data: {
      userId: session.user.id,
      title,
      prompt,
      tags: tags ?? [],
      notes: score != null ? `Score: ${score}` : null,
    },
  })

  return NextResponse.json({ entry }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const entry = await db.promptEntry.findUnique({ where: { id } })
  if (!entry || entry.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.promptEntry.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
