<script setup>
  import CliTerminalSection from '@aziontech/ui/cli-terminal-section'

  const primaryAction = {
    label: 'Install the CLI',
    href: 'https://www.azion.com/en/documentation/products/azion-cli/overview/',
    trailing: true
  }
</script>

<template>
  <CliTerminalSection
    anchor="cli"
    eyebrow="Azion CLI"
    title="Deploy your first function in two commands"
    description="Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion."
    script="deploy"
    :primary-action="primaryAction"
  />
</template>
