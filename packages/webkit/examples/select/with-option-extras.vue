<script setup>
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const value = ref('')
  const options = [
    { value: 'heart', label: 'With icon', icon: 'pi pi-heart' },
    { value: 'left', label: 'With left slot', leftIcon: 'pi pi-star' },
    { value: 'tag', label: 'With tag', tag: 'Label' }
  ]
</script>

<template>
  <div class="w-[280px]">
    <Select
      v-model="value"
      placeholder="Select an option"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Option
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
        </Select.Option>
      </Select.Content>
    </Select>
  </div>
</template>
