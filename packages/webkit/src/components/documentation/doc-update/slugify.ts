/**
 * Turn a visible label into a stable anchor id. Behaviour-identical port of the
 * retired MDX layer's slugifier, so ids already shared in links keep resolving:
 * inline markup is stripped, then the text is lowercased and kebab-cased.
 */
export const slugify = (text: string): string =>
  String(text)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
