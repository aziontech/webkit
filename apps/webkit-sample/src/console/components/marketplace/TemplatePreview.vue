<script setup lang="ts">
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import { computed } from 'vue'

  interface Props {
    title?: string
    description?: string
    icon?: string
    markClass?: string
    source?: string
    cloned?: boolean
    repoOwner?: string
    repoPath?: string
    href?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Template Title',
    description: 'Template Description',
    icon: '',
    markClass: '',
    source: 'github',
    cloned: true,
    repoOwner: 'aziontech',
    repoPath: 'templates/nextjs',
    href: ''
  })

  const sourceIcon = computed(() => (props.source === 'gitlab' ? 'pi-gitlab' : 'pi-github'))

  const isLink = computed(() => Boolean(props.href))
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    :href="isLink ? href : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noopener' : undefined"
    class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) no-underline"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
    >
      <i
        v-if="icon"
        :class="[icon, markClass]"
        class="text-body-lg leading-none text-(--text-default)"
        aria-hidden="true"
      />
      <AzionLogoMin
        v-else
        class="h-5 w-auto"
        aria-label="Azion"
      />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
      <div class="flex w-full min-w-0 flex-col overflow-hidden">
        <span class="flex items-center gap-(--spacing-xs)">
          <span class="truncate text-heading-xxs text-(--text-default)">
            {{ title }}
          </span>
          <i
            v-if="isLink"
            class="pi pi-external-link shrink-0 text-body-xs leading-none"
            aria-hidden="true"
          />
        </span>
        <span class="text-body-xs text-(--text-muted)">
          {{ description }}
        </span>
      </div>

      <div
        v-if="cloned"
        class="flex w-full flex-col gap-(--spacing-xxs)"
      >
        <span class="truncate text-body-xxs text-(--text-muted)">
          Cloning from {{ source === 'gitlab' ? 'GitLab' : 'Github' }}
        </span>
        <div class="flex items-center gap-(--spacing-md)">
          <span
            class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)"
          >
            <i
              :class="['pi', sourceIcon]"
              class="text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoOwner }}
          </span>
          <span class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)">
            <i
              class="pi pi-folder text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoPath }}
          </span>
        </div>
      </div>
    </div>
  </component>
</template>
