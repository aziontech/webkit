<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const value = ref([])
  const options = [
    { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
    { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
    { value: 'tag', label: 'With tag', tag: 'Label' }
  ]
</script>

<template>
  <div style="width: 280px">
    <MultiSelect
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectOption
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          :icon="o.icon"
        >
          <template
            v-if="o.leftIcon"
            #left
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
        </MultiSelectOption>
      </MultiSelectContent>
    </MultiSelect>
  </div>
</template>
