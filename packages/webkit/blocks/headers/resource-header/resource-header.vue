<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Kbd from '@aziontech/webkit/kbd'
  import Tooltip from '@aziontech/webkit/tooltip'

  const crumbs = [{ label: 'Applications' }]
</script>

<template>
  <div class="@container w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Left>
        <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
          <span class="contents md:hidden">
            <Tooltip
              text="Open navigation"
              placement="bottom"
            >
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                aria-label="Open navigation"
              />
            </Tooltip>
          </span>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) h-6 shrink-0 px-(--spacing-xxs)"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
          <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
            <Breadcrumb
              :items="crumbs"
              class="w-full"
            />
          </div>
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <span class="contents @2xl:hidden">
          <Tooltip
            text="Search"
            placement="bottom"
          >
            <IconButton
              icon="pi pi-search"
              kind="outlined"
              size="medium"
              aria-label="Search"
              aria-keyshortcuts="Meta+K"
              class="shrink-0"
            />
          </Tooltip>
        </span>
        <button
          type="button"
          aria-label="Search"
          aria-keyshortcuts="Meta+K"
          class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @2xl:flex"
        >
          <span
            class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
            aria-hidden="true"
          >
            <i class="pi pi-search" />
          </span>
          <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">Search</span>
          <Kbd
            meta
            size="small"
            class="shrink-0"
            >K</Kbd
          >
        </button>
        <span class="contents md:hidden">
          <Tooltip
            text="Create"
            placement="bottom"
          >
            <IconButton
              icon="pi pi-plus-circle"
              kind="primary"
              size="medium"
              aria-label="Create"
            />
          </Tooltip>
          <Tooltip
            text="Agent"
            placement="bottom"
          >
            <IconButton
              icon="ai ai-ask-azion"
              kind="outlined"
              size="medium"
              aria-label="Agent"
            />
          </Tooltip>
        </span>
        <span class="hidden md:contents">
          <Button
            label="Create"
            kind="primary"
            size="medium"
            icon="pi pi-plus-circle"
          />
          <ButtonHighlight
            label="Agent"
            size="medium"
            icon="ai ai-ask-azion"
          />
        </span>
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
  </div>
</template>
