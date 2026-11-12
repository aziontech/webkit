<script setup>
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
</script>

<template>
  <div>
    <Hero
      kind="screen"
      max-width="site"
      texture="dots"
    >
      <Hero.Title
        centered
        eyebrow="Infrastructure"
        eyebrow-prefix="//"
        title="A global network built for fast applications"
        description="Run closer to users with low-latency delivery and stable routing."
      />
    </Hero>

    <SectionContainer max-width="site">
      <SectionModule
        :divided="false"
        title="What you get"
        description="The first module opens on the band's own rule, so it draws no top edge of its own."
      >
        <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
      </SectionModule>

      <SectionModule
        title="How it works"
        description="Every module after the first draws the rule that divides it from the one above."
      >
        <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
      </SectionModule>
    </SectionContainer>
  </div>
</template>
