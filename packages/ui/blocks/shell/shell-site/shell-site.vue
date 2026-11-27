<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Container from '@aziontech/ui/container'
  import Hero from '@aziontech/ui/hero'
  import Module from '@aziontech/ui/module'
  import RegistrationFrame from '@aziontech/ui/registration-frame'
  import SiteLayout, {
    type SiteLayoutFooter,
    type SiteLayoutNavigation
  } from '@aziontech/ui/site-layout'
  import Spacer from '@aziontech/ui/spacer'
  import Stats from '@aziontech/ui/stats'
  import Texture from '@aziontech/ui/texture'

  import { sampleFigures, sampleFooter, sampleNavigation } from './sample'

  export interface ShellSiteProps {
    /** The header's menus and actions. Left out, the sample azion.com navigation renders. */
    navigation?: SiteLayoutNavigation
    /** The footer's columns, socials and status line. Left out, the sample footer renders. */
    footer?: SiteLayoutFooter
  }

  withDefaults(defineProps<ShellSiteProps>(), {
    navigation: () => sampleNavigation,
    footer: () => sampleFooter
  })

  defineSlots<{
    /** The page's sections: the route's view; a sample landing page stands in for RouterView. */
    default(): unknown
  }>()
</script>

<template>
  <SiteLayout
    :navigation="navigation"
    :footer="footer"
    search-placeholder="Search azion.com"
  >
    <slot>
      <Hero
        variant="band"
        size="large"
        max-width="site"
      >
        <Hero.Title
          :align="'center'"
          eyebrow="Functions"
          eyebrow-prefix="//"
          title="Run serverless code at the edge"
          description="Functions execute on 100+ data centers worldwide, with no servers to provision and nothing to scale by hand."
        >
          <template #actions>
            <Button
              label="Start for free"
              variant="primary"
              size="large"
              href="https://console.azion.com/signup"
            />
            <Button
              label="Talk to sales"
              variant="outline"
              size="large"
              href="/en/contact/"
            />
          </template>
        </Hero.Title>
      </Hero>

      <Container max-width="site">
        <Spacer hatch />

        <Module
          :divided="false"
          :padded="false"
        >
          <RegistrationFrame
            flush
            borders="y"
            marks="bottom"
          >
            <Stats :items="sampleFigures" />
          </RegistrationFrame>
        </Module>

        <Spacer hatch />

        <RegistrationFrame
          borders="none"
          marks="all"
          data-hatch="true"
          class="h-[calc(var(--spacing-2xl)*2)]"
        >
          <Texture variant="lines" />
        </RegistrationFrame>
      </Container>
    </slot>
  </SiteLayout>
</template>
