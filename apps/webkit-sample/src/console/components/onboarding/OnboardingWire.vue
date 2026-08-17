<script setup>
  // The onboarding preview — the console shell drawn as a WIRE at its real size,
  // with the few parts the onboarding form owns rendered for real.
  //
  // Why a wire and not a screenshot: the form asks for four things (the
  // organization's name, its mark, its first workspace, and who owns it) and
  // every one of them is something the user will read in the chrome for the rest
  // of their account's life. Showing that chrome while they type is what makes
  // the questions concrete — "Organization name" is abstract, `Azion / Acme Inc.`
  // in a header is not. Everything the form does NOT decide is deliberately a
  // grey bar: the preview must never look like a screen you can use, or the user
  // reads it as the product loading and waits.
  //
  // Why it is oversized and cropped rather than a small card that fits: a console
  // scaled down to fit a column reads as a diagram of a console. At real size the
  // header, the rail and the type are the ones the user is about to work in — so
  // the mock is built at full scale and simply RUNS PAST the page, dissolving
  // through a mask instead of stopping at a border. Nothing lines up with the form
  // beside it, which is the point: an edge that aligns reads as a finished panel,
  // and an edge that fades reads as a screen continuing out of view.
  //
  // The mask is `mask-r-from-*` + `mask-b-from-*` (Tailwind's composable edge
  // masks, intersected), so the fade is on the mock's own alpha — it needs no
  // overlay painted in the page's background colour, and it therefore stays
  // correct in both themes and over any surface.
  //
  // Live: the org mark + name, the workspace mark + name, the greeting, and the
  // rail's owner row. Grey: navigation, actions, metrics, table — all of it
  // `--bg-placeholder`, the theme's own placeholder fill.
  //
  // The figure is `aria-hidden` and `pointer-events-none`: it repeats what the
  // fields beside it already say, so to a screen reader it is noise, and to a
  // pointer it is not a target. Hidden below `lg`, where a full-scale console
  // cropped to a phone column would show its rail and nothing else.
  import Avatar from '@aziontech/webkit/avatar'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'

  import { accountInitials } from '../../lib/state/accounts.js'
  import OrgAvatar from '../shell/OrgAvatar.vue'

  defineProps({
    // Organization name — the header pill, and the seed for its generated mark.
    orgName: { type: String, default: '' },
    // Accent the mark is painted in: 'blue' | 'orange' | 'yellow'.
    accent: { type: String, default: 'blue' },
    // The organization's first workspace, the innermost link of the chain.
    workspaceName: { type: String, default: '' },
    // The person the organization is being created by — greeted in the content
    // and shown in the rail footer, where the real console shows the user.
    ownerName: { type: String, default: '' },
    ownerEmail: { type: String, default: '' }
  })

  // Navigation is structure, not content: what matters is that the rail reads
  // like the real one — a first group with no heading (Home, Workloads,
  // Deployments, Marketplace), then product areas each under a small overline —
  // and that the item widths vary the way real labels do instead of stacking as
  // identical blocks. `labelled` is what puts that overline above a group.
  const navGroups = [
    { id: 'top', labelled: false, items: ['58%', '76%', '48%', '66%'] },
    { id: 'build', labelled: true, items: ['70%', '44%', '80%', '54%'] },
    { id: 'secure', labelled: true, items: ['62%', '78%', '50%'] }
  ]
</script>

<template>
  <!-- The window onto the mock: it tracks the viewport height so the console
       fills the side of the page rather than floating in it.
       Which parts overflow it is deliberate. The console is WIDER than the
       window, so it is cropped horizontally — and the header and the rail are
       exactly window-height, the way they are exactly viewport-height in the real
       app, which keeps the rail's footer (the user) at the bottom edge instead of
       somewhere below it. Only the CONTENT column is taller, so the thing that
       runs past the fade is the resource list — the one part of a console that
       genuinely continues past the fold. -->
  <div
    class="relative hidden h-[calc(100dvh-12rem)] max-h-[40rem] min-h-[26rem] overflow-hidden mask-r-from-72% mask-b-from-80% lg:block"
  >
    <figure
      class="pointer-events-none absolute inset-y-0 left-0 m-0 flex w-[58rem] flex-col overflow-hidden rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) select-none"
      aria-hidden="true"
    >
      <!-- Header: the tenancy chain the console actually shows — the Azion mark,
           then the organization, then the workspace. A brand-new organization has
           no Group (one is created only when the user wants to group workspaces),
           so the chain is exactly two links deep on first access. -->
      <div
        class="flex h-(--size-14) shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) px-(--spacing-md)"
      >
        <!-- The glyph carries its own brand colour; it fits inside the box rather
             than filling it (21x18 viewBox, preserveAspectRatio), like the chain
             mark in the real header. -->
        <AzionLogoMin class="size-(--size-5) shrink-0" />

        <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <OrgAvatar
            :name="orgName"
            :accent="accent"
            size="small"
          />
          <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
            {{ orgName }}
          </span>
        </span>

        <span class="shrink-0 text-body-sm text-(--text-muted)">/</span>

        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
          <Avatar
            :label="accountInitials(workspaceName)"
            size="small"
            kind="square"
            class="size-(--size-5) shrink-0"
          />
          <span class="min-w-0 truncate text-label-md font-medium text-(--text-default)">
            {{ workspaceName }}
          </span>
        </span>

        <!-- Header actions: Create, Copilot, the account avatar. -->
        <span class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
          <span
            class="h-(--size-8) w-[5rem] rounded-(--shape-button) bg-(--bg-placeholder)"
          />
          <span
            class="h-(--size-8) w-[5.5rem] rounded-(--shape-button) bg-(--bg-placeholder)"
          />
          <span
            class="size-(--size-8) rounded-(--shape-button) bg-(--bg-placeholder)"
          />
        </span>
      </div>

      <div class="flex min-h-0 flex-1">
        <!-- The navigation rail, at the width the real one opens on. Full height
             of the window, so its footer sits on the bottom edge. -->
        <div
          class="flex w-[15rem] shrink-0 flex-col gap-(--spacing-md) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
        >
          <!-- The rail's search field (⌘K). -->
          <span
            class="h-(--size-9) w-full shrink-0 rounded-(--shape-button) bg-(--bg-placeholder)"
          />

          <template
            v-for="(group, groupIndex) in navGroups"
            :key="group.id"
          >
            <!-- The rule under the first group: in the real rail it separates the
                 console-wide entries from the product areas below them. -->
            <span
              v-if="groupIndex === 1"
              class="h-px w-full shrink-0 bg-(--border-muted)"
            />

            <div class="flex shrink-0 flex-col gap-(--spacing-sm)">
              <!-- The product area's overline. -->
              <span
                v-if="group.labelled"
                class="h-[0.375rem] w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
              />
              <span
                v-for="(width, itemIndex) in group.items"
                :key="`${group.id}-${itemIndex}`"
                class="flex items-center gap-(--spacing-sm)"
              >
                <span
                  class="size-(--size-4) shrink-0 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-[0.5rem] rounded-(--shape-elements) bg-(--bg-placeholder)"
                  :style="{ width }"
                />
              </span>
            </div>
          </template>

          <!-- The rail footer is the user, in the real console and here: the
               organization's first Organization User, who is also its Owner. -->
          <div
            class="mt-auto flex min-w-0 shrink-0 items-center gap-(--spacing-xs) border-t-(length:--border-width-default) border-(--border-muted) pt-(--spacing-md)"
          >
            <Avatar
              :label="accountInitials(ownerName)"
              size="medium"
              kind="square"
            />
            <span class="flex min-w-0 flex-col">
              <span class="truncate text-label-sm text-(--text-default)">{{ ownerName }}</span>
              <span class="truncate text-body-xs text-(--text-muted)">{{ ownerEmail }}</span>
            </span>
          </div>
        </div>

        <!-- Content: the console's Resources home. The greeting and the workspace
             line are real; the metrics and the resource table are wire. The inner
             column is taller than the window and clipped by this cell, so the
             list runs off the bottom instead of ending in it. -->
        <div class="min-w-0 flex-1 overflow-hidden bg-(--bg-canvas)">
          <div class="flex min-h-[44rem] flex-col gap-(--spacing-lg) p-(--spacing-lg)">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <p class="truncate text-heading-sm text-(--text-default)">
                Hello, {{ ownerName }}
              </p>
              <p class="truncate text-body-sm text-(--text-muted)">
                {{ workspaceName }} · no workloads yet
              </p>
            </div>

            <!-- Metric tiles. -->
            <div class="grid grid-cols-4 gap-(--spacing-md)">
              <span
                v-for="tile in 4"
                :key="`tile-${tile}`"
                class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
              >
                <span
                  class="h-[0.5rem] w-2/3 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-[0.875rem] w-1/2 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
              </span>
            </div>

            <!-- The resource table the console opens on. It carries more rows than
               the window shows, so the crop reads as a list that continues. -->
            <div
              class="flex flex-1 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
            >
              <span
                class="flex shrink-0 items-center justify-between border-b-(length:--border-width-default) border-(--border-muted) p-(--spacing-md)"
              >
                <span
                  class="h-[0.5rem] w-[28%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-(--size-8) w-[6rem] rounded-(--shape-button) bg-(--bg-placeholder)"
                />
              </span>
              <span
                v-for="row in 7"
                :key="`row-${row}`"
                class="flex shrink-0 items-center gap-(--spacing-lg) px-(--spacing-md) py-(--spacing-md)"
              >
                <span
                  class="h-[0.5rem] flex-1 rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-[0.5rem] w-[18%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
                <span
                  class="h-[0.5rem] w-[10%] rounded-(--shape-elements) bg-(--bg-placeholder)"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  </div>
</template>
