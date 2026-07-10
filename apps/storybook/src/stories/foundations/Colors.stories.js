import { primitives } from '@aziontech/theme/colors'
import ColorPaletteSection from '../../foundations/components/ColorPaletteSection.vue'
import { PageContainer, PageHeader } from '../../foundations/components/layout/index.js'

const brandPaletteSections = Object.entries(primitives.brand ?? {})
  .map(([familyName, scale]) => {
    if (!scale || typeof scale !== 'object') return null

    const items = Object.entries(scale).map(([shade, hex]) => {
      const shadeSuffix = String(shade)
      return {
        id: `brand-${familyName}-${shadeSuffix}`,
        label: `${familyName} ${shadeSuffix}`,
        value: hex,
        preview: hex,
        meta: `--brand-${familyName}-${shadeSuffix}`
      }
    })

    return {
      id: `brand-${familyName}`,
      title: familyName,
      description: `Brand ${familyName} primitive scale.`,
      items
    }
  })
  .filter(Boolean)

const shadeScaleKeys = [
  'orange',
  'violet',
  'blue',
  'green',
  'yellow',
  'red',
  'gray',
  'slate',
  'surface'
]

const shadePaletteSections = shadeScaleKeys
  .map((scaleKey) => {
    const scale = primitives[scaleKey]
    if (!scale || typeof scale !== 'object') return null

    const items = Object.entries(scale).map(([shade, hex]) => ({
      id: `${scaleKey}-${shade}`,
      label: `${scaleKey} ${shade}`,
      value: hex,
      preview: hex,
      meta: `--${scaleKey}-${shade}`
    }))

    return {
      id: `primitive-${scaleKey}`,
      title: scaleKey,
      description: `${scaleKey} primitive scale from theme tokens.`,
      items
    }
  })
  .filter(Boolean)

export default {
  title: 'Foundations/Colors',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'The color foundations catalog: every primitive shade scale and brand palette in the Azion theme. Each swatch maps to its `var(--*)` token and is copyable by clicking its value.'
      },
      canvas: { sourceState: 'none' }
    }
  }
}

export const Overview = {
  name: 'Overview',
  parameters: {
    docs: {
      description: {
        story:
          'Complete color reference: the primitive shade scales (orange, violet, blue, green, yellow, red, gray, slate, surface) followed by the brand palettes. Click any swatch value to copy its hex; use the semantic `var(--*)` tokens in components and keep the primitive shades for reference.'
      }
    }
  },
  render: () => ({
    components: { PageContainer, PageHeader, ColorPaletteSection },
    setup() {
      return { brandPaletteSections, shadePaletteSections }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Colors">
          Shared foundations layout using the same header + palette blocks.
          Click a swatch value to copy it. Use semantic tokens in components and keep primitive shades for reference.
        </PageHeader>

        <section class="mb-[var(--spacing-xxl)]">
          <h2 class="m-0 mb-[var(--spacing-md)] text-heading-lg text-[var(--text-default)]">Primitives</h2>
          <ColorPaletteSection
            v-for="section in shadePaletteSections"
            :key="section.id"
            :title="section.title"
            :description="section.description"
            :items="section.items"
          />
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <h2 class="m-0 mb-[var(--spacing-md)] text-heading-lg text-[var(--text-default)]">Brand</h2>
          <ColorPaletteSection
            v-for="section in brandPaletteSections"
            :key="section.id"
            :title="section.title"
            :description="section.description"
            :items="section.items"
          />
        </section>
      </PageContainer>
    `
  })
}
