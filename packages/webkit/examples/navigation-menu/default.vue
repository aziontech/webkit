<script setup>
  import Button from '@aziontech/webkit/button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
</script>

<template>
  <div class="min-h-screen bg-(--bg-canvas) text-(--text-default)">
    <header class="border-b border-solid border-(--border-default)">
      <div
        class="@container mx-auto w-full max-w-(--layout-measure-site) px-(--spacing-md) py-(--spacing-md) sm:px-(--spacing-lg)"
      >
        <NavigationMenu
          :delay="50"
          :close-delay="300"
          orientation="horizontal"
          aria-label="Acme"
          class="w-full min-w-0"
        >
          <div class="flex min-w-0 items-center gap-(--spacing-lg)">
            <NavigationMenu.List>
              <NavigationMenu.Item value="solutions">
                <NavigationMenu.Trigger> Solutions </NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-full">
                  <div class="grid grid-cols-1 gap-(--spacing-xl) p-(--spacing-xs) sm:grid-cols-2">
                    <NavigationMenu.List label="By use case">
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/solutions/application-development/"
                        description="Ship applications faster"
                        close-on-click
                      >
                        Application development
                      </NavigationMenu.Item>
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/solutions/performance/"
                        description="Speed up pages and content delivery"
                        close-on-click
                      >
                        Performance and reliability
                      </NavigationMenu.Item>
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/solutions/"
                        featured
                        close-on-click
                      >
                        See all solutions
                      </NavigationMenu.Item>
                    </NavigationMenu.List>
                    <NavigationMenu.List label="By industry">
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/solutions/retail/"
                        description="Keep stores fast through peak sales"
                        close-on-click
                      >
                        Retail and e-commerce
                      </NavigationMenu.Item>
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/solutions/financial-services/"
                        description="Protect transactions and customer data"
                        close-on-click
                      >
                        Financial services
                      </NavigationMenu.Item>
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/solutions/media/"
                        description="Stream live and on-demand video"
                        close-on-click
                      >
                        Media and entertainment
                      </NavigationMenu.Item>
                    </NavigationMenu.List>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item value="products">
                <NavigationMenu.Trigger> Products </NavigationMenu.Trigger>
                <NavigationMenu.Content class="w-full">
                  <div class="grid grid-cols-1 gap-(--spacing-xl) p-(--spacing-xs) sm:grid-cols-2">
                    <NavigationMenu.List label="Build">
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/products/functions/"
                        description="Run serverless functions"
                        close-on-click
                      >
                        <template #icon>
                          <i class="az az-functions" />
                        </template>
                        Functions
                      </NavigationMenu.Item>
                      <NavigationMenu.Item
                        layout="entry"
                        href="https://example.com/products/cache/"
                        description="Speed up content delivery"
                        close-on-click
                      >
                        <template #icon>
                          <i class="az az-cache" />
                        </template>
                        Cache
                      </NavigationMenu.Item>
                    </NavigationMenu.List>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>

              <NavigationMenu.Item>
                <NavigationMenu.Trigger href="https://example.com/pricing/">
                  Pricing
                </NavigationMenu.Trigger>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <div class="ms-auto hidden items-center gap-(--spacing-xs) @min-[24rem]:flex">
              <NavigationMenu.Trigger href="https://example.com/contact/">
                Contact
              </NavigationMenu.Trigger>
            </div>
          </div>

          <NavigationMenu.Viewport
            side="bottom"
            align="start"
            :side-offset="12"
            arrow
          />
        </NavigationMenu>
      </div>
    </header>

    <div
      class="mx-auto flex max-w-(--container-2xl) flex-col items-center px-(--spacing-lg) py-(--spacing-2xl) text-center"
    >
      <h1 class="text-heading-lg text-(--text-default)">Build applications that run at the edge</h1>
      <p class="mt-(--spacing-xl) text-body-sm text-(--text-muted)">
        Deploy, secure and observe your applications on one platform.
      </p>
      <div class="mt-(--spacing-2xl) flex flex-wrap justify-center gap-(--spacing-sm)">
        <Button label="Start for free" />
        <Button
          label="Talk to sales"
          variant="secondary"
        />
      </div>
    </div>
  </div>
</template>
