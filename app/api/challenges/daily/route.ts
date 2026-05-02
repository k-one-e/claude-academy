import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find a challenge from the start of the current day (UTC)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  // For demo: return the first available challenge
  const challenge = await db.challenge.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (!challenge) {
    return NextResponse.json({ error: 'No challenge available today' }, { status: 404 })
  }

  return NextResponse.json({ challenge })
}
