<script setup>
  import Button from '@aziontech/ui/button'
  import CallToAction from '@aziontech/ui/call-to-action'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-2xl)">
    <CallToAction
      eyebrow="Get started"
      title="Run your first application at the edge today."
      description="Deploy once and it runs in every location on the network."
    >
      <template #actions>
        <Button label="Start for free" />
        <Button
          variant="outline"
          label="Talk to sales"
        />
      </template>
    </CallToAction>

    <CallToAction
      variant="split"
      eyebrow="Build"
      title="Build once."
      title-muted="Run anywhere."
      description="Get a faster path to launch, less latency, and less infrastructure overhead."
    >
      <template #actions>
        <Button
          variant="secondary"
          label="Start for free"
        />
      </template>
      <template #aside>
        <Button
          variant="outline"
          label="Talk to our team"
        />
      </template>
    </CallToAction>

    <CallToAction
      variant="lead"
      eyebrow="Build"
      title="Built by you,"
      title-muted="or your agents."
      description="Same CLI, same docs over MCP, same deploy — whether you run it or your agent does."
    >
      <template #actions>
        <Button
          variant="secondary"
          label="Deploy now"
        />
        <Button
          variant="outline"
          label="Docs"
        />
      </template>
    </CallToAction>
  </div>
</template>
