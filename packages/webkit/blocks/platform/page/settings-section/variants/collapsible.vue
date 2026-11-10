<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const open = ref(false)
  const active = ref(true)
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <section
      data-stacked
      class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
    >
      <div
        data-stacked
        class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
      >
        <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
          <h2 class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
            <button
              type="button"
              :aria-expanded="open"
              aria-controls="advanced-region"
              :data-state="open ? 'open' : 'closed'"
              class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              @click="open = !open"
            >
              <i
                class="pi pi-cog shrink-0 text-body-sm leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              Advanced
              <i
                class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </button>
          </h2>
        </div>
      </div>

      <div
        id="advanced-region"
        :data-open="open || null"
        :inert="!open || undefined"
        :aria-hidden="!open || undefined"
        class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div
          data-collapsible
          class="min-w-0 data-collapsible:overflow-hidden"
        >
          <div
            :data-open="open || null"
            class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
          >
            <Card :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Active</Item.Title>
                      <Item.Description
                        >Inactive teams keep their permissions but can't be
                        assigned.</Item.Description
                      >
                    </Item.Content>
                    <Item.Actions>
                      <Switch
                        v-model="active"
                        aria-label="Active"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
