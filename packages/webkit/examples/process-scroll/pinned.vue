<script setup>
  import ProcessScroll from '@aziontech/webkit/process-scroll'

  const steps = [
    { title: 'Role request', description: 'A hiring manager requests a new role.' },
    {
      title: 'Scope and posting',
      description: 'People and the hiring manager scope the role and publish the opening.'
    },
    {
      title: 'Recruiting and interviews',
      description: 'Candidates meet the team in technical and culture interviews.'
    },
    { title: 'Calibration', description: 'The panel compares notes and decides together.' },
    { title: 'Offer letter', description: 'The chosen candidate receives the offer.' }
  ]
</script>

<template>
  <ProcessScroll
    pinned
    title-kind="centered"
    title="Hiring process"
    description="Every role goes through the same five stages, from the first request to the offer."
    :steps="steps"
  />
</template>
