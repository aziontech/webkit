<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'

  const sections = ['Reference', 'Guides', 'Dev tools']
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Azion documentation">
      <GlobalHeader.Left>
        <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
          <div class="shrink-0 lg:hidden">
            <IconButton
              icon="pi pi-bars"
              kind="outlined"
              size="medium"
              aria-label="Open documentation navigation"
            />
          </div>
          <GlobalHeader.Brand>
            <a
              href="#"
              aria-label="Azion Docs home"
              class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) gap-(--spacing-xs)"
            >
              <Brand
                kind="default"
                size="small"
              />
              <span
                class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
              >
                Docs
              </span>
            </a>
          </GlobalHeader.Brand>
          <div class="shrink-0 ml-(--spacing-xs) hidden lg:flex">
            <NavigationMenu aria-label="Documentation sections">
              <NavigationMenu.List>
                <NavigationMenu.Item
                  v-for="section in sections"
                  :key="section"
                >
                  <NavigationMenu.Trigger href="#">{{ section }}</NavigationMenu.Trigger>
                </NavigationMenu.Item>
              </NavigationMenu.List>
              <NavigationMenu.Portal>
                <NavigationMenu.Positioner
                  side="bottom"
                  align="start"
                  :side-offset="12"
                >
                  <NavigationMenu.Popup>
                    <NavigationMenu.Arrow />
                    <NavigationMenu.Viewport />
                  </NavigationMenu.Popup>
                </NavigationMenu.Positioner>
              </NavigationMenu.Portal>
            </NavigationMenu>
          </div>
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Nav />
      <GlobalHeader.Right>
        <IconButton
          icon="pi pi-search"
          kind="outlined"
          size="medium"
          aria-label="Search documentation"
          class="shrink-0"
        />
        <IconButton
          icon="pi pi-github"
          kind="outlined"
          size="medium"
          aria-label="Azion on GitHub"
          href="https://github.com/aziontech"
          target="_blank"
          class="shrink-0"
        />
        <Button
          label="Console"
          kind="secondary"
          size="medium"
          class="shrink-0"
          href="#"
        />
      </GlobalHeader.Right>
    </GlobalHeader>
  </div>
</template>
