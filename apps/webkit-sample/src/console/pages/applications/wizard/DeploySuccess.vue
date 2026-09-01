<script setup>
  // THE OUTCOME — what shipped, what Azion built to serve it, and what to do next.
  //
  // This is not a step: the wizard's steps are questions, and by the time this renders
  // there is nothing left to ask. It is the flow's terminal phase, so it drops the rail,
  // the bar and the step card entirely and becomes the page.
  //
  // THREE BLOCKS, and the order is the reader's own order of interest:
  //   the heading   — it worked, and where.
  //   what shipped  — the chain that was provisioned to serve it. It used to be that
  //                   list beside a still of the deployed page, two-up; the still was a
  //                   stock thumbnail of a page nobody has loaded yet, so it showed the
  //                   template's marketing shot rather than this deploy.
  //   next steps    — not part of what happened; what to do about it.
  //
  // It came out of the old /deploy page, which was this flow's last step living at its
  // own URL. Same content, now inside the flow that produced it.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'

  const props = defineProps({
    // The chain the deploy provisioned: Workload → Application → Connector → Storage,
    // in creation order (../../../../shared/lib/provisioning.js → resourceChain).
    resources: { type: Array, default: () => [] },
    // Where it was deployed — the Git scope, or the workspace when there is no repo.
    scope: { type: String, default: '' },
    // WHAT HAPPENED, in the flow's own words. A deploy shipped code; a from-scratch
    // create made the layer and shipped nothing, so a heading reading "Application
    // deployed" over it would be the one claim on the screen that is false.
    title: { type: String, default: 'Application deployed' },
    lead: { type: String, default: 'You deployed a new application.' },
    // WHAT TO DO ABOUT IT — not part of what happened. Empty means the post-deploy
    // three below; a flow that ends somewhere else hands up its own, and a step with a
    // `to` is a route inside the console rather than a documentation link.
    nextSteps: { type: Array, default: () => [] }
  })

  // `manage` is the page's terminal action; `select` is a next step that DOES something
  // on this page rather than going somewhere — running the deploy in place, for one.
  defineEmits(['manage', 'select'])

  // The heading is a claim about the whole list, so it cannot say "created" when one of
  // the rows was BOUND — a create that binds an existing firewall provisioned three
  // resources and reused a fourth.
  const resourcesTitle = computed(() =>
    props.resources.some((resource) => resource.state === 'bound')
      ? 'Resources'
      : 'Resources created'
  )

  // Post-deploy next steps. Documentation links, so each row is a real navigable <a>.
  const DOCUMENTATION = 'https://www.azion.com/en/documentation/'

  const DEFAULT_NEXT_STEPS = [
    {
      icon: 'pi pi-globe',
      title: 'Customize domain',
      description: 'Associate a custom domain and subdomains to Azion to handle user access.'
    },
    {
      icon: 'pi pi-sitemap',
      title: 'Point traffic',
      description:
        'Redirect the traffic of a domain to Azion and take advantage of the distributed network.'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'View analytics',
      description: 'Gain powerful insights into your performance, availability, and security.'
    }
  ]

  // The prop wins when it has anything in it. A default FACTORY cannot name this list —
  // props are resolved before setup runs, so the constant is not in scope there — and
  // resolving it here keeps the fallback one declaration instead of two.
  const steps = computed(() => (props.nextSteps.length ? props.nextSteps : DEFAULT_NEXT_STEPS))
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-xl)">
    <!-- The congratulation is the page's own heading, on the canvas — not a card
         header. It announces the outcome; the cards below are the record of it.

         IT ARRIVES, in two beats. The run this replaces held the same column for as long
         as the deploy took, so the outcome swapping in on a single frame reads as the
         deployment card mutating rather than as the flow reaching its end. So the two
         blocks settle in: `animate-content-enter` (the catalog's arrival for content
         landing inside a page ALREADY on screen — not `page-enter`, no route changed),
         the heading first and the record one `fast-01` behind it. The stagger is what
         makes it choreography — simultaneous arrival is just a fade. -->
    <header
      class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-xxs)"
    >
      <h1 class="text-balance text-heading-lg text-(--text-default)">{{ title }}</h1>
      <p class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
        {{ lead }}
        <template v-if="scope">
          into
          <Tag
            :label="scope"
            severity="secondary"
            icon="pi pi-github"
          />
        </template>
      </p>
    </header>

    <!-- THE RECORD, as two cards on the canvas — NOT two cards inside a third. The
         outer box that used to hold them (and the Manage button in its footer) framed
         content that was already framed: each list carries its own border, its own
         header rule and its own dividers, so the wrapper spent a second border and two
         paddings restating an edge that was already drawn, and narrowed both lists to
         do it. What it did own — the arrival beat — is the only thing left of it: this
         div carries the stagger and nothing visual. -->
    <div
      class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
    >
      <!-- WHAT WAS PROVISIONED. It used to share a box with a still of the deployed
           page, two-up: the reader's own result beside the chain that serves it. The
           still is gone — it was a stock thumbnail standing in for a page nobody has
           loaded yet, so it illustrated the template's marketing shot rather than the
           deploy, and it took half of the widest card on the screen to do it. The
           record of what shipped is the list.

           The title is the card's own `title` — the header the component draws is the
           header this needs, inset on the same line as the rows beneath it, instead of
           a hand-rolled <p> that sat 4px left of them. -->
      <CardBox
        :title="resourcesTitle"
        :padded="false"
      >
        <template #content>
          <Item.List>
            <Item
              v-for="resource in resources"
              :key="resource.key"
              size="small"
            >
              <Item.Media>
                <span
                  class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                >
                  <i
                    :class="resource.icon"
                    class="text-[0.875rem] leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ resource.name }}</Item.Title>
                <Item.Description>
                  {{ resource.kind }} · {{ resource.reference }}
                </Item.Description>
              </Item.Content>
              <Item.Actions>
                <!-- Per ROW, because not every row is the same claim: a create can
                     BIND a firewall that already existed, and labelling it "Created"
                     would credit this flow with work it did not do. -->
                <Tag
                  :label="resource.state === 'bound' ? 'Bound' : 'Created'"
                  :severity="resource.state === 'bound' ? 'info' : 'success'"
                  size="small"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>

      <CardBox
        title="Next steps"
        :padded="false"
      >
        <template #content>
          <Item.List>
            <!-- as-child: the row shell (layout + hover ghost + focus ring) is
                 merged onto the anchor, so each next step is one real navigable
                 <a> instead of a <div> wrapping a link. -->
            <Item
              v-for="step in steps"
              :key="step.title"
              as-child
              size="small"
            >
              <!-- A step that names a ROUTE is a RouterLink and a step that names a
                   document is an anchor: they go to different kinds of place, and a next
                   step inside this console must not open a new tab to get there. Two
                   elements and not one `<component :is>`: `as-child` clones the single
                   slot vnode, and a dynamic component resolved through it never reaches
                   RouterLink's own render — the row came out as a bare `<a>` with no
                   `href`, navigating nowhere. `v-if`/`v-else` still yields exactly one
                   vnode, which is all `as-child` requires. -->
              <!-- A step with neither a route nor a document is an ACT on this page: the
                   in-place deploy. It is a real <button>, not an <a> to nowhere. -->
              <button
                v-if="!step.to && !step.href && step.action"
                type="button"
                class="w-full text-left"
                @click="$emit('select', step)"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-[0.875rem] leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <!-- The mark rides IN the title, not in `Item.Actions`: it qualifies
                       the label, and the row's right edge already belongs to the
                       chevron. `Item.Title` is a flex row, so it needs no wrapper.
                       `primary` and not a status severity — the tinted brand chip
                       reads as an endorsement, where the solid `info`/`success` fills
                       in the card above are claims about what a resource IS. -->
                  <Item.Title>
                    {{ step.title }}
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </Item.Title>
                  <Item.Description>{{ step.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </button>

              <RouterLink
                v-else-if="step.to"
                :to="step.to"
                class="text-left no-underline"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-[0.875rem] leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <!-- The mark rides IN the title, not in `Item.Actions`: it qualifies
                       the label, and the row's right edge already belongs to the
                       chevron. `Item.Title` is a flex row, so it needs no wrapper.
                       `primary` and not a status severity — the tinted brand chip
                       reads as an endorsement, where the solid `info`/`success` fills
                       in the card above are claims about what a resource IS. -->
                  <Item.Title>
                    {{ step.title }}
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </Item.Title>
                  <Item.Description>{{ step.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </RouterLink>

              <a
                v-else
                :href="step.href ?? DOCUMENTATION"
                target="_blank"
                rel="noopener"
                class="text-left no-underline"
              >
                <Item.Media>
                  <span
                    class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                  >
                    <i
                      :class="step.icon"
                      class="text-[0.875rem] leading-none text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <!-- The mark rides IN the title, not in `Item.Actions`: it qualifies
                       the label, and the row's right edge already belongs to the
                       chevron. `Item.Title` is a flex row, so it needs no wrapper.
                       `primary` and not a status severity — the tinted brand chip
                       reads as an endorsement, where the solid `info`/`success` fills
                       in the card above are claims about what a resource IS. -->
                  <Item.Title>
                    {{ step.title }}
                    <Tag
                      v-if="step.recommended"
                      label="Recommended"
                      severity="primary"
                      size="small"
                    />
                  </Item.Title>
                  <Item.Description>{{ step.description }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <i
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </a>
            </Item>
          </Item.List>
        </template>
      </CardBox>

      <!-- Manage opens the created workload — the chain's entry point — instead of
           dropping the reader back on a list to find the row they just made. It is the
           PAGE's terminal action, so it stands on the canvas under the record rather
           than in the footer of one of the two cards, neither of which it belongs to.
           No glyph: the arrow read as "next", which is the one thing this button is
           not — the flow is over, and this leaves it for the resource it made. -->
      <Button
        class="w-full"
        label="Manage"
        kind="secondary"
        size="large"
        @click="$emit('manage')"
      />
    </div>
  </div>
</template>
