<script setup>
  import Button from '@aziontech/webkit/button'
  import Hero from '@aziontech/webkit/hero'
</script>

<template>
  <Hero max-width="7xl">
    <Hero.Title
      align="center"
      eyebrow="Infrastructure"
      eyebrow-prefix="//"
      title="A global network built for fast applications"
      description="Run closer to users with low-latency delivery and stable routing."
    >
      <template #actions>
        <Button
          label="Start for free"
          href="https://console.azion.com/signup"
        />
        <Button
          variant="outline"
          label="Talk to sales"
          href="https://www.azion.com/en/contact-sales/"
        />
      </template>
    </Hero.Title>
  </Hero>
</template>
