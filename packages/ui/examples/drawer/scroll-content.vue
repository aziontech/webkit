<script setup>
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import DrawerTrigger from '@aziontech/ui/drawer-trigger'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { ref } from 'vue'

  const open = ref(false)
  const settings = [
    {
      name: 'HTTPS redirect',
      value: 'Sends every HTTP request to the HTTPS address of the domain.'
    },
    {
      name: 'Minimum TLS version',
      value: 'Rejects clients that only speak a TLS version older than 1.2.'
    },
    { name: 'HTTP/3', value: 'Lets browsers that support QUIC open faster connections.' },
    { name: 'Certificate', value: 'Uses the managed certificate issued for shop.example.com.' },
    {
      name: 'Default cache TTL',
      value: 'Keeps a response on the edge for one hour when the origin sends no cache header.'
    },
    { name: 'Browser cache TTL', value: 'Tells browsers to keep static files for one day.' },
    {
      name: 'Query string in cache key',
      value: 'Caches each query string as a separate copy of the page.'
    },
    {
      name: 'Compression',
      value: 'Compresses text responses with Brotli, or gzip for older clients.'
    },
    {
      name: 'Image optimization',
      value: 'Resizes and converts images to WebP on the first request.'
    },
    {
      name: 'Origin timeout',
      value: 'Gives the origin 30 seconds to answer before the edge returns an error.'
    },
    {
      name: 'Origin host header',
      value: 'Sends origin.example.com as the Host header to the origin.'
    },
    {
      name: 'Retries',
      value: 'Tries the origin once more when the first attempt fails to connect.'
    }
  ]
</script>

<template>
  <Drawer
    v-model:open="open"
    dismissible
    side="end"
    size="large"
  >
    <DrawerTrigger>
      <Button
        label="Edit domain settings"
        variant="primary"
      />
    </DrawerTrigger>
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Domain settings</DrawerTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DrawerDescription>
            Changes apply to new requests on shop.example.com within a few minutes.
          </DrawerDescription>
          <section
            v-for="setting in settings"
            :key="setting.name"
            class="flex flex-col gap-(--spacing-xs) rounded-(--shape-control) border border-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
          >
            <h3 class="m-0 text-body-md text-(--text-default)">{{ setting.name }}</h3>
            <p class="m-0 text-body-sm text-(--text-muted)">{{ setting.value }}</p>
          </section>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Save"
            variant="primary"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
