<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Footer from '@aziontech/webkit/footer'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import MenuGroup from '@aziontech/webkit/menu-group'
  import MenuItem from '@aziontech/webkit/menu-item'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { onBeforeUnmount, ref } from 'vue'

  const sections = ['Reference', 'Guides', 'Dev tools']
  const pages = [
    'Overview',
    'Getting started',
    'How it works',
    'Examples',
    'Reference',
    'Limits',
    'Best practices',
    'Troubleshooting'
  ]
  const outline = [
    'Overview',
    'Prerequisites',
    'Create the function',
    'Instantiate it in your application',
    'Verify the response',
    'Next steps'
  ]
  const theme = ref('dark')

  const columns = [
    {
      title: 'Products',
      links: [
        'Functions',
        'Cache',
        'Object Storage',
        'SQL Database',
        'WAF',
        'Edge DNS',
        'Data Stream'
      ]
    },
    {
      title: 'Solutions',
      links: [
        'Web Apps',
        'AI',
        'Application Security',
        'Financial Services',
        'Retail',
        'Technology'
      ]
    },
    {
      title: 'Developers',
      links: ['Docs', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
    },
    { title: 'Company', links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact'] }
  ]

  const socials = [
    { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
    {
      icon: 'pi pi-linkedin',
      label: 'Azion on LinkedIn',
      href: 'https://www.linkedin.com/company/aziontech'
    },
    {
      icon: 'pi pi-youtube',
      label: 'Azion on YouTube',
      href: 'https://www.youtube.com/aziontech'
    },
    { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
    {
      icon: 'pi pi-instagram',
      label: 'Azion on Instagram',
      href: 'https://www.instagram.com/aziontech'
    },
    { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
    { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
  ]

  const languages = ['EN', 'PT-BR', 'ES']
  const language = ref('EN')

  const lgProbe = document.createElement('span')
  lgProbe.className = 'hidden lg:block'
  document.body.append(lgProbe)
  const isLg = () => getComputedStyle(lgProbe).display !== 'none'
  const brandLeadsSocialRow = ref(isLg())
  const syncBrand = () => {
    brandLeadsSocialRow.value = isLg()
  }
  window.addEventListener('resize', syncBrand)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', syncBrand)
    lgProbe.remove()
  })
</script>

<template>
  <div class="flex h-screen min-h-0 w-full flex-col bg-(--bg-canvas) text-(--text-default)">
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

    <div class="relative flex min-h-0 flex-1">
      <aside class="hidden h-full w-(--container-2xs) shrink-0 lg:flex">
        <div class="flex w-full h-full">
          <Sidebar
            aria-label="Docs"
            class="w-full"
          >
            <template #footer>
              <ThemeSwitcher
                v-model:value="theme"
                aria-label="Theme"
              />
            </template>
            <MenuRoot role="presentation">
              <MenuGroup label="Functions">
                <MenuItem
                  v-for="page in pages"
                  :key="page"
                  :label="page"
                  :selected="page === 'Getting started'"
                  href="#"
                />
              </MenuGroup>
            </MenuRoot>
          </Sidebar>
        </div>
      </aside>

      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="flex flex-1">
          <ScrollArea class="w-full">
            <article
              class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-md) pt-(--spacing-md) pb-(--spacing-xxl)"
            >
              <p class="text-overline-sm uppercase text-(--text-muted)">Functions</p>
              <h1 class="text-heading-xl">Getting started</h1>
              <p class="text-body-md text-(--text-muted)">
                Create a function, instantiate it in an application, and verify the response from
                the edge.
              </p>
              <h2 class="pt-(--spacing-lg) text-heading-md">Create the function</h2>
              <p class="text-body-md text-(--text-muted)">
                Open Functions in the console, select Create Function, paste the handler below and
                save it.
              </p>
              <h2 class="pt-(--spacing-lg) text-heading-md">Instantiate it in your application</h2>
              <p class="text-body-md text-(--text-muted)">
                On the application's Functions tab, add an instance pointing at the function you
                just created.
              </p>
              <h2 class="pt-(--spacing-lg) text-heading-md">Verify the response</h2>
              <p class="text-body-md text-(--text-muted)">
                Request the domain and read the header the function sets.
              </p>
            </article>

            <div class="w-full border-t border-(--border-default)">
              <Footer
                kind="content"
                aria-label="Footer"
              >
                <Footer.Column
                  v-for="column in columns"
                  :key="column.title"
                  :title="column.title"
                >
                  <Footer.Link
                    v-for="link in column.links"
                    :key="link"
                    href="#"
                    >{{ link }}</Footer.Link
                  >
                </Footer.Column>

                <template #social>
                  <a
                    v-if="brandLeadsSocialRow"
                    href="#"
                    aria-label="Azion home"
                    class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) mr-(--spacing-xs)"
                  >
                    <Brand size="small" />
                  </a>
                  <IconButton
                    v-for="social in socials"
                    :key="social.label"
                    kind="transparent"
                    size="small"
                    :icon="social.icon"
                    :aria-label="social.label"
                    :href="social.href"
                    target="_blank"
                  />
                </template>

                <template #status>
                  <StatusIndicator
                    severity="success"
                    label="All Systems Operational"
                  />
                </template>

                <template #language>
                  <div class="w-28">
                    <Select
                      v-model="language"
                      placeholder="Language"
                    >
                      <Select.Trigger aria-label="Language">
                        <template #iconLeft>
                          <i
                            class="pi pi-globe text-(--text-muted)"
                            aria-hidden="true"
                          />
                        </template>
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Option
                          v-for="option in languages"
                          :key="option"
                          :value="option"
                        >
                          {{ option }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </div>
                </template>

                <template
                  v-if="!brandLeadsSocialRow"
                  #brand
                >
                  <a
                    href="#"
                    aria-label="Azion home"
                    class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) mx-auto"
                  >
                    <Brand size="small" />
                  </a>
                </template>
              </Footer>
            </div>
          </ScrollArea>
        </div>
      </main>

      <aside
        class="hidden w-(--container-3xs) shrink-0 flex-col gap-(--spacing-sm) border-l border-(--border-default) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg) xl:flex"
      >
        <p class="text-overline-sm uppercase text-(--text-muted)">On this page</p>
        <ul class="flex flex-col border-l border-(--border-default)">
          <li
            v-for="item in outline"
            :key="item"
          >
            <a
              href="#"
              class="block px-(--spacing-sm) py-(--spacing-xxs) text-label-md text-(--text-muted) hover:text-(--text-default)"
            >
              {{ item }}
            </a>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
