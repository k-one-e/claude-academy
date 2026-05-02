export type ScoreBreakdown = {
  completeness: number
  clarity: number
  context: number
  structure: number
  efficiency: number
}

export type ScoreResult = {
  total: number
  breakdown: ScoreBreakdown
  feedback: string[]
  suggestions: string[]
  creativity: number
}

type Challenge = {
  id: string
  rubric: Record<string, string>
  hints?: string[]
}

const VAGUE_WORDS = ['thing', 'stuff', 'something', 'it', 'this', 'that', 'fix', 'help', 'do', 'make']
const CONTEXT_MARKERS = ["i'm", "i am", "we're", "building", "working on", "using", "stack", "version", "tried", "already", "but"]
const STRUCTURE_MARKERS = {
  role: ['you are', 'act as', 'as a', 'as an', 'expert', 'senior', 'specialist'],
  constraints: ['only', 'don\'t', 'avoid', 'must', 'require', 'constraint', 'limit', 'focus on'],
  format: ['list', 'table', 'step', 'numbered', 'bullet', 'json', 'markdown', 'format', 'structure', 'return'],
}

function scoreCompleteness(prompt: string, _challenge: Challenge): number {
  const wordCount = prompt.trim().split(/\s+/).length
  if (wordCount < 5) return 0
  if (wordCount < 15) return 5
  if (wordCount < 30) return 10
  if (wordCount < 60) return 15
  return 20
}

function scoreClarity(prompt: string): number {
  const lower = prompt.toLowerCase()
  const vagueCount = VAGUE_WORDS.filter((w) => {
    const regex = new RegExp(`\\b${w}\\b`, 'g')
    return (lower.match(regex) ?? []).length > 0
  }).length

  const questionMarks = (prompt.match(/\?/g) ?? []).length
  const specificity = prompt.length > 100 ? 5 : 0

  const base = 20
  const penalty = vagueCount * 3
  const bonus = questionMarks > 0 ? 3 : 0
  return Math.max(0, Math.min(20, base - penalty + bonus + specificity))
}

function scoreContext(prompt: string): number {
  const lower = prompt.toLowerCase()
  const found = CONTEXT_MARKERS.filter((m) => lower.includes(m)).length
  if (found === 0) return 0
  if (found === 1) return 6
  if (found === 2) return 12
  if (found === 3) return 16
  return 20
}

function scoreStructure(prompt: string): number {
  const lower = prompt.toLowerCase()
  let score = 0

  for (const [_category, markers] of Object.entries(STRUCTURE_MARKERS)) {
    if (markers.some((m) => lower.includes(m))) {
      score += 6
    }
  }

  const hasNewlines = prompt.includes('\n')
  if (hasNewlines) score += 2

  return Math.min(20, score)
}

function scoreEfficiency(prompt: string): number {
  const wordCount = prompt.trim().split(/\s+/).length
  const filler = ['please', 'kindly', 'just', 'basically', 'literally', 'actually']
  const fillerCount = filler.filter((f) => prompt.toLowerCase().includes(f)).length

  if (wordCount > 300) return 8
  if (wordCount < 10) return 5
  return Math.max(0, 20 - fillerCount * 3)
}

function generateFeedback(breakdown: ScoreBreakdown): string[] {
  const messages: string[] = []

  if (breakdown.context < 10) {
    messages.push('Add more context: who you are, what you\'re building, what you\'ve already tried.')
  }
  if (breakdown.structure < 8) {
    messages.push('Use the RCTCF framework: add a Role, clarify Constraints, and specify the Format you want.')
  }
  if (breakdown.clarity < 10) {
    messages.push('Avoid vague words. Be specific about what "good" looks like for you.')
  }
  if (breakdown.completeness < 12) {
    messages.push('Expand your prompt — give Claude more to work with.')
  }
  if (breakdown.efficiency < 12) {
    messages.push('Cut filler words. Every sentence should carry information.')
  }

  if (messages.length === 0) {
    messages.push('Great prompt! Clear, contextual, and well-structured.')
  }

  return messages
}

function generateSuggestions(breakdown: ScoreBreakdown, _challenge: Challenge): string[] {
  const suggestions: string[] = []

  if (breakdown.structure < 10) {
    suggestions.push('Try starting with: "You are a [role]..." to set Claude\'s perspective.')
  }
  if (breakdown.context < 12) {
    suggestions.push('Add: what tech stack or domain you\'re in, and what you\'ve already tried.')
  }
  if (breakdown.clarity < 12) {
    suggestions.push('End your prompt with specific success criteria: "A good answer will..."')
  }
  if (breakdown.efficiency < 12) {
    suggestions.push('Remove padding. Start with the most important information, not pleasantries.')
  }

  return suggestions
}

export function scorePrompt(prompt: string, challenge: Challenge): ScoreResult {
  const breakdown: ScoreBreakdown = {
    completeness: scoreCompleteness(prompt, challenge),
    clarity: scoreClarity(prompt),
    context: scoreContext(prompt),
    structure: scoreStructure(prompt),
    efficiency: scoreEfficiency(prompt),
  }

  const base = Object.values(breakdown).reduce((sum, s) => sum + s, 0)
  const creativity = base > 90 ? 15 : base > 75 ? 8 : 0
  const total = Math.min(125, base + creativity)

  return {
    total,
    breakdown,
    feedback: generateFeedback(breakdown),
    suggestions: generateSuggestions(breakdown, challenge),
    creativity,
  }
}

export function checkRCTCF(prompt: string) {
  const lower = prompt.toLowerCase()
  return {
    role: STRUCTURE_MARKERS.role.some((m) => lower.includes(m)),
    context: CONTEXT_MARKERS.some((m) => lower.includes(m)),
    task: prompt.trim().length > 20,
    constraints: STRUCTURE_MARKERS.constraints.some((m) => lower.includes(m)),
    format: STRUCTURE_MARKERS.format.some((m) => lower.includes(m)),
  }
}
