<script setup>
  // THE LAST PART — CONFIGURE AND DEPLOY. One card of FIELDS, then the Advanced band.
  //
  // Anatomy: the fields live inside a single CardBox as the webkit triad (FieldStack —
  // Label + control + one helper region), because every one of them is something the
  // reader TYPES and a right-aligned 256px control is hostile for a name or a command.
  // Advanced is the disclosure pattern this console already has for it — a collapsible
  // `Section` band, never an Accordion — with its own content wrapped in cards.
  //
  // ── WHAT IS OPEN AND WHAT IS BEHIND THE DISCLOSURE ──
  //
  // Open: the project NAME (the endpoint's only required field, and the name the whole
  // provisioned chain takes), the two BUILD commands, and any settings the chosen
  // template declares — a Shopify token, a database URL. Those last ones are open
  // BECAUSE the template asked for them: a template-required credential hidden behind
  // "Advanced" is a failed deploy the reader could not see coming.
  //
  // Behind Advanced: the seven `modules` flags plus `active` and `debug`. Every one of
  // them already carries the create endpoint's own default, so submitting untouched
  // sends exactly what the API would have applied on its own — which is what licenses
  // hiding them. Nothing the endpoint REQUIRES is ever inside the disclosure, so a
  // failed submit always points at a field already on screen.
  //
  // Those fields used to be three OPEN bands on this create. They are the same fields,
  // with the same copy and in the same order as an application's Main Settings, so a
  // created application reads identically the first time it is edited — they just
  // stopped being the first thing the flow asks, because "which modules" is not the
  // question anybody opens this flow to answer.
  //
  // The form OBJECT is owned by the wizard page (../CreateApplication.vue) and reaches
  // this part through INJECTED CONTEXT, not a prop — see ./form-context.js for why (a
  // child writing into a prop object is what `vue/no-mutating-props` forbids). This part
  // writes into it and validates nothing on its own: the wizard validates on the commit,
  // because the commit is the last Next.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'

  import FirewallBinding from '../../../components/firewall/FirewallBinding.vue'
  import FieldStack from '../../../components/form/FieldStack.vue'
  import Section from '../../../components/page/Section.vue'
  import {
    APPLICATION_BEHAVIOR_FIELDS,
    CONTACT_SALES,
    DEFAULT_MODULES,
    SUBSCRIPTION_MODULES
  } from '../../../lib/data/application-modules'
  import { existingFirewallOptions } from '../../../lib/data/firewalls'
  import { useCreateForm } from './form-context'

  const props = defineProps({
    // The chosen source — a repository, a template, or from scratch. Read-only here, so it
    // stays a prop: its `settings` are the per-template fields this part has to ask for.
    source: { type: Object, default: null },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  // The request body and the commit's validation messages, shared from the wizard.
  const { form, errors } = useCreateForm()

  const templateSettings = () => props.source?.settings ?? []

  // The account’s real firewalls — the same rows the Secure → Firewall list shows, so
  // "use an existing one" offers the ones that exist rather than a fixture of its own.
  const EXISTING_FIREWALLS = existingFirewallOptions()
</script>

<template>
  <!-- NO `gap` on this stack, deliberately. CardBox renders a real `<section>` element,
       so the Advanced band below is not `:first-of-type` and `Section` already applies its
       own `--layout-section-gap` top margin (../../../components/page/Section.vue). A flex
       gap here would be added to that one and the disclosure would float a double step
       below the fields. -->
  <div class="flex min-w-0 flex-col">
    <!-- ONE CARD, THE FIELDS INSIDE IT. Name, then the build pair, then whatever the
         template asked for — in that order, because that is the order the reader can
         answer them in: the name they choose, the commands they confirm, the credentials
         they go and fetch. Each is the webkit field triad via FieldStack (Label + control
         + ONE helper region), stacked at the card's full measure rather than
         right-aligned in a row, because every one of these is something the reader
         TYPES. -->
    <!-- `padded="false"` and the inset moved onto the two groups INSIDE, so the rule
         between them spans the card edge to edge. A rule drawn inside the card's own
         padding stops short of both edges and reads as a field's underline rather than as
         the card's own division — the firewall card below already divides itself the
         full-bleed way, and one card cannot separate its parts two different ways. -->
    <CardBox
      :padded="false"
      title="Configure your application"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <!-- The endpoint's one requirement, so it leads and carries the persistent
               Required tag rather than only turning amber on a failed submit. -->
          <FieldStack
            label="Name"
            required
            hint="Names the application, and every resource created alongside it. The workload, the connector, and the storage bucket all take it."
            description="Lowercase letters, numbers, and hyphens. It becomes part of the deployed URL."
            :message="errors.name"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.name"
                size="large"
                class="w-full"
                placeholder="my-application"
                :disabled="disabled"
                :required="!!errors.name"
                :aria-describedby="describedBy"
              />
            </template>
          </FieldStack>

          <!-- The two build commands, side by side from `sm` up: one decision read
               together — what produces the bundle, and what ships it.
               ONLY WHEN THERE IS SOMETHING TO BUILD. From scratch is the Azion application
               LAYER on its own — no repository, no bundle, nothing to run — so asking it
               for a build command would be asking about code that does not exist yet. The
               source says whether it needs one (`requiresBuild`,
               ../../../lib/data/application-flows.js), because that is a property of where
               the code comes from and not of this form. -->
          <div
            v-if="source?.requiresBuild"
            class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2"
          >
            <FieldStack
              label="Build command"
              hint="Produces the bundle. Leave it empty for a site that needs no build."
            >
              <template #default="{ controlId, describedBy }">
                <InputText
                  :id="controlId"
                  v-model="form.buildCommand"
                  size="large"
                  class="w-full"
                  placeholder="npm run build"
                  :disabled="disabled"
                  :aria-describedby="describedBy"
                />
              </template>
            </FieldStack>

            <FieldStack
              label="Deploy command"
              hint="Runs after the build to deploy the bundle to Azion."
            >
              <template #default="{ controlId, describedBy }">
                <InputText
                  :id="controlId"
                  v-model="form.deployCommand"
                  size="large"
                  class="w-full"
                  placeholder="npm run deploy"
                  :disabled="disabled"
                  :aria-describedby="describedBy"
                />
              </template>
            </FieldStack>
          </div>
        </div>

        <!-- Template settings, when the chosen template declares any. In the SAME card
             and OPEN, never behind the disclosure: the template asked for these, so a
             required credential hidden under "Advanced" is a failed deploy the reader
             could not see coming. A rule separates them because they belong to the
             template rather than to the application. -->
        <div
          v-if="templateSettings().length"
          class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)"
        >
          <p class="text-label-sm text-(--text-default)">Template settings</p>
          <FieldStack
            v-for="setting in templateSettings()"
            :key="setting.name"
            :label="setting.label"
            :required="!!setting.required"
            :description="setting.description"
            :message="errors[setting.name]"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.settings[setting.name]"
                size="large"
                class="w-full"
                :placeholder="setting.placeholder"
                :disabled="disabled"
                :required="!!errors[setting.name]"
                :aria-describedby="describedBy"
              />
            </template>
          </FieldStack>
        </div>
      </template>
    </CardBox>

    <!-- PROTECTION — the same three-part question the repository part asks, in the same
         control (../../../components/firewall/FirewallBinding.vue): is there a firewall,
         and if so, one that already exists or a new one?
         OFF by default, which is the change that matters. This flow used to arrive with
         the switch ON and create a firewall alongside the application, so a reader who
         never looked at the row still spent a resource — and the only way to say yes was
         to make a second firewall beside the ones the account already had. Protection is
         now a decision made rather than a default absorbed, and binding an existing
         firewall is one of the two ways to make it.
         OPEN, not behind Advanced: everything inside that disclosure carries the create
         endpoint’s own default, while a firewall is a SEPARATE resource this flow
         provisions or binds. The reader sees the resource they are about to spend, next to
         the switch that declines it. -->
    <FirewallBinding
      v-model="form.protection"
      class="mt-(--layout-section-gap)"
      :options="EXISTING_FIREWALLS"
      :default-name="form.name"
      description="Filters requests before they reach your code. Off by default. Turn it on to bind an existing firewall, or create one with the application."
      :message="errors.firewall"
      :disabled="disabled"
    />

    <!-- ADVANCED — the pattern this console already has for it: a collapsible `Section`
         band (../../../components/page/Section.vue), which owns the trigger semantics
         (`aria-expanded` / `aria-controls`), the height transition, and `inert` while
         closed so no hidden field is ever tabbable. NOT an Accordion: an Accordion inside
         a create form is a second disclosure vocabulary for the thing Section already
         does, and it would sit inside a card instead of being a band of the page. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="The modules the application runs with, and two application-level flags. Every one already carries the endpoint's own default, and all of them can be changed later in Main Settings."
    >
      <!-- ONE card, three GROUPS inside it — the same shape as the protection card above.
           Three boxes stacked at the section step said the modules, the subscription
           modules and the two flags were three separate bands of the page; they are three
           groups of ONE band, and the band is already titled "Advanced". A group is a
           heading and its rows: the rule above each heading is what separates them, which
           is what a card border was being spent on. -->
      <CardBox :padded="false">
        <template #content>
          <!-- MODULES. Each row is an Item — the Item.Title IS the name, guidance goes in
               Item.Description, the switch sits right in Item.Actions. A switch lives in
               that cell, never loose on the page. -->
          <h3
            class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Modules
          </h3>
          <Item.List>
            <Item
              v-for="mod in DEFAULT_MODULES"
              :key="mod.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ mod.title }}</Item.Title>
                <Item.Description>{{ mod.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.modules[mod.key]"
                  :aria-label="mod.title"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
          </Item.List>

          <!-- SUBSCRIPTION MODULES — their own group, because nothing here is a decision
               this form can make. The rows above are switches the reader flips; these are
               a different KIND of thing: locked capabilities with a sales path. -->
          <h3
            class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Subscription modules
          </h3>
          <Item.List>
            <Item
              v-for="mod in SUBSCRIPTION_MODULES"
              :key="mod.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ mod.title }}</Item.Title>
                <Item.Description>
                  {{ mod.description }}
                  <!-- The way forward lives on the ROW, not in the tooltip: a Tooltip
                       panel is `pointer-events-none`, so a link inside one can never be
                       clicked or tabbed to. -->
                  <a
                    :href="CONTACT_SALES"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                  >
                    Contact sales
                    <i
                      class="pi pi-external-link shrink-0 text-[0.9em] leading-none"
                      aria-hidden="true"
                    />
                  </a>
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <!-- Disabled, with the reason on hover or focus. The switch is not
                     something this form can turn on — activation is a sales conversation
                     — so it states that rather than pretending to be interactive. -->
                <Tooltip text="Contact sales to enable this module.">
                  <Switch
                    v-model="form.modules[mod.key]"
                    disabled
                    :aria-label="mod.title"
                  />
                </Tooltip>
              </Item.Actions>
            </Item>
          </Item.List>

          <!-- The two application-level flags, last inside the disclosure: the fields
               almost nobody touches at creation time. -->
          <h3
            class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Behavior
          </h3>
          <Item.List>
            <Item
              v-for="field in APPLICATION_BEHAVIOR_FIELDS"
              :key="field.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ field.title }}</Item.Title>
                <Item.Description>{{ field.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form[field.key]"
                  :aria-label="field.title"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </div>
</template>
