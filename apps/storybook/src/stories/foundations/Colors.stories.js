import PrimitiveScale   from '../../foundations/components/PrimitiveScale.vue';
import TokenTable       from '../../foundations/components/TokenTable.vue';
import ColorPlayground  from '../../foundations/components/ColorPlayground.vue';

import {
  primitiveColors,
  backgroundTokens,
  textTokens,
  borderTokens,
} from '../../foundations/data/colors.js';

import {
  PageContainer,
  PageHeader,
  SectionHeader,
  Alert,
  ArchitectureDiagram,
  CategoryCard,
  TokenPreview,
} from '../../foundations/components/layout/index.js';

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
    components: {
      PageContainer,
      PageHeader,
      SectionHeader,
      ArchitectureDiagram,
      CategoryCard,
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Color System">
          The Azion color system is a <strong class="text-default">layered token architecture</strong>.
          Raw hex values are never used in components — instead, semantic tokens are referenced, which
          resolve automatically for both light and dark mode via CSS variables.
        </PageHeader>

        <!-- Architecture diagram -->
        <SectionHeader title="Token Architecture" margin-bottom="mb-4" />
        <ArchitectureDiagram />

        <!-- Category summary -->
        <SectionHeader title="Semantic Categories" margin-bottom="mb-4" />
        <div class="grid grid-cols-3 gap-3.5 mb-12">
          <CategoryCard
            overline="Background"
            title="13 tokens"
            description="Surface hierarchy, canvas, status fills, and brand-colored backgrounds."
            tokens="bg-surface · bg-canvas · bg-primary"
            story-id="foundations-colors--backgrounds"
          />
          <CategoryCard
            overline="Text"
            title="15 tokens"
            description="Default, muted, link, code, status, brand, and interactive text roles."
            tokens="text-default · text-muted · text-danger"
            story-id="foundations-colors--text-colors"
          />
          <CategoryCard
            overline="Border"
            title="13 tokens"
            description="Default, subtle, strong, status-based, and brand-colored borders."
            tokens="border-default · border-subtle · border-danger"
            story-id="foundations-colors--borders"
          />
        </div>
      </PageContainer>
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
    components: {
      PageContainer,
      PageHeader,
      SectionHeader,
      Alert,
      PrimitiveScale,
    },
    setup() { return { primitiveColors }; },
    template: /* html */ `
      <PageContainer>
        <SectionHeader
          title="Primitive Color Palette"
          description="Raw color scales. These are the base values that power the semantic layer."
          size="lg"
        />
        <Alert variant="warning" class="mb-9">
          Do not reference primitives directly in components. Always use semantic tokens.
        </Alert>
        <div class="flex flex-col">
          <PrimitiveScale v-for="family in primitiveColors" :key="family.name" :family="family" />
        </div>
      </PageContainer>
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
    components: {
      PageContainer,
      SectionHeader,
      TokenTable,
      TokenPreview,
    },
    setup() { return { backgroundTokens }; },
    template: /* html */ `
      <PageContainer>
        <SectionHeader
          title="Background Tokens"
          description="Background tokens define surface hierarchy, status fills, and brand-colored backgrounds."
          size="lg"
        />

        <!-- Quick examples -->
        <div class="flex gap-2.5 mb-8 flex-wrap">
          <TokenPreview token="background-canvas" label="bg-canvas" description="Page background" type="background" />
          <TokenPreview token="background-surface" label="bg-surface" description="Cards / panels" type="background" />
          <TokenPreview token="background-surfaceRaised" label="bg-surfaceRaised" description="Modals / dropdowns" type="background" />
          <TokenPreview token="background-primary" label="bg-primary" description="Brand CTA" type="background" />
        </div>

        <TokenTable :tokens="backgroundTokens" />
      </PageContainer>
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
    components: {
      PageContainer,
      SectionHeader,
      TokenTable,
    },
    setup() { return { textTokens }; },
    template: /* html */ `
      <PageContainer>
        <SectionHeader
          title="Text Color Tokens"
          description="Text tokens define intent-based roles for all typography in the product."
          size="lg"
        />

        <!-- Quick examples -->
        <div class="flex flex-col gap-2 p-5 px-6 rounded-lg border border-default bg-surface mb-8">
          <p class="text-body-sm m-0 text-default">text-default — Primary content</p>
          <p class="text-body-sm m-0 text-muted">text-muted — Supporting copy, metadata, labels</p>
          <p class="text-body-sm m-0 text-primary">text-primary — Brand-colored text, active states</p>
          <p class="text-body-sm m-0 text-accent">text-accent — Accent highlights, brand support texts</p>
          <p class="text-body-sm m-0 text-danger">text-danger — Error messages, destructive labels</p>
          <p class="text-body-sm m-0 text-success">text-success — Success confirmation, positive feedback</p>
          <p class="text-body-sm m-0 text-warning">text-warning — Caution messages, degraded states</p>
          <a class="text-body-sm m-0 text-link">text-link — Hyperlinks and navigation</a>
        </div>

        <TokenTable :tokens="textTokens" />
      </PageContainer>
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
    components: {
      PageContainer,
      SectionHeader,
      TokenTable,
    },
    setup() { return { borderTokens }; },
    template: /* html */ `
      <PageContainer>
        <SectionHeader
          title="Border Tokens"
          description="Border tokens define edge and divider colors for UI structure and state feedback."
          size="lg"
        />

        <!-- Quick examples -->
        <div class="flex gap-2.5 mb-8 flex-wrap">
          <div class="px-4 py-3.5 rounded-lg border border-default bg-surface">
            <p class="text-body-xs text-default m-0 font-code">border-default</p>
          </div>
          <div class="px-4 py-3.5 rounded-lg border border-subtle bg-surface">
            <p class="text-body-xs text-default m-0 font-code">border-subtle</p>
          </div>
          <div class="px-4 py-3.5 rounded-lg border border-primary bg-surface">
            <p class="text-body-xs text-default m-0 font-code">border-primary</p>
          </div>
          <div class="px-4 py-3.5 rounded-lg border border-danger bg-danger">
            <p class="text-body-xs text-default m-0 font-code">border-danger</p>
          </div>
          <div class="px-4 py-3.5 rounded-lg border border-success bg-success">
            <p class="text-body-xs text-default m-0 font-code">border-success</p>
          </div>
          <div class="px-4 py-3.5 rounded-lg border border-warning bg-warning">
            <p class="text-body-xs text-default m-0 font-code">border-warning</p>
          </div>
        </div>

        <TokenTable :tokens="borderTokens" />
      </PageContainer>
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
    components: {
      PageContainer,
      SectionHeader,
      ColorPlayground,
    },
    template: /* html */ `
      <PageContainer>
        <SectionHeader
          title="Color Playground"
          description="Select any semantic token and preview how it resolves across light and dark modes. Click a code label to copy it to clipboard."
          size="lg"
        />
        <ColorPlayground />
      </PageContainer>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Interactive preview of all semantic color tokens with copy-to-clipboard.' },
    },
  },
};
