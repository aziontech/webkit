<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import ConfirmDialog from '../../../components/list/ConfirmDialog.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import AddDomainDrawer from '../../../components/resource/AddDomainDrawer.vue'
  import DomainsSection from '../../../components/resource/DomainsSection.vue'
  import { focusSection } from '../../../lib/behavior/anchor-nav'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { applicationDeploymentRows } from '../../../lib/data/deployment-history'
  import { domainsFor, saveDomains } from '../../../lib/state/application-domains'

  interface Props {
    application: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const settings = reactive({
    name: props.application.name,
    active: props.application.active !== false,
    domains: domainsFor(props.application.id, props.application).map((entry) => ({ ...entry })),
    modules: {
      application_accelerator: true,
      cache: true,
      device_detection: false,
      functions: true,
      image_processor: false,
      load_balancer: false,
      web_socket_proxy: false
    }
  })

  const saving = ref(false)
  const { dirty, commit } = useBaseline(settings)

  const snapshot = ref(JSON.parse(JSON.stringify(settings)))

  const save = () =>
    saveGroup(saving, 'Settings saved.', () => {
      saveDomains(props.application.id, settings.domains)
      commit()
      snapshot.value = JSON.parse(JSON.stringify(settings))
    })

  const discard = () => {
    Object.assign(settings, JSON.parse(JSON.stringify(snapshot.value)))
  }

  useTabDirty(
    'main-settings',
    { dirty, saving },
    { label: 'Application settings changed.', save, discard }
  )

  const route = useRoute()
  const router = useRouter()

  const domainOpen = ref(false)
  const editingDomain = ref(null)
  const removingDomainId = ref('')
  const removeDomainOpen = ref(false)

  const environments = computed(() => {
    const names = new Set(
      applicationDeploymentRows(props.application.id, props.application.name)
        .map((row) => row.environment)
        .filter(Boolean)
    )
    return [...names].map((name) => ({ name }))
  })

  const domainRows = computed(() => [
    {
      id: 'generated',
      domain: props.application.domainName ?? '',
      environment: environments.value[0]?.name ?? '',
      certificate: '',
      generated: true
    },
    ...settings.domains.map((entry) => ({ ...entry, generated: false }))
  ])

  const openDomain = () => {
    editingDomain.value = null
    domainOpen.value = true
  }

  const editDomain = (id) => {
    const entry = settings.domains.find((domain) => domain.id === id)
    if (!entry) return
    editingDomain.value = { ...entry }
    domainOpen.value = true
  }

  const stageDomain = (entry) => {
    const existing = settings.domains.some((domain) => domain.id === entry.id)
    settings.domains = existing
      ? settings.domains.map((domain) => (domain.id === entry.id ? entry : domain))
      : [...settings.domains, entry]
    editingDomain.value = null
  }

  const removingDomain = computed(() =>
    settings.domains.find((domain) => domain.id === removingDomainId.value)
  )

  const removeDomain = (id) => {
    removingDomainId.value = id
    removeDomainOpen.value = true
  }

  const confirmRemoveDomain = () => {
    settings.domains = settings.domains.filter((domain) => domain.id !== removingDomainId.value)
    removingDomainId.value = ''
  }

  watch(
    () => route.query.add,
    (value) => {
      if (value !== 'domain') return
      openDomain()
      const query = { ...route.query }
      delete query.add
      router.replace({ query })
    },
    { immediate: true }
  )

  watch(
    () => route.query.focus,
    (value) => {
      if (value !== 'domains') return
      focusSection('domains')
      const query = { ...route.query }
      delete query.focus
      router.replace({ query })
    },
    { immediate: true }
  )

  const defaultModules = [
    {
      key: 'application_accelerator',
      title: 'Application Accelerator',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    {
      key: 'cache',
      title: 'Cache',
      description: 'Customize advanced cache settings.'
    },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Activate DeviceAtlas variables to configure responsive rules.'
    },
    {
      key: 'functions',
      title: 'Functions',
      description: 'Build ultra-low latency functions that run on Azion.'
    },
    {
      key: 'image_processor',
      title: 'Image Processor',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancer',
      title: 'Load Balancer',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
  const subscriptionModules = [
    {
      key: 'web_socket_proxy',
      title: 'WebSocket Proxy',
      description:
        'Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.'
    }
  ]
  const CONTACT_SALES = 'https://www.azion.com/en/contact-sales/'
</script>

<template>
  <form
    class="flex min-h-full flex-col"
    aria-label="Main settings"
    novalidate
    @submit.prevent="save"
  >
    <div
      class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
    >
      <PageHeading
        title="Settings"
        description="Core configuration for this application."
        size="small"
      />

      <fieldset
        class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">Main settings</legend>

        <Section
          stacked
          anchor
          :divided="false"
          title="General"
          hint="How this application is identified across the console, and whether it is serving traffic."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Name</Item.Title>
                    <Item.Description>
                      A unique and descriptive name to identify the application.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                    <InputText
                      v-model="settings.name"
                      size="large"
                      :disabled="saving"
                      class="w-full"
                      aria-label="Name"
                    />
                  </Item.Actions>
                </Item>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Active</Item.Title>
                    <Item.Description>
                      When disabled, the application stops serving traffic.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="settings.active"
                      aria-label="Active"
                      :disabled="saving"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          anchor
          :divided="false"
          title="Modules"
          hint="The capabilities this application runs with, each of which can be toggled here."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="mod in defaultModules"
                  :key="mod.key"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ mod.title }}</Item.Title>
                    <Item.Description>{{ mod.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="settings.modules[mod.key]"
                      :aria-label="mod.title"
                      :disabled="saving"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          anchor
          :divided="false"
          title="Subscription modules"
          hint="Paid add-ons that are activated with sales, not from this page."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="mod in subscriptionModules"
                  :key="mod.key"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ mod.title }}</Item.Title>
                    <Item.Description>
                      {{ mod.description }}
                      <a
                        :href="CONTACT_SALES"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                      >
                        Contact sales
                        <i
                          class="pi pi-external-link shrink-0 text-body-sm leading-none"
                          aria-hidden="true"
                        />
                      </a>
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Tooltip text="Contact sales to activate this module.">
                      <Switch
                        v-model="settings.modules[mod.key]"
                        disabled
                        :aria-label="mod.title"
                      />
                    </Tooltip>
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>
        <Section
          stacked
          anchor
          :divided="false"
          title="Domains"
          hint="The addresses visitors reach this application at, the environment each one answers in, and the certificate it is served with."
        >
          <DomainsSection
            :domains="domainRows"
            :disabled="saving"
            @add="openDomain"
            @edit="editDomain"
            @remove="removeDomain"
          />
        </Section>
      </fieldset>
    </div>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Application settings changed."
      hint="Saving publishes them on the next deployment."
      @save="save"
      @discard="discard"
    />
    <AddDomainDrawer
      v-model:open="domainOpen"
      resource="application"
      intent="domain"
      :environments="environments"
      :domain="editingDomain"
      @save="stageDomain"
    />

    <ConfirmDialog
      v-model:open="removeDomainOpen"
      title="Remove domain"
      :description="`${removingDomain?.domain ?? 'This domain'} stops answering for this application once you save. Traffic already pointed at it gets no response.`"
      confirm-label="Remove Domain"
      @confirm="confirmRemoveDomain"
    />
  </form>
</template>
