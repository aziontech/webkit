<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Hint from '@aziontech/webkit/hint'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const defaultFeatures = [
    {
      key: 'compression',
      title: 'Compression',
      description: 'Compress text responses with gzip or Brotli.'
    },
    {
      key: 'cache',
      title: 'Cache',
      description: 'Customize advanced cache settings.'
    },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Expose device variables to configure responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on each request before it reaches the origin.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image resizing and format conversion.'
    },
    {
      key: 'load_balancer',
      title: 'Load Balancer',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]

  const name = ref('web-app')
  const active = ref(true)
  const features = ref({
    compression: true,
    cache: true,
    device_detection: false,
    custom_code: true,
    image_optimization: false,
    load_balancer: false
  })

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
            aria-label="Copy link to the General section"
            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
            @click="copyAnchor('general')"
          >
            <i
              class="pi pi-link text-body-xs"
              aria-hidden="true"
            />
          </button>
          <h2
            id="general"
            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
          >
            <span class="flex items-center gap-(--spacing-xs)"> General </span>
          </h2>
          <Hint
            text="How this resource is identified, and whether it is serving traffic."
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
                      <Item.Title>Name</Item.Title>
                      <Item.Description
                        >A unique and descriptive name to identify the resource.</Item.Description
                      >
                    </Item.Content>
                    <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                      <Item.Actions class="w-full">
                        <InputText
                          v-model="name"
                          size="large"
                          class="w-full"
                          aria-label="Name"
                        />
                      </Item.Actions>
                    </div>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Active</Item.Title>
                      <Item.Description
                        >When disabled, the resource stops serving traffic.</Item.Description
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
            </CardBox>
          </div>
        </div>
      </div>
    </section>
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
            aria-label="Copy link to the Features section"
            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
            @click="copyAnchor('features')"
          >
            <i
              class="pi pi-link text-body-xs"
              aria-hidden="true"
            />
          </button>
          <h2
            id="features"
            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
          >
            <span class="flex items-center gap-(--spacing-xs)"> Features </span>
          </h2>
          <Hint
            text="The capabilities this resource runs with, each of which can be toggled here."
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
                  <Item
                    v-for="feature in defaultFeatures"
                    :key="feature.key"
                    size="small"
                  >
                    <Item.Content>
                      <Item.Title>{{ feature.title }}</Item.Title>
                      <Item.Description>{{ feature.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions>
                      <Switch
                        v-model="features[feature.key]"
                        :aria-label="feature.title"
                      />
                    </Item.Actions>
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
