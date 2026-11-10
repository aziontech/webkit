<script setup>
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="max-w-(--container-xs)">
    <HelpPanel aria-label="Help: Get started">
      <HelpPanel.Header
        title="Get started"
        description="Put your first site online."
      />
      <HelpPanel.Tutorial
        title="Put your first site online"
        description="Three tasks, about five minutes."
      >
        <HelpPanel.Task
          title="Create an application"
          status="complete"
        >
          Choose a template or start from an empty application.
        </HelpPanel.Task>
        <HelpPanel.Task
          title="Create a workload"
          status="current"
        >
          Bind your domain to the application you just created.
        </HelpPanel.Task>
        <HelpPanel.Task title="Point your DNS">
          Add the CNAME record shown on the workload page.
        </HelpPanel.Task>
        <template #actions>
          <Button
            label="Continue"
            size="medium"
          />
        </template>
      </HelpPanel.Tutorial>
    </HelpPanel>
  </div>
</template>
