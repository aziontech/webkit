<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tag from '@aziontech/webkit/tag'

  interface Props {
    title: string
    description?: string
    vendor?: string
    icon?: string
    markClass?: string
    badge?: string
    featured?: boolean
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    vendor: 'Azion',
    icon: '',
    markClass: '',
    badge: 'Integration',
    featured: false
  })

  const emit = defineEmits<{
    select: [event: Event]
  }>()

  const activate = (event) => emit('select', event)
</script>

<template>
  <CardBox
    class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
    :class="
      featured ? 'bg-(--bg-surface-raised) hover:border-(--border-strong)' : 'hover:bg-(--bg-hover)'
    "
    role="button"
    tabindex="0"
    @click="activate"
    @keydown.enter="activate"
    @keydown.space.prevent="activate"
  >
    <template #content>
      <span
        v-if="featured"
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-10 transition-opacity duration-moderate-01 ease-productive-entrance group-hover:opacity-20 motion-reduce:transition-none"
        style="background: radial-gradient(120% 90% at 50% 0%, var(--primary), transparent 62%)"
      />

      <Tag
        v-if="featured && badge"
        class="absolute right-(--spacing-md) top-(--spacing-md) z-10"
        severity="primary"
        size="small"
        :label="badge"
      />

      <div
        v-if="featured"
        class="relative z-[1] flex flex-col items-center gap-(--spacing-md) px-(--spacing-sm) py-(--spacing-lg) text-center"
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
            aria-label="Azion Marketplace"
          />
        </span>
        <div class="flex flex-col items-center gap-(--spacing-xxs)">
          <h3 class="text-heading-xs text-(--text-default)">{{ title }}</h3>
          <span
            v-if="vendor"
            class="text-body-xs text-(--text-muted)"
            >by {{ vendor }}</span
          >
        </div>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          {{ description }}
        </p>
      </div>

      <div
        v-else
        class="flex items-start gap-(--spacing-md)"
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
            aria-label="Azion Marketplace"
          />
        </span>
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <div class="flex flex-wrap items-baseline gap-x-(--spacing-xs)">
            <h3 class="text-label-md text-(--text-default)">{{ title }}</h3>
            <span
              v-if="vendor"
              class="text-body-xs text-(--text-muted)"
              >by {{ vendor }}</span
            >
          </div>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </div>
        <Tag
          v-if="badge"
          class="shrink-0"
          severity="info"
          size="small"
          :label="badge"
        />
      </div>
    </template>
  </CardBox>
</template>
