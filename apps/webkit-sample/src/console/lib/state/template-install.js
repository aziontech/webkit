import { ref } from 'vue'

const pending = ref(null)

export const rememberTemplateInstall = (install) => {
  pending.value = install
}

export const templateInstallFor = (slug) =>
  pending.value && pending.value.slug === slug ? pending.value : null

export const pendingTemplateInstall = () => pending.value

export const clearTemplateInstall = () => {
  pending.value = null
}
