import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const progress = await db.progress.findMany({
    where: { userId: session.user.id },
    include: { lesson: true },
    orderBy: { completedAt: 'desc' },
  })

  return NextResponse.json({ progress })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { lessonSlug, score } = await req.json() as { lessonSlug?: string; score?: number }
  if (!lessonSlug) {
    return NextResponse.json({ error: 'Missing lessonSlug' }, { status: 400 })
  }

  const lesson = await db.lesson.findUnique({ where: { slug: lessonSlug } })
  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
  }

  const entry = await db.progress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    update: { score: score ?? null, completedAt: new Date() },
    create: { userId: session.user.id, lessonId: lesson.id, score: score ?? null, completedAt: new Date() },
  })

  // Award default XP for lesson completion
  await db.user.update({
    where: { id: session.user.id },
    data: { xp: { increment: 50 } },
  })

  return NextResponse.json({ progress: entry })
}
