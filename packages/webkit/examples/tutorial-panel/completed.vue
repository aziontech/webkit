<script setup>
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import { ref } from 'vue'

  const tutorials = [
    {
      id: 'first-service',
      title: 'Create your first service',
      description: 'Two tasks, about three minutes.',
      tasks: [
        {
          title: 'Create a service',
          steps: [
            {
              title: 'Start a new service',
              content: 'Select New service.',
              hotspotId: 'new-service'
            },
            {
              title: 'Name the service',
              content: 'Type a name your team will recognize.',
              hotspotId: 'service-name'
            }
          ]
        },
        {
          title: 'Publish it',
          steps: [{ title: 'Deploy', content: 'Select Deploy.', hotspotId: 'deploy' }]
        }
      ]
    }
  ]

  const active = ref('first-service')
  const step = ref(3)
</script>

<template>
  <div class="max-w-(--container-xs) rounded-(--shape-card) border border-(--border-default)">
    <TutorialPanel.Provider
      v-model:active="active"
      v-model:step="step"
      :tutorials="tutorials"
    >
      <TutorialPanel>
        <template #completion>
          <a
            href="#feedback"
            class="text-link w-fit"
          >
            Tell us how this tutorial went
          </a>
        </template>
      </TutorialPanel>
    </TutorialPanel.Provider>
  </div>
</template>
