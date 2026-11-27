<script setup>
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import DialogTrigger from '@aziontech/ui/dialog-trigger'
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
    },
    { name: 'Firewall', value: 'Runs the Acme production firewall before every request.' },
    {
      name: 'Rate limit',
      value: 'Blocks a client that sends more than 100 requests in 10 seconds.'
    },
    { name: 'Geo blocking', value: 'Allows traffic from every country.' },
    { name: 'Access logs', value: 'Streams every request to the acme-logs data stream.' },
    { name: 'Custom error pages', value: 'Shows custom pages for 404 and 500 responses.' },
    { name: 'Maintenance mode', value: 'Off: the domain serves the live application.' }
  ]
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Edit domain settings"
        variant="primary"
      />
    </DialogTrigger>
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Domain settings</DialogTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DialogDescription>Changes apply to new requests within a few minutes.</DialogDescription>
          <dl class="m-0 flex flex-col gap-(--spacing-sm)">
            <div
              v-for="setting in settings"
              :key="setting.name"
              class="flex flex-col gap-(--spacing-2xs)"
            >
              <dt class="text-label-md text-(--text-default)">{{ setting.name }}</dt>
              <dd class="m-0 text-body-sm text-(--text-muted)">{{ setting.value }}</dd>
            </div>
          </dl>
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
    </DialogContent>
  </Dialog>
</template>
