<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const language = ref('en')
  const languageOptions = [
    { value: 'en', label: 'EN' },
    { value: 'pt-br', label: 'PT-BR' },
    { value: 'es', label: 'ES' }
  ]
</script>

<template>
  <Footer
    kind="site"
    aria-label="Footer"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
      <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
      <Footer.Link href="/products/edge-storage">Edge Storage</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Developers">
      <Footer.Link href="/documentation">Docs</Footer.Link>
      <Footer.Link href="/blog">Blog</Footer.Link>
      <Footer.Link href="/integrations">Integrations</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
      <Footer.Link href="/legal">Legal</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Support">
      <Footer.Link href="/contact">Talk to a specialist</Footer.Link>
      <Footer.Link href="/support">Help center</Footer.Link>
      <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
    </Footer.Column>
    <template #social>
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-linkedin"
        aria-label="Azion on LinkedIn"
        href="https://www.linkedin.com/company/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-youtube"
        aria-label="Azion on YouTube"
        href="https://www.youtube.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-twitter"
        aria-label="Azion on X"
        href="https://x.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-instagram"
        aria-label="Azion on Instagram"
        href="https://www.instagram.com/aziontech"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-discord"
        aria-label="Azion on Discord"
        href="https://discord.gg/azion"
        target="_blank"
      />
      <IconButton
        kind="transparent"
        size="small"
        icon="pi pi-reddit"
        aria-label="Azion on Reddit"
        href="https://www.reddit.com/r/aziontech"
        target="_blank"
      />
    </template>
    <template #status>
      <StatusIndicator
        severity="success"
        label="All Systems Operational"
      />
    </template>
    <template #language>
      <div class="w-24">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language" />
          <Select.Content>
            <Select.Option
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Option
            >
          </Select.Content>
        </Select>
      </div>
    </template>
    <template #brand>
      <a
        href="/"
        aria-label="Azion home"
      >
        <Brand size="large" />
      </a>
    </template>
    <template #tagline>The web platform for modern workloads</template>
  </Footer>
</template>
