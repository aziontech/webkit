<script setup>
  import Faq from '@aziontech/webkit/faq'
</script>

<template>
  <Faq
    title="Frequently asked questions"
    :items="[
      {
        value: 'pricing',
        question: 'How does pricing work?',
        answer:
          'You pay for what you use — requests, data transfer and compute time — with no seats and no upfront commitment. Usage is metered and billed monthly.'
      },
      {
        value: 'free-tier',
        question: 'Is there a free tier?',
        answer:
          'Yes. Every core product has a monthly free allowance, and billing starts only once you pass it.'
      },
      {
        value: 'migration',
        question: 'How much work is it to migrate?',
        answer:
          'Most teams move a first workload in a day. Point the domain at us, keep the origin where it is, and cut traffic over once the numbers look right.'
      },
      {
        value: 'compliance',
        question: 'Where does my data run, and are you compliant?',
        answer:
          'You choose the regions a workload and its data are allowed in. Current audit reports and certifications are available on request.'
      },
      {
        value: 'support',
        question: 'What support do I get?',
        answer:
          'Every account has documentation, community and email support. Paid plans add a 24/7 incident channel and a named engineer.'
      }
    ]"
  />
</template>
