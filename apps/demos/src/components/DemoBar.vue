<script setup lang="ts">
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  import { LOCALES, settings } from '../lib/settings'
  import { resources } from '../lib/store'

  const router = useRouter()

  const COPY = {
    en: {
      bar: 'Demo controls',
      flows: 'Flows',
      list: 'Resources: list',
      create: 'Create a resource',
      detail: 'Resource detail',
      edit: 'Edit a resource',
      remove: 'Delete a resource',
      deploy: 'Deploy with a toast',
      settings: 'Account settings',
      onboarding: 'Onboarding',
      assistant: 'AI assistant',
      light: 'Switch to light theme',
      dark: 'Switch to dark theme',
      rtl: 'Switch to right-to-left',
      ltr: 'Switch to left-to-right',
      language: 'Language'
    },
    'pt-BR': {
      bar: 'Controles da demo',
      flows: 'Fluxos',
      list: 'Recursos: lista',
      create: 'Criar um recurso',
      detail: 'Detalhe do recurso',
      edit: 'Editar um recurso',
      remove: 'Excluir um recurso',
      deploy: 'Deploy com toast',
      settings: 'Configurações da conta',
      onboarding: 'Onboarding',
      assistant: 'Assistente de IA',
      light: 'Mudar para o tema claro',
      dark: 'Mudar para o tema escuro',
      rtl: 'Mudar para direita para a esquerda',
      ltr: 'Mudar para esquerda para a direita',
      language: 'Idioma'
    }
  }

  const t = computed(() => (settings.locale === 'pt-BR' ? COPY['pt-BR'] : COPY.en))

  const first = computed(() => resources.value[0]?.id ?? '')

  const flows = computed(() => [
    { value: '/resources', label: t.value.list, icon: 'pi pi-list' },
    { value: '/resources/new', label: t.value.create, icon: 'pi pi-plus' },
    { value: `/resources/${first.value}`, label: t.value.detail, icon: 'pi pi-eye' },
    { value: `/resources/${first.value}/edit`, label: t.value.edit, icon: 'pi pi-pencil' },
    { value: `/resources/${first.value}/delete`, label: t.value.remove, icon: 'pi pi-trash' },
    {
      value: `/resources/${first.value}/deploy`,
      label: t.value.deploy,
      icon: 'pi pi-cloud-upload'
    },
    { value: '/settings', label: t.value.settings, icon: 'pi pi-cog' },
    { value: '/onboarding', label: t.value.onboarding, icon: 'pi pi-flag' },
    { value: '/assistant', label: t.value.assistant, icon: 'ai ai-ask-azion' }
  ])

  const localeLabel = (value: unknown) =>
    LOCALES.find((option) => option.value === value)?.label ?? String(value)

  const onFlow = (_event: unknown, value: unknown) => router.push(String(value))
  const toggleTheme = () => (settings.theme = settings.theme === 'dark' ? 'light' : 'dark')
  const toggleDir = () => (settings.dir = settings.dir === 'rtl' ? 'ltr' : 'rtl')
</script>

<template>
  <nav
    :aria-label="t.bar"
    class="fixed bottom-(--spacing-md) start-(--spacing-md) z-40 flex items-center gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xs) shadow-(--shadow-lg)"
  >
    <DropdownMenu
      placement="top-start"
      @select="onFlow"
    >
      <DropdownMenu.Trigger>
        <Tooltip :text="t.flows">
          <IconButton
            icon="pi pi-compass"
            kind="outlined"
            size="medium"
            :aria-label="t.flows"
          />
        </Tooltip>
      </DropdownMenu.Trigger>
      <DropdownMenu.Group>
        <DropdownMenu.Option
          v-for="flow in flows"
          :key="flow.value"
          :value="flow.value"
          :label="flow.label"
        >
          <template #left>
            <i
              :class="flow.icon"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Option>
      </DropdownMenu.Group>
    </DropdownMenu>
    <Tooltip :text="settings.theme === 'dark' ? t.light : t.dark">
      <IconButton
        :icon="settings.theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
        kind="outlined"
        size="medium"
        :aria-label="settings.theme === 'dark' ? t.light : t.dark"
        @click="toggleTheme"
      />
    </Tooltip>
    <Tooltip :text="settings.dir === 'rtl' ? t.ltr : t.rtl">
      <IconButton
        icon="pi pi-arrow-right-arrow-left"
        kind="outlined"
        size="medium"
        :aria-label="settings.dir === 'rtl' ? t.ltr : t.rtl"
        :aria-pressed="settings.dir === 'rtl'"
        @click="toggleDir"
      />
    </Tooltip>
    <div class="w-44">
      <Select
        v-model="settings.locale"
        size="medium"
        :display-value="localeLabel"
      >
        <Select.Trigger :aria-label="t.language">
          <template #iconLeft>
            <i
              class="pi pi-globe text-(--text-muted)"
              aria-hidden="true"
            />
          </template>
        </Select.Trigger>
        <Select.Content>
          <Select.Option
            v-for="option in LOCALES"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Option>
        </Select.Content>
      </Select>
    </div>
  </nav>
</template>
