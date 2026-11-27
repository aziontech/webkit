<script setup>
  import Brand from '@aziontech/ui/brand'
  import Footer from '@aziontech/ui/footer'
  import IconButton from '@aziontech/ui/icon-button'
  import Select from '@aziontech/ui/select'
  import StatusIndicator from '@aziontech/ui/status-indicator'
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
    variant="site"
    aria-label="Footer"
    home-href="/"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/applications">Applications</Footer.Link>
      <Footer.Link href="/products/firewall">Firewall</Footer.Link>
      <Footer.Link href="/products/object-storage">Object Storage</Footer.Link>
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
      <Footer.Link href="/contact">Talk to sales</Footer.Link>
      <Footer.Link href="/support">Help center</Footer.Link>
      <Footer.Link href="https://status.azion.com/">System status</Footer.Link>
    </Footer.Column>
    <template #brand>
      <Brand size="small" />
    </template>
    <template #social>
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-linkedin"
        aria-label="Azion on LinkedIn"
        href="https://www.linkedin.com/company/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-youtube"
        aria-label="Azion on YouTube"
        href="https://www.youtube.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-x-brand"
        aria-label="Azion on X"
        href="https://x.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-instagram"
        aria-label="Azion on Instagram"
        href="https://www.instagram.com/aziontech"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-discord"
        aria-label="Azion on Discord"
        href="https://discord.gg/azion"
        target="_blank"
      />
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-reddit"
        aria-label="Azion on Reddit"
        href="https://www.reddit.com/r/aziontech"
        target="_blank"
      />
    </template>
    <template #status>
      <StatusIndicator
        severity="success"
        label="All systems operational"
      />
    </template>
    <template #language>
      <div class="w-28">
        <Select
          v-model="language"
          placeholder="Language"
        >
          <Select.Trigger aria-label="Language">
            <template #leading>
              <i
                class="az az-globe text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              v-for="o in languageOptions"
              :key="o.value"
              :value="o.value"
              >{{ o.label }}</Select.Item
            >
          </Select.Content>
        </Select>
      </div>
    </template>
  </Footer>
</template>
