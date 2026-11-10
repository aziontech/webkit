<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import CliTerminal from '@aziontech/webkit/cli-terminal'

  const session =
    'azion link --preset javascript --name auth-handler --auto\n# Project successfully configured\n\nazion deploy --auto\n# Upload completed successfully!\n# Your Application was deployed successfully\n# Domain: https://k7q2fmx4ze.map.azionedge.net\n\ncurl https://k7q2fmx4ze.map.azionedge.net/\n# Hello World'

  const primaryAction = {
    label: 'Install the CLI',
    href: 'https://www.azion.com/en/documentation/products/azion-cli/overview/',
    trailing: true
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <CliTerminal
      eyebrow="Azion CLI"
      title="Deploy your first function in two commands"
      description="Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion."
      :session="session"
      copy-aria-label="Copy the deploy session"
      :primary-action="primaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
