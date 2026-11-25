<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import Popover from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import { computed, ref, watch } from 'vue'

  import type { AiChatProject } from '../sample'

  const props = defineProps<{
    projects: AiChatProject[]
  }>()

  const emit = defineEmits<{
    'toggle-pin': [id: string]
  }>()

  const selected = defineModel<string>({ default: '' })
  const open = ref(false)
  const query = ref('')

  function projectIcon({ cloud }: AiChatProject): string {
    return cloud ? 'az az-cloud' : 'az az-server'
  }

  const activeProject = computed(() => props.projects.find((item) => item.id === selected.value))
  const filtered = computed(() => {
    const needle = query.value.trim().toLowerCase()
    const list = props.projects.filter(
      (item) =>
        !needle ||
        item.title.toLowerCase().includes(needle) ||
        item.code.toLowerCase().includes(needle)
    )
    return [...list].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
  })

  function choose(id: string) {
    selected.value = id
    open.value = false
  }

  watch(open, (isOpen) => {
    if (!isOpen) query.value = ''
  })
</script>

<template>
  <Popover
    v-model:open="open"
    side="bottom"
    align="start"
    size="small"
  >
    <PopoverTrigger>
      <Button
        v-if="activeProject"
        variant="ghost"
        size="small"
        :aria-label="`Filter by project: ${activeProject.title}`"
        class="shrink-0"
      >
        <span
          class="inline-flex size-5 items-center justify-center rounded-(--shape-control) bg-(--info-surface) font-mono text-label-xs text-(--info-foreground)"
        >
          {{ activeProject.code }}
        </span>
      </Button>
      <IconButton
        v-else
        icon="az az-filter"
        aria-label="Filter by project"
        variant="ghost"
        size="small"
      />
    </PopoverTrigger>
    <PopoverContent>
      <div class="flex flex-col gap-(--spacing-xs) p-(--spacing-xs)">
        <Input
          v-model="query"
          size="small"
          placeholder="Search projects..."
          aria-label="Search projects"
          role="searchbox"
          autocomplete="off"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
        <div class="flex max-h-72 flex-col gap-0.5 overflow-y-auto">
          <Button
            variant="ghost"
            size="small"
            icon="az az-folder"
            class="w-full"
            @click="choose('')"
          >
            <span class="min-w-0 flex-1 truncate text-start">All projects</span>
            <i
              v-if="selected === ''"
              class="az az-check shrink-0 text-body-sm text-(--accent-primary)"
              aria-hidden="true"
            />
          </Button>
          <div
            v-for="project in filtered"
            :key="project.id"
            class="group/proj flex items-center gap-(--spacing-2xs)"
          >
            <Button
              variant="ghost"
              size="small"
              class="min-w-0 flex-1"
              @click="choose(project.id)"
            >
              <span
                class="relative inline-flex size-5 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--info-surface) font-mono text-label-xs text-(--info-foreground)"
              >
                {{ project.code }}
                <i
                  v-if="selected === project.id"
                  class="az az-circle-check absolute -end-1 -bottom-1 rounded-full bg-(--bg-surface-raised) text-label-xs leading-none text-(--accent-primary)"
                  aria-hidden="true"
                />
              </span>
              <span class="min-w-0 flex-1 truncate text-start">{{ project.title }}</span>
              <i
                :class="[projectIcon(project), 'shrink-0 text-body-xs text-(--text-muted)']"
                aria-hidden="true"
              />
            </Button>
            <span
              class="shrink-0 transition-opacity motion-reduce:transition-none"
              :class="
                project.pinned
                  ? 'opacity-100'
                  : 'opacity-0 group-hover/proj:opacity-100 focus-within:opacity-100'
              "
            >
              <IconButton
                icon="az az-pin"
                :aria-label="project.pinned ? `Unpin ${project.title}` : `Pin ${project.title}`"
                variant="ghost"
                size="small"
                @click.stop="emit('toggle-pin', project.id)"
              />
            </span>
          </div>
          <p
            v-if="!filtered.length"
            class="m-0 px-(--spacing-sm) py-(--spacing-sm) text-center text-body-xs text-(--text-muted)"
          >
            No matching projects.
          </p>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
