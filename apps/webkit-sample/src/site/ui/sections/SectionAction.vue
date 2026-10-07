<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteAction } from './types'

  defineOptions({ name: 'SectionAction', inheritAttrs: false })

  interface Props {
    /** The action to render. */
    action: SiteAction
  }

  defineProps<Props>()

  const { follow } = useSiteLink()
</script>

<template>
  <Button
    v-bind="$attrs"
    :label="action.label"
    :kind="action.kind ?? 'secondary'"
    :size="action.size ?? 'large'"
    :href="action.href"
    :target="action.external ? '_blank' : undefined"
    :icon="action.trailing ? 'pi pi-chevron-right' : (action.icon ?? '')"
    :icon-position="action.trailing ? 'trailing' : 'leading'"
    :animated="action.trailing ?? false"
    @click="follow($event, action.href)"
  />
</template>
