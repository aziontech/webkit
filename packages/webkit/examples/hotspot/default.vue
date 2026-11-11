<script setup>
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import { ref } from 'vue'

  const tutorials = [
    {
      id: 'publish',
      title: 'Publish a change',
      tasks: [
        {
          title: 'Review and deploy',
          steps: [
            {
              title: 'Preview the change',
              content: 'Open the preview to check the change before anyone else sees it.',
              hotspotId: 'preview'
            },
            {
              title: 'Deploy',
              content: 'Select Deploy to send the change to production.',
              hotspotId: 'deploy'
            }
          ]
        }
      ]
    }
  ]

  const active = ref('publish')
  const step = ref(0)
</script>

<template>
  <TutorialPanel.Provider
    v-model:active="active"
    v-model:step="step"
    :tutorials="tutorials"
  >
    <div class="flex min-h-(--container-3xs) flex-wrap items-start gap-(--spacing-sm)">
      <Hotspot hotspot-id="preview">
        <Button
          label="Preview"
          kind="outlined"
          size="medium"
        />
      </Hotspot>
      <Hotspot hotspot-id="deploy">
        <Button
          label="Deploy"
          kind="primary"
          size="medium"
        />
      </Hotspot>
    </div>
  </TutorialPanel.Provider>
</template>
