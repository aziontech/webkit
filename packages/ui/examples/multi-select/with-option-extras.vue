<script setup>
  import MultiSelectContent from '@aziontech/ui/multi-select-content'
  import MultiSelectItem from '@aziontech/ui/multi-select-item'
  import MultiSelectRoot from '@aziontech/ui/multi-select-root'
  import MultiSelectTrigger from '@aziontech/ui/multi-select-trigger'
  import Tag from '@aziontech/ui/tag'
  import { ref } from 'vue'

  const value = ref([])
  const options = [
    { value: 'heart', label: 'With icon', icon: 'az az-heart' },
    { value: 'left', label: 'With left slot', leftIcon: 'az az-star' },
    { value: 'tag', label: 'With tag', tag: 'Label' }
  ]
</script>

<template>
  <div class="w-full max-w-70">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectItem
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          :icon="o.icon"
        >
          <template
            v-if="o.leftIcon"
            #leading
          >
            <i
              :class="o.leftIcon"
              aria-hidden="true"
            />
          </template>
          {{ o.label }}
          <template
            v-if="o.tag"
            #tag
          >
            <Tag
              :label="o.tag"
              severity="info"
              size="small"
            />
          </template>
        </MultiSelectItem>
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
