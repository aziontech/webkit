import IconGrid from '../../foundations/components/IconGrid.vue';
import icons from '@aziontech/icons/catalog';

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Foundations/Icons',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component: [
          'Icon library documentation — Azion custom icons and PrimeIcons.',
          'Icons are distributed via `@aziontech/icons` package.',
        ].join(' '),
      },
    },
  },
  argTypes: {
    initialSize: {
      control: { type: 'range', min: 12, max: 64, step: 4 },
      defaultValue: 24,
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
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Icons</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion icon system combines <strong style="color: var(--text-default)">custom product icons</strong>
          with the <strong style="color: var(--text-default)">PrimeIcons</strong> library for general-purpose UI icons.
          All icons are available as a webfont via the <code style="font-family: monospace; font-size: 12px; color: var(--text-accent)">@aziontech/icons</code> package.
        </p>

        <!-- Icon counts -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Icon Library</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 48px;">
          <div style="padding: 24px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">Azion Icons</p>
            <p class="text-heading-lg text-default" style="margin: 0 0 8px;">87 icons</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              Custom icons for Azion products, technologies, and services.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              ai ai-{name}
            </p>
          </div>
          <div style="padding: 24px; border: 1px solid var(--border-default); border-radius: 8px;">
            <p class="text-overline-xs text-primary" style="margin: 0 0 6px;">PrimeIcons</p>
            <p class="text-heading-lg text-default" style="margin: 0 0 8px;">315 icons</p>
            <p class="text-body-xs text-muted" style="margin: 0; line-height: 1.6;">
              General-purpose UI icons for actions, navigation, and status.
            </p>
            <p class="text-body-xs text-muted" style="margin: 8px 0 0; font-family: 'Roboto Mono';">
              pi pi-{name}
            </p>
          </div>
        </div>

        <!-- Usage -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Usage</h2>
        <div style="background: var(--background-surface); border: 1px solid var(--border-default); border-radius: 8px; padding: 20px; margin-bottom: 48px;">
          <p class="text-body-xs text-muted" style="margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">HTML</p>
          <pre style="margin: 0; font-family: 'Roboto Mono', monospace; font-size: 13px; color: var(--text-default); line-height: 1.6;"><code>&lt;i class="ai ai-azion"&gt;&lt;/i&gt;
&lt;i class="ai ai-edge-functions"&gt;&lt;/i&gt;
&lt;i class="pi pi-check"&gt;&lt;/i&gt;
&lt;i class="pi pi-times"&gt;&lt;/i&gt;</code></pre>
        </div>
    `,
  }),
  parameters: {
    docs: {
      description: { story: 'Icon system overview: library composition, usage examples, and rules.' },
    },
  },
};

// ─── All Icons ────────────────────────────────────────────────────────────────

export const AllIcons = {
  name: 'All Icons',
  render: (args) => ({
    components: { IconGrid },
    setup() {
      return { icons, args };
    },
    template: /* html */ `
      <div style="max-width: 900px; padding: 40px 0;">
        <p class="text-overline-sm text-primary" style="margin: 0 0 8px;">Icons</p>
        <h2 class="text-heading-lg text-default" style="margin: 0 0 8px;">Icon Gallery</h2>
        <p class="text-body-sm text-muted" style="max-width: 620px; margin: 0 0 32px; line-height: 1.7;">
          Browse all {{ icons.length }} icons. Use the search to filter by name, and the slider to adjust preview size.
        </p>
        
        <IconGrid :icons="icons" :initial-size="args.initialSize" />
      </div>
    `,
  }),
  args: {
    initialSize: 24,
  },
  parameters: {
    docs: {
      description: { story: 'Complete icon gallery with search and size controls.' },
    },
  },
};
