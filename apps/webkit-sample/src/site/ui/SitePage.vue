<script setup lang="ts">
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import { computed } from 'vue'

  import { HERO_SECTIONS, SECTIONS } from './sections'
  import type { PageSection } from './sections'

  defineOptions({ name: 'SitePage' })

  interface Props {
    /** The page, top to bottom: an opening hero, then the column's sections. */
    sections: PageSection[]
  }

  const props = defineProps<Props>()

  const resolve = (entry: PageSection) => {
    const component = SECTIONS[entry.section]
    if (!component) throw new Error(`SitePage: no section is registered as "${entry.section}".`)
    const { section, ...rest } = entry
    return { key: section, component, props: rest }
  }

  const opening = computed(() =>
    props.sections.filter((entry) => HERO_SECTIONS.has(entry.section)).map(resolve)
  )

  const column = computed(() =>
    props.sections
      .filter((entry) => !HERO_SECTIONS.has(entry.section))
      .map((entry) => ({
        ...resolve(entry),
        gap: !(entry.section === 'ClosingCallToAction' && entry.kind === 'frame')
      }))
  )
</script>

<template>
  <component
    :is="entry.component"
    v-for="(entry, index) in opening"
    :key="`${entry.key}-${index}`"
    v-bind="entry.props"
  />
  <SectionContainer max-width="site">
    <template
      v-for="(entry, index) in column"
      :key="`${entry.key}-${index}`"
    >
      <SectionGap
        v-if="entry.gap"
        hatch
      />
      <component
        :is="entry.component"
        v-bind="entry.props"
      />
    </template>
  </SectionContainer>
</template>
