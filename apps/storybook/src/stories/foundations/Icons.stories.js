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
  render: (args) => ({
    components: { IconGrid },
    setup() {
      return { icons, args };
    },
    template: /* html */ `
      <div style="font-family: Sora, sans-serif; max-width: 1000px; padding: 40px;">

        <!-- Header -->
        <h1 class="text-heading-xl text-default" style="margin: 0 0 12px;">Icons</h1>
        <p class="text-body-md text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          The Azion icon system combines <strong style="color: var(--text-default)">custom product icons</strong>
          with the <strong style="color: var(--text-default)">PrimeIcons</strong> library for general-purpose UI icons.
        </p>

        <!-- Import -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Import</h2>
        <div style="background: var(--background-surface); border: 1px solid var(--border-default); border-radius: 8px; padding: 20px; margin-bottom: 48px;">
          <p class="text-body-xs text-muted" style="margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">JavaScript</p>
          <pre style="font-family: 'Roboto Mono', monospace !important; margin: 0; font-size: 13px; color: var(--text-default); line-height: 1.6;"><code class="font-code">import '@aziontech/icons';</code></pre>
        </div>

        <!-- Usage -->
        <h2 class="text-heading-sm text-default" style="margin: 0 0 16px;">Usage</h2>
        <div style="background: var(--background-surface); border: 1px solid var(--border-default); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p class="text-body-xs text-muted" style="margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">HTML</p>
          <pre style="font-family: 'Roboto Mono', monospace !important; margin: 0; font-size: 13px; color: var(--text-default); line-height: 1.6;"><code class="font-code">&lt;i class="ai ai-azion"&gt;&lt;/i&gt;
&lt;i class="ai ai-edge-functions text-default text-2xl"&gt;&lt;/i&gt;
&lt;i class="pi pi-check"&gt;&lt;/i&gt;
&lt;i class="pi pi-times text-default text-2xl"&gt;&lt;/i&gt;</code></pre>
        </div>
        <p class="text-body-sm text-muted" style="max-width: 620px; line-height: 1.75; margin: 0 0 48px;">
          Icons are a font, which means they inherit text properties.
        </p>

        <!-- Icon Gallery -->
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
      description: { story: 'Icon system overview: import, usage examples, and complete icon gallery.' },
    },
  },
};
