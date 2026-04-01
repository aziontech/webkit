/**
 * Foundations / Spacing — data layer
 *
 * Static JS array mirroring the CSS values from semantic-spacing-plugin.
 * Class name strings appear as literals so Tailwind's scanner includes them.
 */

// Tailwind spacing scale: 1 unit = 0.25rem = 4px
const toPx = (tailwindUnits) => `${tailwindUnits * 4}px`;

// ─── Spacing Tokens ───────────────────────────────────────────────────────────

export const spacingTokens = [
  // ─── Container ─────────────────────────────────────────────────────────────
  {
    name: 'max-container-width',
    category: 'container',
    label: 'Max Container Width',
    property: 'max-width',
    description: 'Maximum width for page content containers',
    desktop: '1280px',
    tablet: '1024px',
    mobile: '640px',
  },
  {
    name: 'px-container',
    category: 'container',
    label: 'Container Padding X',
    property: 'padding-left / padding-right',
    description: 'Horizontal padding for page containers',
    desktop: toPx(0),   // 0px
    tablet: toPx(10),  // 40px
    mobile: toPx(4),   // 16px
  },
  {
    name: 'py-container',
    category: 'container',
    label: 'Container Padding Y',
    property: 'padding-top / padding-bottom',
    description: 'Vertical padding for page containers',
    desktop: toPx(48), // 192px
    tablet: toPx(32),  // 128px
    mobile: toPx(16),  // 64px
  },

  // ─── Padding Elements ──────────────────────────────────────────────────────
  {
    name: 'p-elements-confortable',
    category: 'padding',
    label: 'Padding Comfortable',
    property: 'padding',
    description: 'Spacious padding for cards and panels',
    desktop: toPx(24), // 96px
    tablet: toPx(16),  // 64px
    mobile: toPx(8),   // 32px
  },
  {
    name: 'p-elements-base',
    category: 'padding',
    label: 'Padding Base',
    property: 'padding',
    description: 'Default padding for UI elements',
    desktop: toPx(12), // 48px
    tablet: toPx(8),   // 32px
    mobile: toPx(6),   // 24px
  },
  {
    name: 'p-elements-compact',
    category: 'padding',
    label: 'Padding Compact',
    property: 'padding',
    description: 'Tight padding for dense layouts',
    desktop: toPx(6),  // 24px
    tablet: toPx(5),   // 20px
    mobile: toPx(4),   // 16px
  },

  // ─── Gap Elements ──────────────────────────────────────────────────────────
  {
    name: 'gap-elements-confortable',
    category: 'gap',
    label: 'Gap Comfortable',
    property: 'gap',
    description: 'Spacious gap between child elements',
    desktop: toPx(24), // 96px
    tablet: toPx(16),  // 64px
    mobile: toPx(8),   // 32px
  },
  {
    name: 'gap-elements-base',
    category: 'gap',
    label: 'Gap Base',
    property: 'gap',
    description: 'Default gap between child elements',
    desktop: toPx(12), // 48px
    tablet: toPx(8),   // 32px
    mobile: toPx(6),   // 24px
  },
  {
    name: 'gap-elements-compact',
    category: 'gap',
    label: 'Gap Compact',
    property: 'gap',
    description: 'Tight gap for dense layouts',
    desktop: toPx(6),  // 24px
    tablet: toPx(6),   // 24px
    mobile: toPx(4),   // 16px
  },

  // ─── Gap Sections ──────────────────────────────────────────────────────────
  {
    name: 'gap-sections',
    category: 'gap',
    label: 'Gap Sections',
    property: 'gap',
    description: 'Large gap between major page sections',
    desktop: toPx(48), // 192px
    tablet: toPx(40),  // 160px
    mobile: toPx(20),  // 80px
  },
];

// ─── Grouped for rendering ───────────────────────────────────────────────────

export const spacingGroups = [
  {
    category: 'container',
    label: 'Container',
    description: 'Page-level container constraints and padding.',
    tokens: spacingTokens.filter((t) => t.category === 'container'),
  },
  {
    category: 'padding',
    label: 'Element Padding',
    description: 'Internal padding for cards, panels, and UI elements.',
    tokens: spacingTokens.filter((t) => t.category === 'padding'),
  },
  {
    category: 'gap',
    label: 'Gap',
    description: 'Spacing between child elements in flex/grid containers.',
    tokens: spacingTokens.filter((t) => t.category === 'gap'),
  },
];
