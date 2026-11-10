<script setup>
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Footer from '@aziontech/webkit/footer'
  import FrameBox from '@aziontech/webkit/frame-box'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Hero from '@aziontech/webkit/hero'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { onBeforeUnmount, ref } from 'vue'

  const links = ['Solutions', 'Products', 'Developer', 'Resources', 'Pricing']
  const figures = [
    { value: '100', suffix: 'ms', label: 'Median response, worldwide' },
    { value: '24', suffix: '/7', label: 'Support on every plan' },
    { value: '99.99', suffix: '%', label: 'Availability, contractual' }
  ]

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
  <div class="flex min-h-screen w-full flex-col bg-(--bg-canvas) text-(--text-default)">
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
          <div class="flex w-full min-w-0 items-center justify-start">
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

    <main class="flex-1">
      <Hero
        kind="band"
        size="large"
        max-width="site"
      >
        <Hero.Title
          centered
          eyebrow="Functions"
          eyebrow-prefix="//"
          title="Run serverless code at the edge"
          description="Functions execute on 100+ data centers worldwide, with no servers to provision and nothing to scale by hand."
        >
          <template #actions>
            <Button
              label="Start for Free"
              kind="primary"
              size="large"
              href="#"
            />
            <Button
              label="Talk to a specialist"
              kind="outlined"
              size="large"
              href="#"
            />
          </template>
        </Hero.Title>
      </Hero>

      <SectionContainer max-width="site">
        <SectionGap hatch />

        <SectionModule
          :divided="false"
          :padded="false"
        >
          <FrameBox
            flush
            borders="y"
            marks="bottom"
          >
            <BigNumbers :items="figures" />
          </FrameBox>
        </SectionModule>

        <SectionGap hatch />

        <FrameBox
          borders="none"
          marks="all"
          data-hatch="true"
          class="h-[calc(var(--spacing-xxl)*2)]"
        >
          <TextureMaterial kind="lines" />
        </FrameBox>
      </SectionContainer>
    </main>

    <div class="w-full border-t border-(--border-default)">
      <Footer
        kind="site"
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
  </div>
</template>
