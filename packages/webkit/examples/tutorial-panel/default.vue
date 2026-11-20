<script setup>
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import TutorialPanel from '@aziontech/webkit/tutorial-panel'
  import TutorialPanelHotspot from '@aziontech/webkit/tutorial-panel-hotspot'
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
              content: 'Select New service. The form opens below the list.',
              hotspotId: 'new-service'
            },
            {
              title: 'Name the service',
              content: 'Type a name your team will recognize, such as storefront-api.',
              hotspotId: 'service-name'
            }
          ]
        },
        {
          title: 'Publish it',
          steps: [
            {
              title: 'Deploy',
              content: 'Select Deploy. The service keeps deploying if you leave this page.',
              hotspotId: 'deploy'
            }
          ]
        }
      ]
    },
    {
      id: 'find-service',
      title: 'Find a service',
      description: 'One task, under a minute.',
      completed: true,
      tasks: [
        {
          title: 'Search the list',
          steps: [
            {
              title: 'Search by name',
              content: 'Type part of a name. The list filters as you type.',
              hotspotId: 'search'
            }
          ]
        }
      ]
    }
  ]

  const active = ref(null)
  const step = ref(0)
  const name = ref('')
  const query = ref('')
</script>

<template>
  <TutorialPanel.Provider
    v-model:active-key="active"
    v-model:step="step"
    :tutorials="tutorials"
  >
    <div class="@container flex w-full flex-wrap items-start gap-(--spacing-lg)">
      <main class="flex min-w-0 flex-1 basis-(--container-xs) flex-col gap-(--spacing-md)">
        <PageHeader
          title="Services"
          description="Everything your team runs, in one list."
        />
        <div class="flex flex-wrap items-center gap-(--spacing-xs)">
          <div class="min-w-0 flex-1">
            <TutorialPanelHotspot
              hotspot-id="search"
              class="w-full"
            >
              <Input
                v-model="query"
                aria-label="Search services"
                placeholder="Search services"
              />
            </TutorialPanelHotspot>
          </div>
          <TutorialPanelHotspot hotspot-id="new-service">
            <Button
              label="New service"
              icon="az az-plus"
              size="medium"
            />
          </TutorialPanelHotspot>
        </div>
        <section
          aria-labelledby="new-service-title"
          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
        >
          <h2
            id="new-service-title"
            class="text-heading-2xs text-(--text-default)"
          >
            New service
          </h2>
          <TutorialPanelHotspot hotspot-id="service-name">
            <Input
              v-model="name"
              aria-label="Service name"
              placeholder="storefront-api"
            />
          </TutorialPanelHotspot>
          <div class="flex justify-end">
            <TutorialPanelHotspot
              hotspot-id="deploy"
              side="start"
            >
              <Button
                label="Deploy"
                variant="primary"
                size="medium"
              />
            </TutorialPanelHotspot>
          </div>
        </section>
      </main>
      <div
        class="w-full rounded-(--shape-card) border border-(--border-default) @3xl:w-(--container-2xs)"
      >
        <TutorialPanel />
      </div>
    </div>
  </TutorialPanel.Provider>
</template>
