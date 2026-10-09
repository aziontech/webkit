<script setup>
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import {
    dismissAgentOnboarding,
    restoreAgentOnboarding,
    useAgentOnboarding
  } from '@shared/lib/agent-onboarding'
  import { useLegacyUi } from '@shared/lib/legacy-ui'
  import { computed } from 'vue'

  import { SAMPLE_MODES } from '../../lib/state/sample-mode'
  import { DEPLOY_FLOWS, SAMPLE_PLANS, useSamplePreset } from '../../lib/state/sample-preset'

  const open = defineModel('open', { type: Boolean, default: false })

  const { plan, setPlan, mode, setMode, deployFlow, setDeployFlow } = useSamplePreset()

  const selectedDeployFlow = computed({
    get: () => deployFlow.value,
    set: (value) => setDeployFlow(value)
  })

  const selectedPlan = computed({
    get: () => plan.value,
    set: (value) => setPlan(value)
  })

  const selectedMode = computed({
    get: () => mode.value,
    set: (value) => setMode(value)
  })

  const { agentOnboardingVisible } = useAgentOnboarding()

  const agentOnboarding = computed({
    get: () => agentOnboardingVisible.value,
    set: (value) => (value ? restoreAgentOnboarding() : dismissAgentOnboarding())
  })

  const { legacyUi, setLegacyUi } = useLegacyUi()

  const legacyPalette = computed({
    get: () => legacyUi.value,
    set: (value) => setLegacyUi(value)
  })

  const legacyPaletteDescription =
    'Repaints every screen — console, site and docs — with the colours the current console ships: its surfaces, text, borders, links and feedback. Type, spacing and shape stay as they are, so what you are comparing is the palette.'

  const agentOnboardingDescription =
    'Shows the agent setup card at the foot of the usage rail — the populated version of Home. The empty version always offers it as one of its three doors.'

  const MODE_DESCRIPTIONS = {
    empty:
      'Home opens on first use; Applications, Workloads and Functions show their first-use block.',
    populated: 'Home opens on usage and the resource list; every module lists its seeded rows.'
  }

  const modeOptions = computed(() =>
    SAMPLE_MODES.map((option) => ({
      ...option,
      description: MODE_DESCRIPTIONS[option.value] ?? ''
    }))
  )

  const presetLink = computed(() => {
    if (typeof globalThis.location === 'undefined') return ''
    const url = new URL(globalThis.location.href)
    url.searchParams.set('state', selectedMode.value)
    url.searchParams.set('plan', selectedPlan.value)
    url.searchParams.set('deploy-flow', selectedDeployFlow.value)
    if (legacyPalette.value) url.searchParams.set('ui', 'legacy')
    else url.searchParams.delete('ui')
    return url.toString()
  })

  const copyLink = async () => {
    if (!presetLink.value || typeof globalThis.navigator === 'undefined') return
    try {
      await globalThis.navigator.clipboard.writeText(presetLink.value)
    } catch {
      toast.error("Couldn't copy the link.", {
        description: 'Clipboard access was blocked by the browser.'
      })
      return
    }
    toast.success('Preset link copied.', {
      description: 'It opens this page on this exact sample.'
    })
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    side="right"
    size="medium"
    data-testid="sample-preset-drawer"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent aria-label="Sample preset">
        <PanelHeader class="w-full">
          <DrawerTitle>Sample preset</DrawerTitle>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <div class="flex flex-col gap-(--spacing-lg)">
            <DrawerDescription class="m-0 text-body-sm text-(--text-muted)">
              Which customer this prototype is pretending to be. Nothing here exists in the real
              console — it changes the screens beside this panel as you set it, is remembered for
              the next session, and can be handed to somebody else as a link.
            </DrawerDescription>

            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Organization plan</h3>
              <BoxGridSelection
                v-model="selectedPlan"
                :items="SAMPLE_PLANS"
                class="flex-col"
                aria-label="Plan"
              >
                <template #tag="{ item }">
                  <Tag
                    :label="item.price"
                    :severity="item.severity"
                    size="small"
                    class="mt-(--spacing-xxs) w-fit"
                  />
                </template>
              </BoxGridSelection>
            </section>

            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Account contents</h3>
              <BoxGridSelection
                v-model="selectedMode"
                :items="modeOptions"
                class="flex-col"
                aria-label="Account contents"
              />
            </section>

            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Application deploy flow</h3>
              <BoxGridSelection
                v-model="selectedDeployFlow"
                :items="DEPLOY_FLOWS"
                class="flex-col"
                aria-label="Application deploy flow"
              />
            </section>

            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Guidance</h3>
              <FieldSwitchBlock
                v-model="agentOnboarding"
                label="Agent onboarding"
                :description="agentOnboardingDescription"
              />
            </section>

            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Appearance</h3>
              <FieldSwitchBlock
                v-model="legacyPalette"
                label="See as Legacy UI"
                :description="legacyPaletteDescription"
              />
            </section>
          </div>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-between">
          <Button
            class="w-full md:w-auto"
            label="Copy link to this preset"
            kind="outlined"
            size="medium"
            icon="pi pi-link"
            @click="copyLink"
          />
          <Button
            class="w-full md:w-auto"
            label="Done"
            kind="secondary"
            size="medium"
            @click="open = false"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
