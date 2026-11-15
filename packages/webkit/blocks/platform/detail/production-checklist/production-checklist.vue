<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  const open = ref(false)

  const steps = [
    {
      id: 'domain',
      icon: 'ai ai-globe',
      title: 'Add a custom domain',
      description:
        'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
      actionLabel: 'Add Domain',
      done: true,
      doneNote: 'Serving shop.example.com.'
    },
    {
      id: 'policy',
      icon: 'ai ai-shield',
      title: 'Enable a security policy',
      description:
        'Attach a policy so requests are inspected before they reach the service. Rate limiting, access rules, and IP allowlists.',
      actionLabel: 'Attach Policy',
      done: false,
      doneNote: ''
    },
    {
      id: 'customPage',
      icon: 'ai ai-file',
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
  <Card
    :padded="false"
    :data-complete="complete || null"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

        <Tag
          :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
          :severity="complete ? 'success' : 'neutral'"
          size="small"
          class="shrink-0"
        />
      </div>

      <Tooltip
        text="Expand"
        class="shrink-0"
      >
        <IconButton
          icon="ai ai-window-maximize"
          aria-label="Expand the production checklist"
          kind="outlined"
          size="small"
          @click="open = true"
        />
      </Tooltip>
    </template>

    <template #content>
      <div
        v-if="!complete"
        class="flex flex-col"
      >
        <div
          v-for="step in steps"
          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
          :data-done="step.done || null"
          class="group/step transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
        >
          <Item
            size="small"
            clickable
            @click="open = true"
          >
            <Item.Media>
              <i
                :class="step.icon"
                class="text-body-sm leading-none text-(--text-muted) group-data-done/step:text-(--primary)"
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
                class="ai ai-check text-body-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </Item>
        </div>
      </div>
    </template>
  </Card>

  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <DrawerTitle>Ship to production</DrawerTitle>
            <Tag
              :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
              :severity="complete ? 'success' : 'neutral'"
              size="small"
              class="shrink-0"
            />
          </div>
          <p class="text-body-sm text-(--text-muted)">
            This service is live on a generated hostname. These steps take it to production.
          </p>
        </div>
      </PanelHeader>

      <PanelContent>
        <div class="flex flex-col gap-(--spacing-sm)">
          <Item
            v-for="step in steps"
            :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
            size="medium"
            :data-done="step.done || null"
          >
            <Item.Media>
              <span
                class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                aria-hidden="true"
              >
                <i
                  :class="step.done ? 'ai ai-check' : step.icon"
                  class="text-body-sm leading-none"
                />
              </span>
            </Item.Media>

            <Item.Content>
              <Item.Title>
                {{ step.title }}
              </Item.Title>
              <Item.Description>
                {{ step.description }}
              </Item.Description>
            </Item.Content>

            <Item.Footer>
              <div
                v-if="step.done"
                class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
              >
                <Tag
                  icon="ai ai-check"
                  label="Done"
                  severity="neutral"
                  size="medium"
                />
                <span
                  v-if="step.doneNote"
                  class="min-w-0 text-body-sm text-(--text-muted)"
                  >{{ step.doneNote }}</span
                >
              </div>
              <Button
                v-else
                :label="step.actionLabel || step.title"
                kind="outlined"
                size="small"
                @click="open = false"
              />
            </Item.Footer>
          </Item>
        </div>
      </PanelContent>

      <PanelFooter>
        <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
          <Button
            label="Done"
            kind="primary"
            size="medium"
            @click="open = false"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
