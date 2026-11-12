<script setup>
  import CallToAction from '@aziontech/webkit/call-to-action'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <CallToAction
      eyebrow="Get started"
      title="Run your first application at the edge today."
      description="Deploy once and it runs in every location on the network."
    >
      <template #actions>
        <Button label="Start for free" />
        <Button
          kind="outlined"
          label="Talk to a specialist"
        />
      </template>
    </CallToAction>

    <CallToAction
      kind="split"
      eyebrow="Build"
      title="Build once."
      title-muted="Run anywhere."
      description="Get a faster path to launch, less latency, and less infrastructure overhead."
    >
      <template #actions>
        <Button
          kind="secondary"
          label="Start for free"
        />
      </template>
      <template #aside>
        <Button
          kind="outlined"
          label="Talk to our team"
        />
      </template>
    </CallToAction>

    <CallToAction
      kind="lead"
      eyebrow="Build"
      title="Built by you,"
      title-muted="or your agents."
      description="Same CLI, same docs over MCP, same deploy — whether you run it or your agent does."
    >
      <template #actions>
        <Button
          kind="secondary"
          label="Deploy now"
        />
        <Button
          kind="outlined"
          label="Docs"
        />
      </template>
    </CallToAction>
  </div>
</template>
