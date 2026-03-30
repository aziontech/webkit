import PrimitiveScale   from '../../foundations/components/PrimitiveScale.vue';
import TokenTable       from '../../foundations/components/TokenTable.vue';
import ColorPlayground  from '../../foundations/components/ColorPlayground.vue';

import {
  primitiveColors,
  backgroundTokens,
  textTokens,
  borderTokens,
} from '../../foundations/data/colors.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Colors',
  parameters: {
    options:    { showPanel: false },
    controls:   { disable: true },
    actions:    { disable: true },
    docs: {
      description: {
        component: [
          'Color system documentation — semantic token architecture for Azion Design System.',
          'All tokens are resolved from `@aziontech/theme/tokens` and adapt automatically to light/dark mode.',
        ].join(' '),
      },
    },
  },
};

// ─── Overview ─────────────────────────────────────────────────────────────────

export const Overview = {
  name: 'Overview',
  render: () => ({
    template: /* html */ `
      <div style="font-family: Sora, sans-serif; max-width: 900px; padding: 40px 0;">

        <!-- Header -->
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Foundations</p>
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Color System</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion color system is a <strong style="color: var(--text-default)">layered token architecture</strong>.
          Raw hex values are never used in components — instead, semantic tokens are referenced, which
          resolve automatically for both light and dark mode via CSS variables.
        </p>

        <!-- Architecture diagram -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Token Architecture</h2>
        <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0; align-items: center; margin-bottom: 48px;">

          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-default); border-radius: 10px; padding: 20px 22px;">
            <p class="text-overline-xs text-muted" style="margin: 0 0 6px;">Layer 1</p>
            <p class="text-body-sm text-default" style="font-weight: 600; margin: 0 0 6px;">Primitive Colors</p>
            <p class="text-body-xs text-muted" style="margin: 0 0 12px; line-height: 1.6;">
              Raw palette values. 9 color families × 11 shades each.
            </p>
            <code style="font-family: 'Roboto Mono', monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.04); padding: 3px 7px; border-radius: 4px;">
              primitives.brand.500
            </code>
          </div>

          <div style="padding: 0 14px; color: var(--text-muted); font-size: 20px; user-select: none;">→</div>

          <div style="background: rgba(254,96,31,0.05); border: 1px solid var(--border-primary); border-radius: 10px; padding: 20px 22px;">
            <p class="text-overline-xs text-muted" style="margin: 0 0 6px;">Layer 2</p>
            <p class="text-body-sm text-default" style="font-weight: 600; margin: 0 0 6px;">Semantic Tokens</p>
            <p class="text-body-xs text-muted" style="margin: 0 0 12px; line-height: 1.6;">
              Intent-based roles with automatic light/dark resolution.
            </p>
            <code style="font-family: 'Roboto Mono', monospace; font-size: 11px; color: var(--text-primary); background: rgba(254,96,31,0.08); padding: 3px 7px; border-radius: 4px;">
              text-primary
            </code>
          </div>

          <div style="padding: 0 14px; color: var(--text-muted); font-size: 20px; user-select: none;">→</div>

          <div style="background: rgba(138,132,236,0.05); border: 1px solid var(--border-accent); border-radius: 10px; padding: 20px 22px;">
            <p class="text-overline-xs text-muted" style="margin: 0 0 6px;">Layer 3</p>
            <p class="text-body-sm text-default" style="font-weight: 600; margin: 0 0 6px;">Specific Tokens</p>
            <p class="text-body-xs text-muted" style="margin: 0 0 12px; line-height: 1.6;">
              Class names for specific components.
            </p>
            <code style="font-family: 'Roboto Mono', monospace; font-size: 11px; color: var(--text-accent); background: rgba(138,132,236,0.08); padding: 3px 7px; border-radius: 4px;">
              text-button-primary
            </code>
          </div>
        </div>

        <!-- Category summary -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Semantic Categories</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 48px;">
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Background</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">13 tokens</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Surface hierarchy, canvas, status fills, and brand-colored backgrounds.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              bg-surface · bg-canvas · bg-primary
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Text</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">15 tokens</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Default, muted, link, code, status, brand, and interactive text roles.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              text-default · text-muted · text-danger
            </p>
          </div>
          <div style="padding: 20px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Border</p>
            <p class="text-heading-md text-default" style="margin: 0 0 8px;">13 tokens</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Default, subtle, strong, status-based, and brand-colored borders.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              border-default · border-subtle · border-danger
            </p>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Architecture overview: primitive → semantic → Tailwind layers.' },
    },
  },
};

// ─── Primitive Colors ─────────────────────────────────────────────────────────

export const Primitives = {
  name: 'Primitive Colors',
  render: () => ({
    components: { PrimitiveScale },
    setup() { return { primitiveColors }; },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Primitives</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Primitive Color Palette</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 10px; line-height: 1.7;">
          Raw color scales. These are the base values that power the semantic layer.
        </p>
        <div
          style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 6px;
                 border: 1px solid var(--border-warning); background: rgba(202,138,4,0.06); margin-bottom: 36px;"
        >
          <i class="pi pi-exclamation-triangle" style="color: var(--text-warning); font-size: 12px;"></i>
          <span class="text-body-xs text-warning">
            Do not reference primitives directly in components. Always use semantic tokens.
          </span>
        </div>
        <div style="display: flex; flex-direction: column;">
          <PrimitiveScale v-for="family in primitiveColors" :key="family.name" :family="family" />
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Raw primitive color scales — 9 families × 11 shades. Do not use directly in components.' },
    },
  },
};

// ─── Background Tokens ────────────────────────────────────────────────────────

export const Backgrounds = {
  name: 'Backgrounds',
  render: () => ({
    components: { TokenTable },
    setup() { return { backgroundTokens }; },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Semantic / Background</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Background Tokens</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 32px; line-height: 1.7;">
          Background tokens define surface hierarchy, status fills, and brand-colored backgrounds.
          Use <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">bg-surface</code> for cards and panels,
          <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">bg-canvas</code> for the page background.
        </p>

        <!-- Quick examples -->
        <div style="display: flex; gap: 10px; margin-bottom: 32px; flex-wrap: wrap;">
          <div style="padding: 16px 20px; border-radius: 8px; background: var(--background-canvas); border: 1px solid var(--border-default);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">bg-canvas</p>
            <p class="text-body-xs text-default" style="margin: 0;">Page background</p>
          </div>
          <div style="padding: 16px 20px; border-radius: 8px; background: var(--background-surface); border: 1px solid var(--border-default);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">bg-surface</p>
            <p class="text-body-xs text-default" style="margin: 0;">Cards / panels</p>
          </div>
          <div style="padding: 16px 20px; border-radius: 8px; background: var(--background-surfaceRaised); border: 1px solid var(--border-default);">
            <p class="text-overline-xs text-muted" style="margin: 0 0 4px;">bg-surfaceRaised</p>
            <p class="text-body-xs text-default" style="margin: 0;">Modals / dropdowns</p>
          </div>
          <div style="padding: 16px 20px; border-radius: 8px; background: var(--background-primary);">
            <p class="text-overline-xs" style="margin: 0 0 4px; color: rgba(255,255,255,0.7);">bg-primary</p>
            <p class="text-body-xs" style="margin: 0; color: #fff;">Brand CTA</p>
          </div>
        </div>

        <TokenTable :tokens="backgroundTokens" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Semantic background tokens for surfaces, status states, and brand fills.' },
    },
  },
};

// ─── Text Colors ──────────────────────────────────────────────────────────────

export const TextColors = {
  name: 'Text Colors',
  render: () => ({
    components: { TokenTable },
    setup() { return { textTokens }; },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Semantic / Text</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Text Color Tokens</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 32px; line-height: 1.7;">
          Text tokens define intent-based roles for all typography in the product.
          Use <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">text-default</code> for primary content
          and <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">text-muted</code> for supporting copy.
        </p>

        <!-- Quick examples -->
        <div style="display: flex; flex-direction: column; gap: 8px; padding: 20px 24px; border-radius: 8px; border: 1px solid var(--border-default); background: var(--background-surface); margin-bottom: 32px;">
          <p class="text-body-md" style="margin: 0; color: var(--text-default); font-weight: 600;">
            text-default — Primary content
          </p>
          <p class="text-body-sm" style="margin: 0; color: var(--text-muted);">
            text-muted — Supporting copy, metadata, labels
          </p>
          <p class="text-body-sm" style="margin: 0; color: var(--text-primary);">
            text-primary — Brand-colored text, active states
          </p>
          <p class="text-body-sm" style="margin: 0; color: var(--text-accent);">
            text-accent — Accent highlights, code references
          </p>
          <p class="text-body-sm" style="margin: 0; color: var(--text-danger);">
            text-danger — Error messages, destructive labels
          </p>
          <p class="text-body-sm" style="margin: 0; color: var(--text-success);">
            text-success — Success confirmation, positive feedback
          </p>
          <p class="text-body-sm" style="margin: 0; color: var(--text-warning);">
            text-warning — Caution messages, degraded states
          </p>
          <a class="text-body-sm" style="margin: 0; color: var(--text-link); text-decoration: underline; cursor: pointer;">
            text-link — Hyperlinks and navigation
          </a>
        </div>

        <TokenTable :tokens="textTokens" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Semantic text color tokens for all typography roles.' },
    },
  },
};

// ─── Border Tokens ────────────────────────────────────────────────────────────

export const Borders = {
  name: 'Borders',
  render: () => ({
    components: { TokenTable },
    setup() { return { borderTokens }; },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Semantic / Border</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Border Tokens</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 32px; line-height: 1.7;">
          Border tokens define edge and divider colors for UI structure and state feedback.
          Use <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">border-default</code> for most borders
          and <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">border-subtle</code> for lightweight dividers.
        </p>

        <!-- Quick examples -->
        <div style="display: flex; gap: 10px; margin-bottom: 32px; flex-wrap: wrap;">
          <div style="padding: 14px 18px; border-radius: 8px; border: 1px solid var(--border-default); background: var(--background-surface);">
            <p class="text-body-xs text-muted" style="margin: 0; font-family: monospace;">border-default</p>
          </div>
          <div style="padding: 14px 18px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--background-surface);">
            <p class="text-body-xs text-muted" style="margin: 0; font-family: monospace;">border-subtle</p>
          </div>
          <div style="padding: 14px 18px; border-radius: 8px; border: 2px solid var(--border-primary); background: var(--background-surface);">
            <p class="text-body-xs text-primary" style="margin: 0; font-family: monospace;">border-primary</p>
          </div>
          <div style="padding: 14px 18px; border-radius: 8px; border: 1px solid var(--border-danger); background: var(--background-danger);">
            <p class="text-body-xs text-danger" style="margin: 0; font-family: monospace;">border-danger</p>
          </div>
          <div style="padding: 14px 18px; border-radius: 8px; border: 1px solid var(--border-success); background: var(--background-success);">
            <p class="text-body-xs text-success" style="margin: 0; font-family: monospace;">border-success</p>
          </div>
          <div style="padding: 14px 18px; border-radius: 8px; border: 1px solid var(--border-warning); background: var(--background-warning);">
            <p class="text-body-xs text-warning" style="margin: 0; font-family: monospace;">border-warning</p>
          </div>
        </div>

        <TokenTable :tokens="borderTokens" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Semantic border tokens for structural and state-based borders.' },
    },
  },
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground = {
  name: 'Playground',
  render: () => ({
    components: { ColorPlayground },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Interactive</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Color Playground</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 32px; line-height: 1.7;">
          Select any semantic token and preview how it resolves across light and dark modes.
          Click a code label to copy it to clipboard.
        </p>
        <ColorPlayground />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Interactive preview of all semantic color tokens with copy-to-clipboard.' },
    },
  },
};
