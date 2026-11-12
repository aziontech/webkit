<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'

  const links = ['Solutions', 'Products', 'Developer', 'Resources', 'Pricing']
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <div class="sticky top-0 z-40">
      <GlobalHeader
        kind="site"
        aria-label="Azion"
      >
        <GlobalHeader.Left>
          <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
            <div class="shrink-0 xl:hidden">
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                aria-label="Open navigation"
              />
            </div>
            <GlobalHeader.Brand>
              <a
                href="#"
                aria-label="Azion home"
                class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>
            </GlobalHeader.Brand>
          </div>
        </GlobalHeader.Left>

        <GlobalHeader.Middle>
          <div class="hidden w-full min-w-0 items-center justify-start xl:flex">
            <div class="min-w-0">
              <NavigationMenu
                aria-label="Azion"
                class="w-full"
              >
                <NavigationMenu.List>
                  <NavigationMenu.Item
                    v-for="link in links"
                    :key="link"
                  >
                    <NavigationMenu.Trigger href="#">{{ link }}</NavigationMenu.Trigger>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
                <NavigationMenu.Portal>
                  <NavigationMenu.Positioner
                    side="bottom"
                    align="start"
                    :side-offset="12"
                  >
                    <NavigationMenu.Popup kind="contrast">
                      <NavigationMenu.Arrow />
                      <NavigationMenu.Viewport />
                    </NavigationMenu.Popup>
                  </NavigationMenu.Positioner>
                </NavigationMenu.Portal>
              </NavigationMenu>
            </div>
          </div>
        </GlobalHeader.Middle>

        <GlobalHeader.Right>
          <div class="hidden xl:flex">
            <Button
              label="Contact"
              kind="transparent"
              size="medium"
              href="#"
            />
          </div>
          <Button
            label="Login"
            kind="secondary"
            size="medium"
            href="#"
          />
          <Button
            label="Start for free"
            kind="primary"
            size="medium"
            class="shrink-0"
            href="#"
          />
          <IconButton
            icon="pi pi-search"
            kind="outlined"
            size="medium"
            aria-label="Search"
            class="shrink-0"
          />
        </GlobalHeader.Right>
      </GlobalHeader>
    </div>
  </div>
</template>
