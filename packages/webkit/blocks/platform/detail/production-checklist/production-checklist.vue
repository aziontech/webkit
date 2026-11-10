<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  const steps = [
    {
      id: 'domain',
      icon: 'pi pi-globe',
      title: 'Add a custom domain',
      description:
        'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
      actionLabel: 'Add Domain',
      done: true,
      doneNote: 'Serving shop.example.com.'
    },
    {
      id: 'policy',
      icon: 'pi pi-shield',
      title: 'Enable a security policy',
      description:
        'Attach a policy so requests are inspected before they reach the service. Rate limiting, access rules, and IP allowlists.',
      actionLabel: 'Attach Policy',
      done: false,
      doneNote: ''
    },
    {
      id: 'customPage',
      icon: 'pi pi-file',
      title: 'Set custom error pages',
      description: 'Answer 4xx and 5xx with your own page instead of the default response.',
      actionLabel: 'Add Error Page',
      done: false,
      doneNote: ''
    }
  ]

  const doneCount = computed(() => steps.filter((step) => step.done).length)
  const complete = computed(() => steps.length > 0 && doneCount.value === steps.length)
</script>

<template>
  <CardBox
    :padded="false"
    :data-complete="complete || null"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

        <Tag
          :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
          :severity="complete ? 'success' : 'secondary'"
          size="small"
          class="shrink-0"
        />
      </div>

      <IconButton
        icon="pi pi-window-maximize"
        aria-label="Expand the production checklist"
        kind="outlined"
        size="small"
        class="shrink-0"
      />
    </template>

    <template #content>
      <div
        v-if="!complete"
        class="flex flex-col"
      >
        <Item
          v-for="step in steps"
          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
          as-child
          size="small"
        >
          <button
            type="button"
            :data-done="step.done || null"
            class="w-full rounded-none text-left transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
          >
            <Item.Media>
              <i
                :class="step.icon"
                class="text-body-sm leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
                aria-hidden="true"
              />
            </Item.Media>

            <Item.Content>
              <Item.Title>
                {{ step.title }}
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <i
                v-if="step.done"
                class="pi pi-check text-body-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </button>
        </Item>
      </div>
    </template>
  </CardBox>
</template>
