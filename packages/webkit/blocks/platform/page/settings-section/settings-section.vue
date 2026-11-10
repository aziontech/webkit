<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const fonts = [
    { label: 'Rubik (Default)', value: 'rubik' },
    { label: 'Rubik', value: 'rubik' },
    { label: 'Inter', value: 'inter' },
    { label: 'IBM Plex Sans', value: 'ibm-plex-sans' },
    { label: 'Geist', value: 'geist' },
    { label: 'Roboto', value: 'roboto' },
    { label: 'Work Sans', value: 'work-sans' },
    { label: 'Instrument Sans', value: 'instrument-sans' },
    { label: 'Hedvig Letters Sans', value: 'hedvig-letters-sans' }
  ]

  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]

  const font = ref('rubik')
  const theme = ref('system')

  const copyAnchor = (id) =>
    globalThis.navigator?.clipboard?.writeText(`${globalThis.location.href.split('#')[0]}#${id}`)
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
          <button
            type="button"
            aria-label="Copy link to the Appearance section"
            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
            @click="copyAnchor('appearance')"
          >
            <i
              class="pi pi-link text-body-xs"
              aria-hidden="true"
            />
          </button>
          <h2
            id="appearance"
            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
          >
            <span class="flex items-center gap-(--spacing-xs)"> Appearance </span>
          </h2>
          <Hint
            text="Preferences for this browser, applied the moment you change them and not part of Save."
            class="shrink-0"
          />
        </div>
      </div>

      <div
        data-open
        class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div class="min-w-0 data-collapsible:overflow-hidden">
          <div
            data-open
            class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Font family</Item.Title>
                      <Item.Description
                        >The primary sans typeface across the interface.</Item.Description
                      >
                    </Item.Content>
                    <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                      <Item.Actions class="w-full">
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <Select
                            v-model="font"
                            size="large"
                            :display-value="
                              (value) => fonts.find((option) => option.value === value)?.label ?? ''
                            "
                          >
                            <Select.Trigger
                              class="w-full"
                              aria-label="Font family"
                            />
                            <Select.Content>
                              <Select.Option
                                v-for="option in fonts"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </div>
                      </Item.Actions>
                    </div>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>System appearance</Item.Title>
                      <Item.Description
                        >Follow the operating system, or force a light or dark
                        theme.</Item.Description
                      >
                    </Item.Content>
                    <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                      <Item.Actions class="w-full">
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <Select
                            v-model="theme"
                            size="large"
                            :display-value="
                              (value) =>
                                appearances.find((option) => option.value === value)?.label ?? ''
                            "
                          >
                            <Select.Trigger
                              class="w-full"
                              aria-label="System appearance"
                            />
                            <Select.Content>
                              <Select.Option
                                v-for="option in appearances"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </div>
                      </Item.Actions>
                    </div>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
