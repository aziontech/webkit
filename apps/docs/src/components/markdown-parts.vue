<script setup lang="ts">
  import DocProse from '@aziontech/webkit/doc-prose'

  import type { DocPart } from '../lib/types'
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
        :do-html="part.pair.do"
        :dont-html="part.pair.dont"
      />
      <DocProse v-else>
        <RawHtml :html="part.html" />
      </DocProse>
    </template>
  </div>
</template>
