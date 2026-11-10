<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const open = ref(false)

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
        @click="open = true"
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

  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <DrawerTitle>Ship to production</DrawerTitle>
              <Tag
                :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
                :severity="complete ? 'success' : 'secondary'"
                size="small"
                class="shrink-0"
              />
            </div>
            <p class="text-body-sm text-(--text-muted)">
              The create put this service live on a generated hostname. These are the gates between
              that and production.
            </p>
          </div>
          <DrawerClose />
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
                    :class="step.done ? 'pi pi-check' : step.icon"
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
                <Tag
                  v-if="step.done"
                  icon="pi pi-check"
                  :label="step.doneNote || 'Done'"
                  severity="secondary"
                  size="medium"
                />
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
    </DrawerPortal>
  </Drawer>
</template>
