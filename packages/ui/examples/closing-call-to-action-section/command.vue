<script setup>
  import ClosingCallToActionSection from '@aziontech/ui/closing-call-to-action-section'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <ClosingCallToActionSection
      variant="primary"
      anchor="contact"
      title="Start your first project from the terminal."
      description="One command scaffolds a project and deploys it to every data center."
      command="npm create azion@latest"
      :primary-action="{ label: 'Start for free', href: '/signup' }"
      :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    />
  </Container>
</template>
