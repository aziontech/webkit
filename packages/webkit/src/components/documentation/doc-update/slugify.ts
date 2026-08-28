/**
 * Turn an entry's visible label into a stable anchor id.
 *
 * A typed port of the retired MDX layer's slugifier, kept identical in
 * behaviour so ids already shared in links keep resolving: inline markup is
 * stripped first (backtick code spans, double-asterisk emphasis, markdown
 * links), then the text is lowercased and kebab-cased.
 *
 * @param text - the label's visible text, possibly carrying inline markup.
 * @returns a kebab-case slug.
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
