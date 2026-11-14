<script setup>
  import Hotspot from '@aziontech/webkit/hotspot'
  import Input from '@aziontech/webkit/input'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import { ref } from 'vue'

  const tutorials = [
    {
      id: 'name',
      title: 'Name your application',
      tasks: [
        {
          title: 'Set the details',
          steps: [
            {
              title: 'Type a name',
              content: 'Use a short name your team recognizes, such as acme-store.',
              hotspotId: 'name'
            },
            {
              title: 'Add a description',
              content: 'Say in one line what the application serves.',
              hotspotId: 'description'
            }
          ]
        }
      ]
    }
  ]

  const active = ref('name')
  const step = ref(0)
  const name = ref('')
  const description = ref('')
</script>

<template>
  <TutorialPanel.Provider
    v-model:active="active"
    v-model:step="step"
    :tutorials="tutorials"
  >
    <div class="flex min-h-(--container-3xs) max-w-(--container-sm) flex-col gap-(--spacing-md)">
      <Hotspot
        hotspot-id="name"
        side="start"
      >
        <Input
          v-model="name"
          aria-label="Name"
        />
      </Hotspot>
      <Hotspot hotspot-id="description">
        <Input
          v-model="description"
          aria-label="Description"
        />
      </Hotspot>
    </div>
  </TutorialPanel.Provider>
</template>
