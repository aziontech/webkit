<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'

  const breadcrumb = [
    { label: 'Start from a template' },
    { label: 'Nuxt E-commerce', current: true }
  ]
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Creation Center"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative min-w-0 flex-1 overflow-auto"
    >
      <div
        class="layout-column-focused relative flex min-h-full flex-col items-center gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-xxl)"
      >
        <div
          class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) max-w-none! motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              class="ai-cor ai-nuxt text-body-lg leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>

          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
            <div class="flex w-full min-w-0 flex-col overflow-hidden">
              <span class="flex items-center gap-(--spacing-xs)">
                <span class="truncate text-heading-xxs text-(--text-default)">Nuxt E-commerce</span>
              </span>
              <span class="text-body-xs text-(--text-muted)">
                Launch a Nuxt e-commerce or content app in a few steps.
              </span>
            </div>

            <div class="flex w-full flex-col gap-(--spacing-xxs)">
              <span class="truncate text-body-xxs text-(--text-muted)">Cloning from GitHub</span>
              <div class="flex items-center gap-(--spacing-md)">
                <span
                  class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)"
                >
                  <i
                    class="ai ai-github text-[length:inherit] leading-none"
                    aria-hidden="true"
                  />
                  acme
                </span>
                <span
                  class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)"
                >
                  <i
                    class="pi pi-folder text-[length:inherit] leading-none"
                    aria-hidden="true"
                  />
                  templates/nuxt-ecommerce
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          data-phase="connect"
          class="flex w-full flex-col items-center gap-(--spacing-xl) data-[phase=success]:my-auto motion-reduce:transition-none! motion-reduce:transform-none!"
        >
          <Card class="w-full">
            <template #content>
              <div
                class="flex rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
              >
                <EmptyState
                  size="medium"
                  title="Connect a Git provider"
                  description="Nuxt E-commerce is cloned into a repository in your account, then deployed from it on every push."
                  class="w-full"
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
                          class="ai ai-github text-body-md leading-none text-(--text-default)"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </template>
                  <template #actions>
                    <Button
                      label="Continue with GitHub"
                      icon="ai ai-github"
                      kind="secondary"
                      size="large"
                    />
                    <Button
                      label="Continue without Git"
                      kind="transparent"
                      size="large"
                    />
                    <Link
                      label="Manage connected providers"
                      href="#"
                      size="large"
                    />
                  </template>
                </EmptyState>
              </div>
            </template>
          </Card>

          <Button
            label="Browse templates"
            kind="outlined"
            size="medium"
          />
        </div>
      </div>
    </main>
  </div>
</template>
