<script setup lang="ts">
  import DocProse from '@aziontech/webkit/doc-prose'

  import type { DocPart } from '../lib/types'
  import CodeView from './code-view.vue'
  import DoDont from './do-dont.vue'
  import RawHtml from './raw-html.vue'

  defineOptions({ name: 'MarkdownParts' })

  defineProps<{ parts: DocPart[] }>()
</script>

<template>
  <div class="flex flex-col gap-(--layout-group-gap)">
    <template
      v-for="(part, at) in parts"
      :key="at"
    >
      <DoDont
        v-if="'pair' in part"
        :type="part.pair.type"
        :level="part.pair.level"
        :do-id="part.pair.doId"
        :dont-id="part.pair.dontId"
        :do-html="part.pair.do"
        :dont-html="part.pair.dont"
      />
      <CodeView
        v-else-if="'code' in part"
        :source="part.code"
        :label="part.code.lang"
        data-docs-code
      />
      <DocProse
        v-else
        class="[&_:is(p,ul,ol,blockquote,h2,h3,h4)]:max-w-[68ch]"
      >
        <RawHtml :html="part.html" />
      </DocProse>
    </template>
  </div>
</template>
