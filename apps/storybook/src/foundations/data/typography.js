/**
 * Foundations / Typography — data layer
 *
 * Static JS array mirroring the CSS values from semantic-texts-plugin.js.
 * Class name strings appear as literals so Tailwind's scanner includes them.
 */

// ─── Typography Tokens ────────────────────────────────────────────────────────

export const typographyTokens = [
  // ─── Headings ──────────────────────────────────────────────────────────────
  {
    name: 'text-heading-2xl',
    category: 'heading',
    label: 'Heading 2XL',
    description: 'Hero headlines, major section titles',
    desktop: { fontSize: '3.75rem', lineHeight: '1.2' },
    tablet:  { fontSize: '3rem',    lineHeight: '1.2' },
    mobile:  { fontSize: '1.875rem', lineHeight: '1.2' },
    fontFamily: 'Sora',
    sample: 'Hero Headline',
  },
  {
    name: 'text-heading-xl',
    category: 'heading',
    label: 'Heading XL',
    description: 'Page titles, primary headings',
    desktop: { fontSize: '2.25rem', lineHeight: '1.2' },
    tablet:  { fontSize: '1.875rem', lineHeight: '1.2' },
    mobile:  { fontSize: '1.25rem',  lineHeight: '1.2' },
    fontFamily: 'Sora',
    sample: 'Page Title',
  },
  {
    name: 'text-heading-lg',
    category: 'heading',
    label: 'Heading LG',
    description: 'Section headings, card titles',
    desktop: { fontSize: '1.875rem', lineHeight: '1.2' },
    tablet:  { fontSize: '1.125rem', lineHeight: '1.2' },
    mobile:  { fontSize: '1.125rem', lineHeight: '1.2' },
    fontFamily: 'Sora',
    sample: 'Section Heading',
  },
  {
    name: 'text-heading-md',
    category: 'heading',
    label: 'Heading MD',
    description: 'Subsection headings, modal titles',
    desktop: { fontSize: '1.5rem',   lineHeight: '1.2' },
    tablet:  { fontSize: '1.25rem',  lineHeight: '1.2' },
    mobile:  { fontSize: '1rem',     lineHeight: '1.2' },
    fontFamily: 'Sora',
    sample: 'Subsection Title',
  },
  {
    name: 'text-heading-sm',
    category: 'heading',
    label: 'Heading SM',
    description: 'Small headings, widget titles',
    desktop: { fontSize: '1.125rem', lineHeight: '1.2' },
    tablet:  { fontSize: '1rem',     lineHeight: '1.2' },
    mobile:  { fontSize: '0.875rem', lineHeight: '1.2' },
    fontFamily: 'Sora',
    sample: 'Widget Title',
  },

  // ─── Body ──────────────────────────────────────────────────────────────────
  {
    name: 'text-body-lg',
    category: 'body',
    label: 'Body LG',
    description: 'Lead paragraphs, prominent text',
    desktop: { fontSize: '18px', lineHeight: '1.5' },
    tablet:  { fontSize: '16px', lineHeight: '1.5' },
    mobile:  { fontSize: '16px', lineHeight: '1.5' },
    fontFamily: 'Sora',
    sample: 'Lead paragraph text for introductions and key content.',
  },
  {
    name: 'text-body-md',
    category: 'body',
    label: 'Body MD',
    description: 'Default body text, paragraphs',
    desktop: { fontSize: '16px', lineHeight: '1.5' },
    tablet:  { fontSize: '16px', lineHeight: '1.5' },
    mobile:  { fontSize: '16px', lineHeight: '1.5' },
    fontFamily: 'Sora',
    sample: 'Default body text for general content and descriptions.',
  },
  {
    name: 'text-body-sm',
    category: 'body',
    label: 'Body SM',
    description: 'Secondary text, captions, metadata',
    desktop: { fontSize: '14px', lineHeight: '1.5' },
    tablet:  { fontSize: '14px', lineHeight: '1.5' },
    mobile:  { fontSize: '14px', lineHeight: '1.5' },
    fontFamily: 'Sora',
    sample: 'Secondary text for supporting information.',
  },
  {
    name: 'text-body-xs',
    category: 'body',
    label: 'Body XS',
    description: 'Fine print, footnotes, tiny labels',
    desktop: { fontSize: '12px', lineHeight: '1.5' },
    tablet:  { fontSize: '12px', lineHeight: '1.5' },
    mobile:  { fontSize: '12px', lineHeight: '1.5' },
    fontFamily: 'Sora',
    sample: 'Fine print and footnotes.',
  },
  {
    name: 'text-body-xss',
    category: 'body',
    label: 'Body XSS',
    description: 'Micro text, minimal labels',
    desktop: { fontSize: '10px', lineHeight: '1.5' },
    tablet:  { fontSize: '10px', lineHeight: '1.5' },
    mobile:  { fontSize: '10px', lineHeight: '1.5' },
    fontFamily: 'Sora',
    sample: 'Micro text',
  },

  // ─── Overline ──────────────────────────────────────────────────────────────
  {
    name: 'text-overline-md',
    category: 'overline',
    label: 'Overline MD',
    description: 'Section labels, category tags',
    desktop: { fontSize: '14px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    tablet:  { fontSize: '14px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    mobile:  { fontSize: '14px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    fontFamily: 'Sora',
    sample: 'SECTION LABEL',
  },
  {
    name: 'text-overline-sm',
    category: 'overline',
    label: 'Overline SM',
    description: 'Small labels, badge text',
    desktop: { fontSize: '12px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    tablet:  { fontSize: '12px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    mobile:  { fontSize: '12px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    fontFamily: 'Sora',
    sample: 'SMALL LABEL',
  },
  {
    name: 'text-overline-xs',
    category: 'overline',
    label: 'Overline XS',
    description: 'Micro labels, tiny category tags',
    desktop: { fontSize: '10px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    tablet:  { fontSize: '10px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    mobile:  { fontSize: '10px', lineHeight: '1.4', letterSpacing: '0.08em', textTransform: 'uppercase' },
    fontFamily: 'Sora',
    sample: 'MICRO',
  },

  // ─── Special ───────────────────────────────────────────────────────────────
  {
    name: 'text-big-number-md',
    category: 'special',
    label: 'Big Number MD',
    description: 'Large statistics, hero numbers',
    desktop: { fontSize: '4.5rem', lineHeight: '1.2' },
    tablet:  { fontSize: '3rem',   lineHeight: '1.2' },
    mobile:  { fontSize: '4.5rem', lineHeight: '1.2' },
    fontFamily: 'Sora',
    sample: '42',
  },
];

// ─── Grouped for rendering ───────────────────────────────────────────────────

export const typographyGroups = [
  {
    category: 'heading',
    label: 'Headings',
    description: 'Page and section titles. Use semantically (h1–h6) with matching visual weight.',
    tokens: typographyTokens.filter((t) => t.category === 'heading'),
  },
  {
    category: 'body',
    label: 'Body',
    description: 'Paragraph and general content text. Choose size based on hierarchy and density.',
    tokens: typographyTokens.filter((t) => t.category === 'body'),
  },
  {
    category: 'overline',
    label: 'Overline',
    description: 'Uppercase labels for sections and categories. High letter-spacing for legibility.',
    tokens: typographyTokens.filter((t) => t.category === 'overline'),
  },
  {
    category: 'special',
    label: 'Special',
    description: 'Display numbers and decorative typography.',
    tokens: typographyTokens.filter((t) => t.category === 'special'),
  },
];
