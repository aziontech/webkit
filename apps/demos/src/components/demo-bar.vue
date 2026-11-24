<script setup lang="ts">
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import LanguageSelect from '@aziontech/webkit/language-select'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, useId } from 'vue'
  import { useRouter } from 'vue-router'

  import { LOCALES, resolvedTheme, settings } from '../lib/settings'
  import { resources } from '../lib/store'

  const SUPPORT_TICKET = '4812'
  const SUPPORT_CUSTOMER = 'alex-morgan'

  const router = useRouter()
  const expanded = ref(false)
  const panelId = useId()

  const COPY = {
    en: {
      bar: 'Demo controls',
      show: 'Show demo controls',
      hide: 'Hide demo controls',
      flows: 'Flows',
      list: 'Resources: list',
      create: 'Create a resource',
      detail: 'Resource detail',
      edit: 'Edit a resource',
      remove: 'Delete a resource',
      deploy: 'Deploy with a toast',
      settings: 'Account settings',
      onboarding: 'Onboarding',
      assistant: 'Agent',
      inbox: 'Support: ticket inbox',
      newTicket: 'Support: create a ticket',
      ticket: 'Support: ticket',
      customer: 'Support: customer',
      cannedResponses: 'Support: canned responses',
      light: 'Switch to light theme',
      dark: 'Switch to dark theme',
      rtl: 'Switch to right-to-left',
      ltr: 'Switch to left-to-right',
      language: 'Language'
    },
    'pt-BR': {
      bar: 'Controles da demo',
      show: 'Mostrar controles da demo',
      hide: 'Ocultar controles da demo',
      flows: 'Fluxos',
      list: 'Recursos: lista',
      create: 'Criar um recurso',
      detail: 'Detalhe do recurso',
      edit: 'Editar um recurso',
      remove: 'Excluir um recurso',
      deploy: 'Deploy com toast',
      settings: 'Configurações da conta',
      onboarding: 'Onboarding',
      assistant: 'Agente',
      inbox: 'Suporte: caixa de tickets',
      newTicket: 'Suporte: criar um ticket',
      ticket: 'Suporte: ticket',
      customer: 'Suporte: cliente',
      cannedResponses: 'Suporte: respostas prontas',
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
    { value: '/resources', label: t.value.list, icon: 'az az-list' },
    { value: '/resources/new', label: t.value.create, icon: 'az az-plus' },
    { value: `/resources/${first.value}`, label: t.value.detail, icon: 'az az-eye' },
    { value: `/resources/${first.value}/edit`, label: t.value.edit, icon: 'az az-pencil' },
    { value: `/resources/${first.value}/delete`, label: t.value.remove, icon: 'az az-trash' },
    {
      value: `/resources/${first.value}/deploy`,
      label: t.value.deploy,
      icon: 'az az-cloud-upload'
    },
    { value: '/settings', label: t.value.settings, icon: 'az az-settings' },
    { value: '/onboarding', label: t.value.onboarding, icon: 'az az-flag' },
    { value: '/assistant', label: t.value.assistant, icon: 'az az-ask-azion' },
    { value: '/support', label: t.value.inbox, icon: 'az az-ticket' },
    { value: '/support/tickets/new', label: t.value.newTicket, icon: 'az az-plus' },
    { value: `/support/tickets/${SUPPORT_TICKET}`, label: t.value.ticket, icon: 'az az-comments' },
    {
      value: `/support/customers/${SUPPORT_CUSTOMER}`,
      label: t.value.customer,
      icon: 'az az-user'
    },
    {
      value: '/support/settings/canned-responses',
      label: t.value.cannedResponses,
      icon: 'az az-reply'
    }
  ])

  const onFlow = (_event: unknown, value: unknown) => router.push(String(value))
  const toggleTheme = () => (settings.theme = resolvedTheme.value === 'dark' ? 'light' : 'dark')
  const toggleBar = () => (expanded.value = !expanded.value)
  const toggleDir = () => (settings.dir = settings.dir === 'rtl' ? 'ltr' : 'rtl')
</script>

<template>
  <nav
    :aria-label="t.bar"
    data-demo-bar
    class="fixed inset-x-0 bottom-0 z-40 flex min-h-(--demo-bar-height) items-center gap-(--spacing-xs) border-t border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-xs)"
  >
    <Tooltip :content="expanded ? t.hide : t.show">
      <IconButton
        :icon="expanded ? 'az az-x' : 'az az-sliders-horizontal'"
        variant="ghost"
        size="medium"
        :aria-label="expanded ? t.hide : t.show"
        :aria-expanded="expanded"
        :aria-controls="panelId"
        @click="toggleBar"
      />
    </Tooltip>
    <div
      v-show="expanded"
      :id="panelId"
      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
    >
      <DropdownMenu
        side="top"
        align="start"
        @select="onFlow"
      >
        <DropdownMenu.Trigger>
          <Tooltip :content="t.flows">
            <IconButton
              icon="az az-compass"
              variant="outline"
              size="medium"
              :aria-label="t.flows"
            />
          </Tooltip>
        </DropdownMenu.Trigger>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            v-for="flow in flows"
            :key="flow.value"
            :value="flow.value"
            :label="flow.label"
          >
            <template #leading>
              <i
                :class="flow.icon"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
      <Tooltip :content="resolvedTheme === 'dark' ? t.light : t.dark">
        <IconButton
          :icon="resolvedTheme === 'dark' ? 'az az-sun' : 'az az-moon'"
          variant="outline"
          size="medium"
          :aria-label="resolvedTheme === 'dark' ? t.light : t.dark"
          @click="toggleTheme"
        />
      </Tooltip>
      <Tooltip :content="settings.dir === 'rtl' ? t.ltr : t.rtl">
        <IconButton
          icon="az az-arrow-right-left"
          variant="outline"
          size="medium"
          :aria-label="settings.dir === 'rtl' ? t.ltr : t.rtl"
          :aria-pressed="settings.dir === 'rtl'"
          @click="toggleDir"
        />
      </Tooltip>
      <LanguageSelect
        v-model="settings.locale"
        variant="ghost"
        :options="LOCALES"
        :aria-label="t.language"
      />
    </div>
  </nav>
</template>
