<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
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
    variant="console"
    aria-label="Footer"
  >
    <Footer.Column title="Resources">
      <Footer.Link href="https://www.azion.com/en/documentation/">Docs</Footer.Link>
      <Footer.Link href="https://www.azion.com/en/support/">Support</Footer.Link>
      <Footer.Link href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
        >Privacy</Footer.Link
      >
    </Footer.Column>
    <template #brand>
      <a
        href="/"
        aria-label="Azion console home"
      >
        <Brand size="small" />
      </a>
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
                class="ai ai-globe text-(--text-muted)"
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
