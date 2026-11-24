<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import { useConsoleLayout } from '../composables/use-console-layout'

  defineOptions({
    name: 'ConsoleLayoutToolsTrigger',
    inheritAttrs: false
  })

  export interface ConsoleLayoutToolsTriggerProps {
    /** Visible label. Empty uses the locale catalog (`Info`). */
    label?: string
    /** A fuller accessible name that starts with the visible label, such as Info about workloads. Empty leaves the visible label as the name. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ConsoleLayoutToolsTriggerProps>(), {
    label: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** Fired before the tools region toggles, so the page can set the help topic first; preventDefault keeps the region as it is. */
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ consoleLayout: en.consoleLayout })
  const layout = useConsoleLayout({ optional: true })

  const testId = computed<string>(() =>
    String(attrs['data-testid'] ?? 'console-layout-tools-trigger')
  )

  const open = computed(() => layout?.toolsOpen.value ?? false)

  const onClick = (event: MouseEvent) => {
    emit('click', event)
    if (!event.defaultPrevented) layout?.toggleTools()
  }
</script>

<template>
  <Button
    v-bind="$attrs"
    :data-testid="testId"
    :label="props.label || t('consoleLayout.info')"
    :aria-label="props.ariaLabel || undefined"
    :aria-expanded="layout ? String(open) : undefined"
    :aria-controls="layout && open ? layout.toolsId : undefined"
    :data-state="layout ? (open ? 'open' : 'closed') : undefined"
    variant="link"
    @click="onClick"
  />
</template>
