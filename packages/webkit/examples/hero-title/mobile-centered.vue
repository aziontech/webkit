<script setup>
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <HeroTitle
    mobile-centered
    eyebrow="Application Performance and Reliability"
    eyebrow-prefix="//"
    title="Make your applications fast and always reliable"
    description="Serve websites, web apps, and APIs from Azion's globally distributed infrastructure."
  >
    <template #actions>
      <Button
        kind="secondary"
        label="Start for free"
      />
      <Button
        kind="outlined"
        label="Talk to a specialist"
      />
    </template>
  </HeroTitle>
</template>
