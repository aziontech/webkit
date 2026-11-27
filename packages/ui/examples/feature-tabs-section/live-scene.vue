<script setup>
  import FeatureTabsSection from '@aziontech/ui/feature-tabs-section'

  const tabs = [
    {
      value: 'agents',
      title: 'Ask your coding agent',
      description:
        'Describe the function and let the agent write it, run it locally and deploy it from the editor you already use.'
    },
    {
      value: 'console',
      title: 'Start from the console',
      description:
        'Pick a template, edit the code in the browser and publish it without installing anything.'
    },
    {
      value: 'cli',
      title: 'Ship from the terminal',
      description:
        'Link a project, build it on your machine and deploy it with one command that hands back the domain.'
    }
  ]
</script>

<template>
  <FeatureTabsSection
    eyebrow="Functions"
    title="Three ways to ship your first function"
    description="The same function, written and deployed from wherever you already work."
    :tabs="tabs"
    :scene="{ component: 'ConsoleMockup', props: { name: 'functions-start' } }"
    :autoplay-interval="6000"
  />
</template>
