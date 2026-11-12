<script setup>
  import Button from '@aziontech/webkit/button'
  import Hotspot from '@aziontech/webkit/hotspot'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
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
    v-model:active="active"
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
            <Hotspot
              hotspot-id="search"
              class="w-full"
            >
              <Input
                v-model="query"
                aria-label="Search services"
                placeholder="Search services"
              />
            </Hotspot>
          </div>
          <Hotspot hotspot-id="new-service">
            <Button
              label="New service"
              icon="pi pi-plus"
              size="medium"
            />
          </Hotspot>
        </div>
        <section
          aria-labelledby="new-service-title"
          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
        >
          <h2
            id="new-service-title"
            class="text-heading-xxs text-(--text-default)"
          >
            New service
          </h2>
          <Hotspot hotspot-id="service-name">
            <Input
              v-model="name"
              aria-label="Service name"
              placeholder="storefront-api"
            />
          </Hotspot>
          <div class="flex justify-end">
            <Hotspot
              hotspot-id="deploy"
              side="start"
            >
              <Button
                label="Deploy"
                kind="primary"
                size="medium"
              />
            </Hotspot>
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
