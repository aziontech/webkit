<script setup lang="ts">
  import SegmentedButton from '../../../actions/segmented-button/segmented-button.vue'
  import CodeBlock from '../../../code/code-block/code-block.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'AiInferenceFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; this fragment holds still either way. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const CODE = `export default {
  async fetch(request) {
    const { prompt } = await request.json();

    const response = await Azion.AI.run(
      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',
      { messages: [{ role: 'user', content: prompt }] }
    );

    return Response.json(response);
  }
};`

  const MODEL_LINE = 6

  const DOCUMENTS = [
    { label: 'Code', value: 'code' },
    { label: 'Arguments', value: 'arguments' }
  ]

  const FILES = [
    {
      label: 'Code',
      value: 'code',
      language: 'javascript',
      code: CODE,
      highlightedLine: MODEL_LINE
    }
  ]
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="500"
    :mobile-width="480"
  >
    <div class="py-(--spacing-xs)">
      <div
        class="flex flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      >
        <ShellMockupPart :order="0">
          <div
            class="flex items-center gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <SegmentedButton
              model-value="code"
              :options="DOCUMENTS"
              aria-label="Editor document"
            />
            <p class="min-w-0 truncate text-body-xs text-(--text-muted)">
              JavaScript, running on request
            </p>
          </div>
        </ShellMockupPart>

        <ShellMockupPart :order="1">
          <CodeBlock
            :tabs="FILES"
            :border="false"
            show-line-numbers
            copy-aria-label="Copy the function code"
          />
        </ShellMockupPart>
      </div>
    </div>
  </ShellMockup>
</template>
