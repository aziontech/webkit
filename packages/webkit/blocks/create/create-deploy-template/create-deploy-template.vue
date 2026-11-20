<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { computed } from 'vue'

  import { sampleAccount, sampleTemplate } from './sample'

  /** The template the page deploys. */
  export interface DeployTemplateTemplate {
    /** Display name, the preview card title and the last crumb. */
    name: string
    /** One sentence on what it launches. */
    description: string
    /** Logo glyph class. */
    icon: string
    /** The Git provider it clones from, named in the preview card; left out, the card has no source line. */
    provider?: string
    /** Provider glyph class. */
    providerIcon?: string
    /** The account or organization that publishes it. */
    scope?: string
    /** The folder or repository it clones. */
    path?: string
    /** The source line over the scope and path; left out, Cloning from the provider. */
    source?: string
  }

  export interface DeployTemplateProps {
    /** The template to deploy. Left out, the sample renders. */
    template?: DeployTemplateTemplate
    /** The signed-in account, the avatar label. Left out, the sample renders. */
    account?: string
    /** Where Manage connected providers leads. */
    providersHref?: string
    /** The way the page was reached, the first crumb. */
    crumb?: string
    /** The service the project deploys to, named in the Connect a Git provider step. */
    service?: string
  }

  const props = withDefaults(defineProps<DeployTemplateProps>(), {
    template: undefined,
    account: undefined,
    providersHref: '#',
    crumb: 'Start from a template',
    service: ''
  })

  const emit = defineEmits<{
    /** Back to Creation Center was pressed. */
    back: [event: MouseEvent | KeyboardEvent]
    /** The account menu button was pressed. */
    account: [event: MouseEvent]
    /** Continue with GitHub was pressed. */
    connect: [event: MouseEvent]
    /** Continue without Git was pressed. */
    'skip-git': [event: MouseEvent]
    /** Browse templates was pressed. */
    browse: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The step the flow is on; left empty, the Connect a Git provider step. */
    default?(): unknown
    /** The source line of the preview card; left empty, Cloning from the provider over the scope and path. */
    details?(): unknown
  }>()

  useEscapeToCancel((event) => emit('back', event))

  const currentTemplate = computed(() => props.template ?? sampleTemplate)
  const currentAccount = computed(() => props.account ?? sampleAccount)

  const breadcrumb = computed(() => [
    { label: props.crumb },
    { label: currentTemplate.value.name, active: true }
  ])

  const connectDescription = computed(() =>
    props.service
      ? `${currentTemplate.value.name} is cloned into a repository in your account, then deployed to ${props.service} on every push.`
      : `${currentTemplate.value.name} is cloned into a repository in your account, then deployed from it on every push.`
  )
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Creation Center"
          variant="outline"
          size="small"
          @click="(event: MouseEvent) => emit('back', event)"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          @click="(event: MouseEvent) => emit('account', event)"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            :label="currentAccount"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-2xl)"
      >
        <Card class="w-full">
          <template #default>
            <div class="flex w-full items-start gap-(--spacing-md)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="currentTemplate.icon"
                  class="text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>

              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                <div class="flex w-full min-w-0 flex-col overflow-hidden">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="truncate text-heading-2xs text-(--text-default)">{{
                      currentTemplate.name
                    }}</span>
                  </span>
                  <span class="text-body-xs text-(--text-muted)">
                    {{ currentTemplate.description }}
                  </span>
                </div>

                <div
                  v-if="$slots.details || currentTemplate.provider"
                  class="flex w-full flex-col gap-(--spacing-2xs)"
                >
                  <slot name="details">
                    <span class="truncate text-body-2xs text-(--text-muted)">{{
                      currentTemplate.source ?? `Cloning from ${currentTemplate.provider}`
                    }}</span>
                    <div class="flex items-center gap-(--spacing-md)">
                      <span
                        class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-default)"
                      >
                        <i
                          :class="currentTemplate.providerIcon"
                          class="text-[length:inherit] leading-none"
                          aria-hidden="true"
                        />
                        {{ currentTemplate.scope }}
                      </span>
                      <span
                        class="flex h-5 items-center gap-(--spacing-2xs) text-label-sm text-(--text-muted)"
                      >
                        <i
                          class="az az-folder text-[length:inherit] leading-none"
                          aria-hidden="true"
                        />
                        {{ currentTemplate.path }}
                      </span>
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <slot>
          <div
            data-phase="connect"
            class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
          >
            <EmptyState
              bordered
              size="medium"
              title="Connect a Git provider"
              :description="connectDescription"
              class="w-full"
            >
              <template #icon>
                <span class="relative flex size-10 items-center justify-center">
                  <span
                    aria-hidden="true"
                    class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                  />
                  <span
                    aria-hidden="true"
                    class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                  />
                  <span
                    class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
                  >
                    <i
                      class="az az-github text-body-md leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </template>
              <template #actions>
                <Button
                  label="Continue with GitHub"
                  icon="az az-github"
                  variant="secondary"
                  size="large"
                  @click="(event: MouseEvent) => emit('connect', event)"
                />
                <Button
                  label="Continue without Git"
                  variant="ghost"
                  size="large"
                  @click="(event: MouseEvent) => emit('skip-git', event)"
                />
                <Link
                  label="Manage connected providers"
                  :href="providersHref"
                  size="large"
                />
              </template>
            </EmptyState>

            <Button
              label="Browse templates"
              variant="outline"
              size="medium"
              @click="(event: MouseEvent) => emit('browse', event)"
            />
          </div>
        </slot>
      </div>
    </main>
  </div>
</template>
