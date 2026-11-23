<script setup lang="ts">
  import { computed, ref } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Chip from '../../../input/chip/chip.vue'
  import DropdownMenu from '../../../navigation/dropdown-menu/dropdown-menu.vue'
  import DropdownMenuGroup from '../../../navigation/dropdown-menu/dropdown-menu-group/dropdown-menu-group.vue'
  import DropdownMenuItem from '../../../navigation/dropdown-menu/dropdown-menu-item/dropdown-menu-item.vue'
  import DropdownMenuTrigger from '../../../navigation/dropdown-menu/dropdown-menu-trigger/dropdown-menu-trigger.vue'
  import { enabledTools, toggleTool } from '../lib/tool-keys'
  import type { PromptInputMenuOption } from '../types'

  defineOptions({ name: 'PromptInputAddMenu', inheritAttrs: false })

  interface Props {
    /** Glyph of the trigger. */
    icon: string
    /** Accessible name of the trigger. */
    label: string
    /** Locks the trigger, the picks and the chips. */
    disabled: boolean
    /** The composer's file filter; images are offered when it takes them. */
    accept: string
    /** More than one photo may be picked at once. */
    multiple: boolean
    /** The tools the reader can turn on. */
    tools: PromptInputMenuOption[]
    /** Strings from the locale catalog. */
    labels: {
      add: string
      camera: string
      photos: string
      files: string
      tools: string
      chips: string
    }
    /** Test id of the owning attach control. */
    testId: string
  }

  const props = defineProps<Props>()

  const model = defineModel<string[]>({ required: true })

  const emit = defineEmits<{
    files: [event: Event, files: File[]]
    browse: [event: MouseEvent | KeyboardEvent]
  }>()

  const cameraEl = ref<HTMLInputElement | null>(null)
  const photosEl = ref<HTMLInputElement | null>(null)
  const touch = useMediaQuery('(pointer: coarse)')

  const images = computed<boolean>(
    () => !props.accept || props.accept.split(',').some((item) => item.trim().startsWith('image/'))
  )
  const sources = computed(() => [
    ...(touch.value && images.value
      ? [{ value: 'camera', label: props.labels.camera, icon: 'az az-camera' }]
      : []),
    ...(images.value ? [{ value: 'photos', label: props.labels.photos, icon: 'az az-image' }] : []),
    { value: 'files', label: props.labels.files, icon: 'az az-paperclip' }
  ])
  const enabled = computed<PromptInputMenuOption[]>(() => enabledTools(props.tools, model.value))

  function toggle(value: string): void {
    model.value = toggleTool(props.tools, model.value, value)
  }

  function onSelect(event: MouseEvent | KeyboardEvent, value: string | number): void {
    const key = String(value)
    if (key === 'source:camera') cameraEl.value?.click()
    else if (key === 'source:photos') photosEl.value?.click()
    else if (key === 'source:files') emit('browse', event)
    else if (key.startsWith('tool:')) toggle(key.slice(5))
  }

  function onChange(event: Event): void {
    const input = event.target as HTMLInputElement
    emit('files', event, Array.from(input.files ?? []))
    input.value = ''
  }
</script>

<template>
  <DropdownMenu
    side="top"
    align="start"
    :disabled="disabled"
    @select="onSelect"
  >
    <DropdownMenuTrigger>
      <IconButton
        v-bind="$attrs"
        :icon="icon"
        variant="ghost"
        size="medium"
        :ariaLabel="label"
        :disabled="disabled"
        :data-testid="testId"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup :label="labels.add">
      <DropdownMenuItem
        v-for="source in sources"
        :key="source.value"
        :value="`source:${source.value}`"
        :label="source.label"
        :data-testid="`${testId}__${source.value}`"
      >
        <template #leading>
          <i
            :class="source.icon"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuGroup :label="labels.tools">
      <DropdownMenuItem
        v-for="tool in tools"
        :key="tool.value"
        :value="`tool:${tool.value}`"
        type="checkbox"
        :selected="model.includes(tool.value)"
        :label="tool.label"
      >
        <template
          v-if="tool.icon"
          #leading
        >
          <i
            :class="tool.icon"
            aria-hidden="true"
          />
        </template>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenu>
  <input
    ref="cameraEl"
    type="file"
    class="hidden"
    tabindex="-1"
    aria-hidden="true"
    accept="image/*"
    capture="environment"
    :disabled="disabled"
    :data-testid="`${testId}__camera-input`"
    @change="onChange"
  />
  <input
    ref="photosEl"
    type="file"
    class="hidden"
    tabindex="-1"
    aria-hidden="true"
    accept="image/*"
    :multiple="multiple"
    :disabled="disabled"
    :data-testid="`${testId}__photos-input`"
    @change="onChange"
  />
  <ul
    v-if="enabled.length"
    :aria-label="labels.chips"
    :data-testid="`${testId}__enabled`"
    class="m-0 flex list-none flex-wrap gap-(--spacing-2xs) p-0"
  >
    <li
      v-for="tool in enabled"
      :key="tool.value"
    >
      <Chip
        :label="tool.label"
        removable
        :disabled="disabled"
        @remove="toggle(tool.value)"
      >
        <i
          v-if="tool.icon"
          :class="tool.icon"
          class="me-(--spacing-2xs)"
          aria-hidden="true"
        />{{ tool.label }}
      </Chip>
    </li>
  </ul>
</template>
