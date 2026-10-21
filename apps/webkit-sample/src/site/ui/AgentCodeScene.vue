<script setup lang="ts">
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { computed } from 'vue'

  interface SceneAgent extends CodeBlockTab {
    /** Colored icon class drawn beside the tab's name, an `ai-cor` icon. */
    icon: string
  }

  interface Props {
    /** One tab per agent, each opening its own code. */
    agents: SceneAgent[]
    /** Accessible name of the copy control. */
    copyAriaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), { copyAriaLabel: 'Copy the code sample' })

  const icons = computed(() => new Map(props.agents.map((agent) => [agent.value, agent.icon])))
</script>

<template>
  <div
    class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
  >
    <CodeBlock
      :tabs="agents"
      show-line-numbers
      :border="false"
      animate-lines
      :copy-aria-label="copyAriaLabel"
    >
      <template #tab-icon="{ tab }">
        <i
          :class="icons.get(tab.value)"
          class="size-3.5!"
          aria-hidden="true"
        />
      </template>
    </CodeBlock>
  </div>
</template>
