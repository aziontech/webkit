<script setup>
  import Button from '@aziontech/webkit/button'
  import HeroTitle from '@aziontech/webkit/hero-title'
</script>

<template>
  <HeroTitle
    :mobile-align="'center'"
    eyebrow="Application Performance and Reliability"
    eyebrow-prefix="//"
    title="Make your applications fast and always reliable"
    description="Serve websites, web apps, and APIs from Azion's globally distributed infrastructure."
  >
    <template #actions>
      <Button
        variant="secondary"
        label="Start for free"
      />
      <Button
        variant="outline"
        label="Talk to sales"
      />
    </template>
  </HeroTitle>
</template>
