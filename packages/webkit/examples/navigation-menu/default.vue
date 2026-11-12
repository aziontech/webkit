<script setup>
  import Button from '@aziontech/webkit/button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
</script>

<template>
  <div class="min-h-screen bg-(--bg-canvas) text-(--text-default)">
    <header class="border-b border-solid border-(--border-default)">
      <div
        class="mx-auto flex w-full max-w-(--container-xl) flex-wrap items-center gap-(--spacing-6) px-(--spacing-6) py-(--spacing-4)"
      >
        <NavigationMenu
          :delay="50"
          :close-delay="300"
          orientation="horizontal"
          aria-label="Azion"
        >
          <NavigationMenu.List>
            <NavigationMenu.Item value="solucoes">
              <NavigationMenu.Trigger>
                Soluções
                <NavigationMenu.Icon>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content class="w-full">
                <div class="grid grid-cols-2 gap-(--spacing-6) p-(--spacing-2)">
                  <NavigationMenu.List label="Por Caso de Uso">
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/solucoes/desenvolvimento-de-aplicacoes/"
                      description="Acelere o desenvolvimento de aplicações"
                      close-on-click
                    >
                      Desenvolvimento de Aplicações
                    </NavigationMenu.Item>
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/solucoes/performance-e-confiabilidade/"
                      description="Otimize performance e entrega de conteúdo"
                      close-on-click
                    >
                      Performance e Confiabilidade
                    </NavigationMenu.Item>
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/solucoes/"
                      featured
                      close-on-click
                    >
                      Ver todas as soluções
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="produtos">
              <NavigationMenu.Trigger>
                Produtos
                <NavigationMenu.Icon>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content class="w-full">
                <div class="grid grid-cols-2 gap-(--spacing-6) p-(--spacing-2)">
                  <NavigationMenu.List label="Construir">
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/produtos/functions/"
                      description="Implemente funções serverless"
                      close-on-click
                    >
                      <template #icon>
                        <i class="ai ai-edge-functions" />
                      </template>
                      Functions
                    </NavigationMenu.Item>
                    <NavigationMenu.Item
                      layout="entry"
                      href="https://www.azion.com/pt-br/produtos/cache/"
                      description="Acelere a entrega de conteúdo"
                      close-on-click
                    >
                      <template #icon>
                        <i class="ai ai-tiered-cache" />
                      </template>
                      Cache
                    </NavigationMenu.Item>
                  </NavigationMenu.List>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavigationMenu.Trigger href="https://www.azion.com/pt-br/precos/">
                Preços
              </NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <div class="ms-auto flex items-center gap-(--spacing-2)">
            <NavigationMenu.Trigger href="https://www.azion.com/pt-br/contato-vendas/">
              Contato
            </NavigationMenu.Trigger>
          </div>

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
    </header>

    <div
      class="mx-auto flex max-w-2xl flex-col items-center px-(--spacing-6) py-(--spacing-24) text-center"
    >
      <h1 class="text-heading-lg text-(--text-default)">Navigation menu demo</h1>
      <p class="mt-(--spacing-6) text-body-sm text-(--text-muted)">
        Hover top-level items to open panels. Keyboard: arrows, Enter, Escape.
      </p>
      <div class="mt-(--spacing-10) flex flex-wrap justify-center gap-(--spacing-3)">
        <Button label="Primary action" />
        <Button
          label="Secondary"
          kind="secondary"
        />
      </div>
    </div>
  </div>
</template>
