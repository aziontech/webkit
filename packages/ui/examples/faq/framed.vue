<script setup>
  import Faq from '@aziontech/webkit/faq'
</script>

<template>
  <Faq
    title="Billing questions"
    framed
    :items="[
      {
        value: 'invoice',
        question: 'When is the invoice issued?',
        answer: 'On the first day of each month, for the usage of the month before.'
      },
      {
        value: 'currency',
        question: 'Which currency is it billed in?',
        answer: 'Every account is billed in USD.'
      },
      {
        value: 'cancel',
        question: 'Can I cancel at any time?',
        answer: 'Yes. Usage stops being metered the moment the last workload is deleted.'
      }
    ]"
  />
</template>
