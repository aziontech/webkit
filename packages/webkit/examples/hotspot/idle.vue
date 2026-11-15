<script setup>
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'

  const tutorials = [
    {
      id: 'publish',
      title: 'Publish a change',
      tasks: [
        {
          title: 'Review and deploy',
          steps: [
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
</script>

<template>
  <TutorialPanel.Provider :tutorials="tutorials">
    <div class="flex flex-wrap items-start gap-(--spacing-sm)">
      <Hotspot hotspot-id="deploy">
        <Button
          label="Deploy"
          variant="primary"
          size="medium"
        />
      </Hotspot>
    </div>
  </TutorialPanel.Provider>
</template>
