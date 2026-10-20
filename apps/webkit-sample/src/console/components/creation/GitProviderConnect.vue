<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'

  import { connectGitProvider, GIT_PROVIDER, gitConnecting } from '../../lib/state/git-provider'

  interface Props {
    title?: string
    description?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Connect your repository',
    description:
      'Choose a Git provider to connect your repository and start the deployment process.'
  })

  defineSlots<{
    alternative(): unknown
  }>()

  const emit = defineEmits<{
    connected: [scope: unknown]
  }>()

  const connect = async () => {
    const scope = await connectGitProvider()
    emit('connected', scope)
  }
</script>

<template>
  <CardBox>
    <template #content>
      <EmptyState
        size="medium"
        :title="title"
        :description="description"
        class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
      >
        <template #icon>
          <span class="relative flex size-10 items-center justify-center">
            <span
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
            />
            <span
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
            />
            <span
              class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
            >
              <i
                :class="GIT_PROVIDER.icon"
                class="text-body-md leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
          </span>
        </template>
        <template #actions>
          <Button
            :label="`Continue with ${GIT_PROVIDER.label}`"
            :icon="GIT_PROVIDER.icon"
            kind="secondary"
            size="large"
            :loading="gitConnecting"
            @click="connect"
          />
          <slot name="alternative" />
          <Link
            label="Manage connected providers"
            href="#"
            size="large"
            @click.prevent
          />
        </template>
      </EmptyState>
    </template>
  </CardBox>
</template>
