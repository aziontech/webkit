<script setup>
  // THE SAMPLE PRESET — the only panel in this console that is about the console
  // rather than about the account it shows.
  //
  // Everything a reviewer needs to change to walk a different customer is here, in
  // one place, stated in the customer's terms: which contract they are on, whether
  // they own anything yet, and whether they have more than one account to switch
  // between (../../lib/sample-preset.js holds all three and persists them).
  //
  // It is not a settings page: nothing here exists in the real console, and a preset
  // that lived at a route would be one more page a reviewer could mistake for the
  // product. It opens over whatever screen is being reviewed and closes back onto it.
  //
  // A DRAWER, not a dialog. Every change here lands on the console immediately, so
  // the panel is also its own preview — and a dialog centres itself over exactly the
  // screen the reviewer is trying to watch change. Anchored to the right edge, the
  // page keeps most of its width: flip the plan and the header's tag moves, flip the
  // contents and the module behind it swaps, without closing anything. It is also
  // the shape the console already uses for "configure this alongside what you are
  // looking at" (the switch-account and upgrade drawers).
  //
  // WHY THE THREE ARE ONE PANEL: they are one account. A Hobby account with three
  // accounts to switch between and a full console of rows is not a customer anybody
  // has; keeping the knobs together is what makes the incoherent combination
  // visibly a choice rather than an accident of three controls in three menus.
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
  import { computed } from 'vue'

  import { SAMPLE_MODES } from '../../lib/state/sample-mode'
  import { SAMPLE_PLANS, useSamplePreset } from '../../lib/state/sample-preset'

  const open = defineModel('open', { type: Boolean, default: false })

  const { plan, setPlan, mode, setMode } = useSamplePreset()

  // Written straight through on change — there is no Save. The screen beside the
  // drawer is the confirmation, and a preset with a Cancel would imply the console
  // underneath had not already changed, which it has.
  const selectedPlan = computed({
    get: () => plan.value,
    set: (value) => setPlan(value)
  })

  const selectedMode = computed({
    get: () => mode.value,
    set: (value) => setMode(value)
  })

  // GUIDANCE. The agent onboarding card starts OFF and is dismissible on the page, and
  // either answer is persisted (../../../shared/lib/agent-onboarding.js) — so without a
  // control anywhere, the card was unreachable for a reader who had never turned it on
  // and unrecoverable for one who had dismissed it, both fixable only by editing a
  // localStorage key by hand. This is the switch, in the panel that already owns the
  // sample's other remembered state.
  //
  // Bound POSITIVELY (on = the reader still has the card), so the switch reads the same way
  // round as the flag the pages bind.
  const { agentOnboardingVisible } = useAgentOnboarding()

  const agentOnboarding = computed({
    get: () => agentOnboardingVisible.value,
    set: (value) => (value ? restoreAgentOnboarding() : dismissAgentOnboarding())
  })

  // Says where it shows AND that the first access is not affected: the three doors on an
  // empty account are that screen's whole content, so they are not something a preset
  // switch takes away.
  const agentOnboardingDescription =
    'Shows the agent setup card at the foot of the usage rail — the populated version of Home. The empty version always offers it as one of its three doors.'

  // What each version means on the screens that react to it, said once here rather
  // than left for the reviewer to discover by flipping it (../../lib/sample-mode.js
  // lists which modules those are).
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

  // SHARING A PRESET. A review comment that says "the empty Hobby account" is a
  // sentence the reader has to reproduce by hand, on a console whose preset is
  // remembered from their LAST session — so they read the wrong screen and reply
  // about it. The link carries the whole configuration in the query the app already
  // reads on arrival (`?state=` / `?plan=`, see ../../lib/state/sample-preset.js),
  // so the URL IS the configuration: it opens the page being discussed, as the
  // account being discussed, on any machine.
  //
  // Built off the CURRENT url, so the shared link keeps the route and every other
  // query the reviewer is on (`?email=`, `?tab=`, `?ttl=`) instead of dropping them
  // on Home.
  const presetLink = computed(() => {
    if (typeof globalThis.location === 'undefined') return ''
    const url = new URL(globalThis.location.href)
    url.searchParams.set('state', selectedMode.value)
    url.searchParams.set('plan', selectedPlan.value)
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

        <!-- The stack is a div INSIDE PanelContent, not a class on it. In a drawer
             PanelContent is a ScrollArea wrapping its own padded div, and a class
             passed to it lands on the SCROLL HOST — so `flex flex-col gap-*` would
             format the scroller and leave these sections butted together. -->
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-lg)">
            <DrawerDescription class="m-0 text-body-sm text-(--text-muted)">
              Which customer this prototype is pretending to be. Nothing here exists in the real
              console — it changes the screens beside this panel as you set it, is remembered for
              the next session, and can be handed to somebody else as a link.
            </DrawerDescription>

            <!-- PLAN. The cards are `flex-col`, so the group stacks full width rather
                 than sitting three across: each tier carries a sentence about who it is
                 for, and three of those side by side is a column of two-word lines.
                 The tag in each card is the tier's PRICE in the tier's own severity —
                 the same colour the profile tag will take, so the card previews the
                 badge without repeating the name written directly above it. -->
            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <!-- "Organization plan", not "Plan": the contract is between Azion and
                   the organization, never the person signed in — which is why the tier
                   is tagged on the organization switcher and not on the profile. -->
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

            <!-- VERSION. The knob that was in the header until this panel existed. -->
            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Account contents</h3>
              <BoxGridSelection
                v-model="selectedMode"
                :items="modeOptions"
                class="flex-col"
                aria-label="Account contents"
              />
            </section>

            <!-- NO TENANCY KNOB. Account switching is parked in the shell
                 (../shell/AppLayout.vue's `ACCOUNT_SWITCHING`), so a switch for it here
                 would be a control that moves nothing on screen — worse than a missing
                 one, because a reviewer flips it and concludes the console is broken.
                 The preference itself is kept in ../../lib/state/sample-preset.js, so
                 the section comes back with the switcher. -->

            <!-- GUIDANCE. Dismissing the card on Home is persisted, so without this the
                 decision could not be undone from anywhere in the console — see the note in
                 the script. -->
            <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-label-md text-(--text-default)">Guidance</h3>
              <FieldSwitchBlock
                v-model="agentOnboarding"
                label="Agent onboarding"
                :description="agentOnboardingDescription"
              />
            </section>
          </div>
        </PanelContent>

        <!-- The share control sits away from Done, at the other end of the row: it is
             not a step in setting the preset, it is what you do with one. They stack
             below `md`, where the drawer is a full-bleed bottom sheet. -->
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
