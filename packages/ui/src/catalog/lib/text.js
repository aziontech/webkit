import { SCREEN_WORDS, STOPWORDS } from '../lexicon/query-words.js'

export function pascalCase(subpath) {
  const last = String(subpath).split('/').pop() || ''
  return last
    .split('-')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('')
}

export function sameVariant(a, b) {
  const key = (s) =>
    String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
  return Boolean(a) && key(a) === key(b)
}

export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[-_/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hasPhrase(haystack, phrase) {
  const h = ` ${haystack} `
  return h.includes(` ${phrase} `)
}

export const NORMALIZED_SCREEN_WORDS = SCREEN_WORDS.map(normalize)

export function longestMatches(q, candidates) {
  const hits = candidates.filter((c) => c.term && hasPhrase(q, c.term))
  return hits.filter(
    (h) =>
      !hits.some(
        (o) => o.key !== h.key && o.term.length > h.term.length && hasPhrase(o.term, h.term)
      )
  )
}

export function contentWords(q) {
  return q
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !NORMALIZED_SCREEN_WORDS.includes(w))
}

export function screenIntentOf(nq) {
  return SCREEN_WORDS.some((w) => hasPhrase(nq, normalize(w)))
}

export function firstSentence(text) {
  const s = String(text || '').trim()
  const m = s.match(/^[\s\S]*?[.!?](?=\s|$)/)
  return (m ? m[0] : s).trim()
}
