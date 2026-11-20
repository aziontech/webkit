<script setup>
  import Container from '@aziontech/webkit/container'
  import Hero from '@aziontech/webkit/hero'
  import Module from '@aziontech/webkit/module'
</script>

<template>
  <div>
    <Hero
      variant="screen"
      max-width="site"
      texture="dots"
    >
      <Hero.Title
        align="center"
        eyebrow="Infrastructure"
        eyebrow-prefix="//"
        title="A global network built for fast applications"
        description="Run closer to users with low-latency delivery and stable routing."
      />
    </Hero>

    <Container max-width="site">
      <Module
        :divided="false"
        title="What you get"
        description="The first module opens on the band's own rule, so it draws no top edge of its own."
      >
        <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
      </Module>

      <Module
        title="How it works"
        description="Every module after the first draws the rule that divides it from the one above."
      >
        <p class="m-0 text-body-md text-(--text-muted)">Module body.</p>
      </Module>
    </Container>
  </div>
</template>
