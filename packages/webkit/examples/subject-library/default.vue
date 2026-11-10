<script setup>
  import SubjectLibrary from '@aziontech/webkit/subject-library'
</script>

<template>
  <SubjectLibrary
    anchor="subjects"
    :subjects="[
      {
        slug: 'bots',
        title: 'Bots',
        description:
          'Bots are automated software programs that perform repetitive tasks on websites and applications.',
        articles: [
          {
            label: 'What is a Bot?',
            href: 'https://www.azion.com/en/learning/bots/what-is-a-bot/'
          },
          {
            label: 'What is Bot Management?',
            href: 'https://www.azion.com/en/learning/bots/what-is-bot-management/'
          }
        ]
      },
      {
        slug: 'cdn',
        title: 'CDN',
        description: 'Reduce latency by caching static content on servers close to the user.',
        articles: [
          { label: 'What is a CDN?', href: 'https://www.azion.com/en/learning/cdn/what-is-a-cdn/' },
          {
            label: 'What is Caching?',
            href: 'https://www.azion.com/en/learning/cdn/what-is-caching/'
          }
        ]
      }
    ]"
    :closing="{
      eyebrow: 'Next step',
      title: 'Put what you learned to work.',
      titleMuted: 'On Azion.',
      description:
        'Deploy your first application in minutes, or talk to an expert about your architecture.',
      primaryAction: { label: 'Start for free', href: '/signup' },
      secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true }
    }"
  />
</template>
