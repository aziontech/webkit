<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import { ref } from 'vue'

  import ShellConsole from '../shell-console.vue'

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const helpOpen = ref(true)
</script>

<template>
  <ShellConsole
    v-model:tools-open="helpOpen"
    tools-label="Help"
    @sign-out="(event) => emit('sign-out', event)"
  >
    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Applications"
          description="Build, deploy, and manage your applications."
        >
          <template #meta>
            <ConsoleLayout.ToolsTrigger aria-label="Info about applications" />
          </template>
          <template #actions>
            <Button
              label="Documentation"
              aria-label="Documentation (opens in a new tab)"
              icon="az az-book"
              variant="outline"
              size="medium"
              href="https://example.com/docs/applications"
              target="_blank"
            />
            <Button
              label="Create Application"
              icon="az az-plus"
              variant="outline"
              size="medium"
            />
          </template>
        </PageHeader>

        <Card :padded="false">
          <div
            class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
          >
            The page body: view/view-table
          </div>
        </Card>
      </div>
    </div>

    <template #tools>
      <HelpPanel aria-label="Help: Applications">
        <HelpPanel.Header
          title="Applications"
          description="The code and rules that answer the requests to your domains."
        />
        <HelpPanel.Group label="What is an application?">
          <p>
            An application holds the rules, functions and cache settings that run for every request
            a workload sends to it.
          </p>
        </HelpPanel.Group>
        <HelpPanel.Group label="When do I create one?">
          <p>Create one for each site or API with its own behavior, then point a workload at it.</p>
        </HelpPanel.Group>
        <HelpPanel.Footer>
          <Link
            label="Applications documentation"
            href="https://example.com/docs/applications"
            target="_blank"
          />
        </HelpPanel.Footer>
      </HelpPanel>
    </template>
  </ShellConsole>
</template>
