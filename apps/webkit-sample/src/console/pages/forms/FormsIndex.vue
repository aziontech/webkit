<script setup>
  // The Forms hub — an index of the form types the `/form` skill documents, each a
  // live example under a /forms sub-route. A form's Fields, spacing, and hierarchy
  // (the shared Form Layout) are constant; a "type" only changes the container it
  // lives in and its save model. This page is navigation only.
  //
  // Every form linked here follows `/ui-craft` (webkit components + tokens only) and
  // `/usability` Pattern 1: the async save locks its scope off one `submitting` flag
  // — Save shows :loading and every field is :disabled — releasing in finally, and
  // reports request failures via toast. Multi-save forms lock per card.
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import PageHeading from '../../components/page/PageHeading.vue'
  import Section from '../../components/page/Section.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import {
    firstLevelDrawerExceptions,
    surfaceCounts,
    surfaceRules
  } from '../../lib/behavior/surfaces'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // The form types, each with a live sub-route example. `save` states the save
  // model (one unit vs. one-per-section); `surface` names the container.
  const examples = [
    {
      id: 'in-page',
      title: 'In Page create',
      description:
        'The module create for a long form — a dedicated page with its own creation header and a sticky footer, sidebar hidden so the form is the only focus. Section-titled ItemGroup sections, one save. Approach A.',
      icon: 'pi pi-file-edit',
      surface: 'Page',
      save: 'One save',
      path: '/forms/in-page'
    },
    {
      id: 'fields-separated',
      title: 'Fields separated',
      description:
        'Standalone field-* triads stacked in a column: a Git and template configuration built as one page with a single save. Approach B.',
      icon: 'pi pi-align-left',
      surface: 'Page',
      save: 'One save',
      path: '/forms/fields-separated'
    },
    {
      id: 'drawer',
      title: 'Drawer form',
      description:
        'In-context creation: create a resource without leaving the list. One scoped save in the drawer footer.',
      icon: 'pi pi-window-maximize',
      surface: 'Drawer',
      save: 'One save',
      path: '/forms/drawer'
    },
    {
      id: 'drawer-itemgroups',
      title: 'ItemGroups in a drawer',
      description:
        'In-context create whose body is several section-titled ItemGroup sections: the settings layout in a drawer. One scoped save. Approach A.',
      icon: 'pi pi-clone',
      surface: 'Drawer',
      save: 'One save',
      path: '/forms/drawer-itemgroups'
    },
    {
      id: 'nested-drawer',
      title: 'Nested drawer',
      description:
        "A drawer whose Select needs a related resource that doesn't exist yet — a quick-add opens a second, smaller drawer stacked over the first, then selects the new resource back into the parent. Each drawer is its own scoped save.",
      icon: 'pi pi-sitemap',
      surface: 'Drawer',
      save: 'Save per drawer',
      path: '/forms/nested-drawer'
    },
    {
      id: 'dialog',
      title: 'Dialog form',
      description:
        'A short, blocking decision: a destructive delete guarded by a typed confirmation. Approach B.',
      icon: 'pi pi-exclamation-triangle',
      surface: 'Dialog',
      save: 'One confirm',
      path: '/forms/dialog'
    },
    {
      id: 'itemgroup',
      title: 'ItemGroup settings',
      description:
        'Account-level settings as Item rows in a single flush block. One save. Approach A.',
      icon: 'pi pi-list',
      surface: 'Page',
      save: 'One save',
      path: '/forms/itemgroup'
    },
    {
      id: 'cardbox',
      title: 'CardBox with independent saves',
      description:
        'A long configuration page split into cards, where each card owns its own save. Approach A inside each card.',
      icon: 'pi pi-th-large',
      surface: 'Page',
      save: 'Save per card',
      path: '/forms/cardbox'
    },
    {
      id: 'error-validation',
      title: 'Error validation',
      description:
        'A create form whose linked resource is deleted by another user mid-edit. The API rejects the save with a field-scoped error, so it renders as a Message inside the section that owns the broken reference — never a toast, never a validation summary.',
      icon: 'pi pi-exclamation-circle',
      surface: 'Page',
      save: 'One save',
      path: '/forms/error-validation'
    },
    {
      id: 'async-deployment',
      title: 'Async action and error',
      description:
        'The counterpart of Error validation: a deploy that runs for half a minute, so the user leaves before it ends. The run lives outside the page, progress rides a loading toast, and the failure comes back as a closable toast carrying both ways out — redeploy, or jump to the Deployments module.',
      icon: 'pi pi-cloud-upload',
      surface: 'Toast',
      save: 'Async run',
      path: '/forms/async-deployment'
    },
    {
      id: 'auth-errors',
      title: 'Auth error states',
      description:
        'The same question as Error validation, asked on the signed-out screens, where the answer is one rule: auth never toasts. A picker arms the endpoint (401, 503, 500, timeout, 409) and every outcome lands in the same Message inside the card. What changes is the severity and what it carries: nothing after a 401, since the fields under it are the recovery; Retry when nobody can fix it; the two exits when the address is already registered.',
      icon: 'pi pi-lock',
      surface: 'Auth',
      save: 'Sign in / Sign up',
      path: '/forms/auth-errors'
    },
    {
      id: 'itemgroup-saves',
      title: 'ItemGroup with independent saves',
      description:
        'The ItemGroup surface (Item rows in a flush card) split by topic. Each group owns its own save. Approach A.',
      icon: 'pi pi-server',
      surface: 'Page',
      save: 'Save per group',
      path: '/forms/itemgroup-saves'
    }
  ]

  // The index is grouped, not one flat wall of twelve cards. A form type is chosen
  // by the QUESTION being asked — where does this form live, and what commits it —
  // so the groups are those questions, and each one carries its own documentation
  // link in the Section's left column: the reference sits next to the thing it
  // documents instead of once, at page level, for everything.
  const groups = [
    {
      id: 'page',
      title: 'On a page',
      hint: 'A form that owns its route. The user arrived to fill it in, so it gets the whole surface and one Save at the bottom.',
      ids: ['in-page', 'fields-separated', 'itemgroup', 'cardbox', 'itemgroup-saves']
    },
    {
      id: 'in-context',
      title: 'Over the page',
      hint: 'A form that opens on top of what the user was already doing, as a drawer beside the list or a dialog in front of it, and gives that context back when it closes.',
      ids: ['drawer', 'drawer-itemgroups', 'nested-drawer', 'dialog']
    },
    {
      id: 'outcomes',
      title: 'When it does not go through',
      hint: 'The other half of a form: what a rejection looks like, where it renders, and what happens when the work outlives the page that started it.',
      ids: ['error-validation', 'async-deployment', 'auth-errors']
    }
  ]

  // Each group resolved to its examples, in the order the group lists them.
  const sections = computed(() =>
    groups.map((group) => ({
      ...group,
      examples: group.ids.map((id) => examples.find((example) => example.id === id))
    }))
  )

  const open = (example) => router.push({ path: example.path, query: { email: userEmail.value } })

  // WHERE a form lives is decided before WHICH form it is, so the rule leads the page.
  // It is read from ../lib/surfaces.js — the same module the console's own creates are
  // catalogued in — so the counts printed here are the routes that actually exist.
  const rules = surfaceRules
  const counts = surfaceCounts()
  const exceptions = firstLevelDrawerExceptions
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms' }]"
  >
    <!-- No `gap` on the stack: the band below owns its own top space via
         `.layout-section-start` (= --layout-boundary-start, the same step
         `.layout-boundary` puts above the heading). -->
    <main class="flex h-full flex-col">
      <PageHeading
        size="medium"
        title="Forms"
        description="The form types on @aziontech/webkit. Every form shares the same Form Layout (spacing + hierarchy); a type only changes the container and its save model. Open an example to see it in a real flow."
      />

      <!-- The surface rule, above the catalogue: which container a form goes in is
           settled by what is being created, so it is not one of the choices below —
           it is the question answered before them. -->
      <div class="layout-section-start flex flex-col">
        <Section
          stacked
          title="Where a create lives"
          hint="The surface is a property of what is being created, not a choice each module makes. These three clauses decide it, in order."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="rule in rules"
                  :key="rule.id"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ rule.title }}</Item.Title>
                    <Item.Description>{{ rule.detail }}</Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Tag
                      :label="`${rule.surface} · ${counts[rule.surface]}`"
                      :severity="counts[rule.surface] ? 'info' : 'secondary'"
                      size="medium"
                    />
                  </Item.Actions>
                </Item>

                <!-- The exception is a row of the rule, not a footnote under it: it is
                     the shape the next exception has to match, and a reader who skims
                     the three clauses has to meet it in the same place. -->
                <Item
                  v-for="entry in exceptions"
                  :key="entry.id"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ entry.label }} is the one exception</Item.Title>
                    <Item.Description>
                      {{ entry.why }} A first-level drawer has to pass both halves of the test — a
                      single small tuple, AND normally created in bulk. Three fields alone is not
                      enough: a certificate has three and still creates on a page, because one
                      certificate is one deliberate act.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Tag
                      label="Drawer · 1"
                      severity="warning"
                      size="medium"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>
      </div>

      <!-- One `stacked` Section per group: the card grid needs the whole measure,
           so the title, its hint and its documentation link sit ABOVE the cards
           rather than in a column beside them. The rule and the band step between
           groups come from Section itself — this page spaces nothing by hand. -->
      <div class="flex flex-col">
        <Section
          v-for="group in sections"
          :key="group.id"
          stacked
          :title="group.title"
          :hint="group.hint"
        >
          <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="example in group.examples"
              :key="example.id"
              type="button"
              class="flex w-full flex-col gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
              @click="open(example)"
            >
              <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
                <span
                  class="flex size-2 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-3 text-(--primary)"
                >
                  <i
                    class="text-body-xs"
                    :class="example.icon"
                    aria-hidden="true"
                  />
                </span>
                <div class="flex items-center gap-(--spacing-xxs)">
                  <Tag
                    :label="example.surface"
                    severity="secondary"
                    size="medium"
                  />
                  <Tag
                    :label="example.save"
                    severity="info"
                    size="medium"
                  />
                </div>
              </div>
              <span class="flex w-full flex-col gap-(--spacing-xs)">
                <span class="text-label-md text-(--text-default)">
                  {{ example.title }}
                </span>
                <span class="text-body-xs text-(--text-muted)">
                  {{ example.description }}
                </span>
              </span>
            </button>
          </div>
        </Section>
      </div>
    </main>
  </AppLayout>
</template>
