<script setup>
  import Brand from '@aziontech/ui/brand'
  import Footer from '@aziontech/ui/footer'
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
    variant="console"
    aria-label="Footer"
    home-href="/"
    home-aria-label="Azion console home"
  >
    <Footer.Column title="Resources">
      <Footer.Link href="https://www.azion.com/en/documentation/">Docs</Footer.Link>
      <Footer.Link href="https://www.azion.com/en/support/">Support</Footer.Link>
      <Footer.Link href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
        >Privacy</Footer.Link
      >
    </Footer.Column>
    <template #brand>
      <Brand size="small" />
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
