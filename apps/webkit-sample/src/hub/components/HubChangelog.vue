<script setup>
  // The Hub's CHANGELOG view — what changed in the console sample, written for
  // whoever receives the layout.
  //
  // It is a HIDDEN page: it carries no entry in HubSidebar and nothing in the Hub
  // links to it, so it is reachable only by its own URL (/site/hub/changelog).
  // That is the point — it is a link you hand to someone, not a section of the
  // library docs. It still renders inside the Hub shell (same rail, same framed
  // column) so a reader who arrives by link can walk into the rest of the Hub.
  //
  // Every entry pairs the DECISION with a live route: the sample is deployed, so
  // the honest way to document a layout decision is to point at the screen where
  // it is applied instead of describing it twice. Links open in a new tab and are
  // RELATIVE, so the page works the same on the deploy and on localhost.
  //
  // Long-form source of the same content: apps/webkit-sample/REPORT-ATUALIZACOES.md.
  // The numbering here mirrors that file so the two can be read side by side.
  import Link from '@aziontech/webkit/link'
  import Tag from '@aziontech/webkit/tag'
  import BannerContainer from '@shared/ui/layout/BannerContainer.vue'
  import PageHeader from '@shared/ui/layout/PageHeader.vue'
  import SectionContainer from '@shared/ui/layout/SectionContainer.vue'
  import SectionModule from '@shared/ui/layout/SectionModule.vue'

  // When this list was last revised. Deliberately NOT the deploy prefix: that
  // rotates on every publish, so a prefix printed here is stale the moment the
  // page ships — including on the very deploy that ships it.
  const UPDATED_AT = 'July 31, 2026'

  // One entry per update. `points` is the substance — `term` is the decision, `text`
  // is why it went that way; `table` is used only where the decision IS a mapping
  // (a measure per layout, a failure per surface); `links` are the screens.
  const entries = [
    {
      id: 'containers',
      title: '1. Container standard',
      summary:
        'Spacing and width stopped being a per-screen decision and became layout tokens, with three decisions declared exactly once — derived from the theme fluid scales, without a single media query.',
      points: [
        {
          term: 'Boundary',
          text: 'the distance from content to the app chrome. The top is one step larger than the sides, because the header border reads as a hard edge and the eye asks for more room there.'
        },
        {
          term: 'Rhythm',
          text: 'the distance between sections (step xl) and inside a band (step md). The gap always belongs to the parent, never to the child, so moving one does not drag the other.'
        },
        {
          term: 'Measure',
          text: 'how far the reading column may grow — and that varies by context: a data table wants width, a form does not.'
        },
        {
          term: 'Bulk maintenance',
          text: 'changing the breathing room of every settings page, or the width of every listing, is one token — not a sweep across dozens of screens. The set was written with semantic names and zero raw values so it can be promoted to @aziontech/theme as semantic/layouts and hold for any consuming app.'
        }
      ],
      table: {
        head: ['Layout type', 'Measure'],
        rows: [
          ['Listing (data, wide table)', '1620px'],
          ['Create (creation flow)', '1024px'],
          ['Settings', '876px'],
          ['Focused (home, creation center)', '1024px']
        ]
      },
      links: [
        { label: 'Listing', path: '/applications' },
        { label: 'Create', path: '/applications/new' },
        { label: '2nd-level listing', path: '/applications/1784552864?tab=main-settings' },
        { label: 'Settings', path: '/account' }
      ]
    },
    {
      id: 'switch',
      title: '2. Switch — color and shape',
      summary: 'Updated in the @aziontech/webkit package and reflected across the whole sample.',
      points: [
        {
          term: 'On track',
          text: 'moved from --success-contrast to --accent: more contrast, and aligned with the rest of the active controls.'
        },
        {
          term: 'Concentric radius',
          text: 'track on --shape-elements (6px) and handle on --radius (4px). 6px minus the 2px inset is exactly the inner radius, so the handle follows the curve of the track instead of being a pill inside another pill.'
        },
        {
          term: 'Handle stable across themes',
          text: 'a fixed white knob with a fixed black lock icon. Over the --accent track those two cannot invert with light/dark, or the on state loses legibility in one of the themes.'
        },
        {
          term: 'Baselines',
          text: '34 visual baselines regenerated (Switch, FieldSwitch, FieldSwitchBlock, FieldTextSwitch).'
        }
      ],
      links: [
        { label: 'Item group', path: '/forms/itemgroup' },
        { label: 'Account Settings', path: '/account' },
        { label: 'In-page form', path: '/forms/in-page' }
      ]
    },
    {
      id: 'command-menu',
      title: '3. Command Menu (global search)',
      summary:
        'The search field at the top of the sidebar became the affordance for ⌘K: a read-only field that opens the palette, instead of filtering the nav in place.',
      points: [
        {
          term: 'What the palette carries',
          text: 'the whole navigation (the same groups and labels as the rail) plus the app commands, with namespaced values so the handler can tell navigating from executing.'
        },
        {
          term: 'Works with the rail collapsed',
          text: 'the palette teleports to the body, so it does not depend on the sidebar being present.'
        },
        {
          term: 'A single owner for the shortcut',
          text: 'the copy of the sidebar inside the mobile drawer gets an empty shortcut, so ⌘K never opens two palettes at once.'
        }
      ],
      links: [{ label: 'Open it and press ⌘K', path: '/home' }]
    },
    {
      id: 'tenancy',
      title: '4. Organization / Account / Workspace chain',
      summary:
        'The global header now carries the entire identity chain — Azion / Organization / Account / Workspace — separated from location by a hairline, and only then the breadcrumb.',
      points: [
        {
          term: 'Identity ≠ location',
          text: 'the chain answers “who am I acting as”; the breadcrumb answers “where am I”. That is why identity left the rail and moved up to the header: it is global and cannot disappear when the rail collapses.'
        },
        {
          term: 'Three levels, three questions',
          text: 'the organization is who you belong to, the account is the infrastructure you operate, the workspace is the slice of it you are looking at.'
        },
        {
          term: 'Defined degradation',
          text: 'below md the workspace is the first link to go (three marks plus the hamburger and the actions would not fit); below lg the breadcrumb gives way, because the page repeats the last crumb and the chain is not repeated anywhere.'
        },
        {
          term: 'Accent per organization',
          text: 'it is the only place a tenant takes on color, and it exists so the operator who lives in three organizations can tell them apart before reading a single character.'
        }
      ],
      links: [{ label: 'Chain in the header', path: '/home' }]
    },
    {
      id: 'onboarding',
      title: '5. Onboarding — the organization is born at signup',
      summary:
        '/signup/personalize stopped existing and became /signup/onboarding: a single screen, where the first organization comes into being. It is born here because a user cannot be nowhere — if it were not created with the account, the console would open on an empty state whose only action is what signup should have done.',
      points: [
        {
          term: 'Three decisions',
          text: 'the user name, the organization name — asked separately, because a company is not named after its first user, and echoing one into the other reads as a bug the first time they diverge — and the brand (accent). Plus additional data, optional.'
        },
        {
          term: 'What is not asked',
          text: 'the first workspace (born as “My Workspace” and renamed later, but shown in the wire, because the console really does open scoped to it), the owner, and the status. They are consequences: whoever creates is owner and first Organization User, and the org is born active.'
        },
        {
          term: 'Two paths, one end',
          text: 'email signup lands here through the verification link; a social provider — which authenticates and vouches for the address — comes straight in, skipping verification. The lock is the union of both flags: only the pressed control shows loading, and no second path starts while one is in flight.'
        },
        {
          term: 'The wire',
          text: 'beside the form, the console drawn as a wireframe, with the parts the form decides rendered for real and everything else in gray. “Organization name” is abstract; “Azion / Acme Inc.” in a header is not. And the wire can never look like a usable screen, or the user reads it as a product loading and waits.'
        }
      ],
      links: [
        { label: 'Onboarding', path: '/signup/onboarding' },
        { label: 'Sign up (social path)', path: '/signup' }
      ]
    },
    {
      id: 'create-organization',
      title: '6. Creating an organization from inside the console',
      summary:
        'Subsequent organizations are created deliberately, at /organizations/new, through the New organization entry in the header switcher. The rest arrive by invitation — that is what makes Switch Account exist.',
      points: [
        {
          term: 'A page, not a modal',
          text: 'for the same reason as every module create: it has a beginning and an end, and the URL has to be linkable and safe under the back button. A focused creation shell, no sidebar.'
        },
        {
          term: 'One single shape',
          text: 'it runs the same createOrganization as onboarding, so an organization has the same shape whichever door it came in through: owner, active status, one workspace.'
        },
        {
          term: 'Creating also enters',
          text: 'the flow ends on home, not back where it started — the scope changed, and returning to a page still showing the previous organization rows would be a lie.'
        },
        {
          term: 'Required ≠ conflict',
          text: 'empty reveals the amber required; a name that collides with an organization the user already belongs to is the red invalid, because a conflict is not an omission.'
        },
        {
          term: 'Shared brand picker',
          text: 'both flows use the same picker, with swatches instead of previews of the generated art: the brand is generated from the name, so options painted with the live name would repaint on every keystroke. The color is the choice; the art is the name business.'
        }
      ],
      links: [{ label: 'Create Organization', path: '/organizations/new' }]
    },
    {
      id: 'filters',
      title: '7. Unified filter across listings',
      summary: 'Every listing now narrates the same way, on two decisions.',
      points: [
        {
          term: 'A picker per column, never a query builder',
          text: 'the columns decide the fields: each enumerable column gets a multi Select, the date column gets a range date picker, and the free-text columns are left to search instead of a field each.'
        },
        {
          term: 'Everything behind a popover',
          text: 'an IconButton with a count badge, to the left of search. Before there were four always-visible selects competing with search and with the actions in a 40px band: search — the control people actually use — was the first to lose width, and a fifth column had nowhere to go.'
        },
        {
          term: 'Applies on pick',
          text: 'there is no draft and no Apply: each picker is independently meaningful, so deferring application would only add a step and a second copy of the state. The footer carries what the panel really owes — undo everything at once, and the way out.'
        },
        {
          term: 'The badge is what saves you',
          text: 'a filter you cannot see is a filter you forget you turned on — the count on the trigger is what keeps a collapsed filter from becoming a forgotten one.'
        }
      ],
      links: [
        { label: 'Applications', path: '/applications' },
        { label: 'Workloads', path: '/workloads' },
        { label: 'Deployments', path: '/deployments' },
        { label: 'Edge DNS', path: '/edge-dns' },
        { label: 'Variables', path: '/variables' }
      ]
    },
    {
      id: 'field-error',
      title: '8. Reporting errors on fields',
      summary:
        'Scenario: a stale reference during creation. Two users in the same module; the second deletes the Edge Connector the first just selected. The first user browser is never told, and the error only surfaces on submit.',
      table: {
        head: ['Failure', 'Where it is reported'],
        rows: [
          [
            'Empty or malformed input (client-side)',
            'on the field itself — amber required / red invalid'
          ],
          ['Request failed, tied to no field (5xx)', 'error toast with Retry'],
          ['Request rejected, scoped to one field', 'Message inside the section that holds it']
        ]
      },
      points: [
        {
          term: 'Why not a toast in the third case',
          text: 'a toast dismisses itself and points nowhere, while the recovery sits in a Select six sections down.'
        },
        {
          term: 'Positional anchor',
          text: 'the form is long on purpose so the recovery is real: when the rejection arrives, the section holding the error is scrolled to the top, respecting prefers-reduced-motion. The Message animates its height in, so nothing below jumps.'
        },
        {
          term: 'Invalid, not required',
          text: 'the value is filled in, it is just no longer valid — so the field takes the red, never the amber prompt.'
        }
      ],
      links: [{ label: 'Error validation', path: '/forms/error-validation' }]
    },
    {
      id: 'async-action',
      title: '9. Async action with error and success',
      summary:
        'The opposite scenario: an action that outlives the screen (a ~30s deploy), and how the failure finds a user who has already left.',
      table: {
        head: ['The failure arrives…', 'Report it in…'],
        rows: [
          [
            'with the user on the form, scoped to one field',
            'Message in the section + invalid on the field'
          ],
          ['after they left, from a background job', 'toast — the only global surface']
        ]
      },
      points: [
        {
          term: 'The execution does not live in the component',
          text: 'timer, state, and toast sit at module scope, so navigating to another screen does not cancel the deploy: the page unmount is not an event the deploy listens to.'
        },
        {
          term: 'Progress is a loading toast',
          text: 'a spinner, with no auto-dismiss — the one thing that travels with the user across the whole console.'
        },
        {
          term: 'The error is permanent and closable',
          text: 'a failure the user did not witness cannot expire unseen; and what does not expire has to be closable by hand. The anatomy carries both exits (Redeploy and a shortcut to Deployments), because once dismissed the toast was the only reference to the failure on screen.'
        },
        {
          term: 'The card is a view, not the owner',
          text: 'it reads the current point of the execution, so whoever comes back mid-deploy picks up the logs where they actually are instead of watching them rewind.'
        }
      ],
      links: [
        { label: 'Success', path: '/forms/async-deployment?outcome=success' },
        { label: 'Error', path: '/forms/async-deployment?outcome=error' }
      ]
    },
    {
      id: 'buttons',
      title: '10. Button position and size, by page type',
      summary:
        'The rule is now derived from how the page is named, not from the module. Where Tabs exist, buttons are relative to them; on a listing the PageHeading goes and what remains is the create button at the level of the table with its filters.',
      points: [
        {
          term: 'Primary listing without tabs',
          text: 'no PageHeading — the module name is already the header crumb, and an h1 repeating it only pushes the table down and eats the first row above the fold. The page opens with what the user came to do: narrowing on the left (where the eye starts), actions on the right, table below, the two reading as one band. The controls sit outside the table toolbar because they belong to the page: the create button acts on the module, not on the table.'
        },
        {
          term: 'Primary listing with tabs',
          text: 'the tabs are the 2nd-level nav and carry the actions in their own slot, on the right. Each tab brings its own set of controls, because different tabs narrate different subjects and create different things. The active tab lives in the URL, so it is reloadable and linkable. The row is centered, not baseline-aligned: a 32px button centers against 30px items — aligning baselines makes the button hang 2px low and forces a manual nudge.'
        },
        {
          term: 'Inner pages',
          text: 'a detail page has no PageHeading: the tabs are the bottom edge of the header and the primary action rides the bar. The action can belong to the tab rather than the page (Deploy lives on the Build tab), declared alongside it and aware of its own pending state.'
        },
        {
          term: 'Title scale, when there is one',
          text: 'tied to nav depth, not to the module: medium on a 1st-level listing, small from detail downward (the breadcrumb already carries the context), large reserved for the page whose title is the content. A TabView under a 2nd-level nav bar keeps its title: the bar is navigation, not a heading.'
        }
      ],
      table: {
        head: ['Context', 'Heading', 'Where the buttons go'],
        rows: [
          [
            '1st-level listing, no tabs',
            'none (the crumb names it)',
            'at table level, next to the filter and search'
          ],
          ['1st-level listing, with tabs', 'none', 'on the tab bar; each tab has its own'],
          [
            'Inner page (detail)',
            'none (full-bleed tabs)',
            'on the tab bar; the action can belong to the tab'
          ],
          ['Settings / form', 'PageHeading small', 'in the form footer'],
          ['Page whose title is the content', 'PageHeading large', 'next to the content']
        ]
      },
      links: [
        { label: 'No tabs', path: '/applications' },
        { label: 'With tabs', path: '/deployments' },
        { label: 'Inner page with tabs', path: '/applications/1784552864?tab=build' },
        { label: 'Settings', path: '/account' }
      ]
    },
    {
      id: 'sidebar-drag',
      title: '11. Sidebar — collapsing is now a drag gesture',
      summary:
        'The rail no longer has only a toggle: its right edge is a focusable handle, and dragging is the gesture. Zero libraries — native pointer events.',
      points: [
        {
          term: 'Resize',
          text: 'drag between 256px and 408px. The bounds come from tokens read at runtime, not from magic numbers.'
        },
        {
          term: 'Collapse',
          text: 'pull 56px past the minimum and the rail leaves the layout instead of sticking at the minimum — the pull is the collapse, and the width it had is kept for when it comes back.'
        },
        {
          term: 'Reopen',
          text: 'pull the edge back: while the pointer is held the rail peeks, growing under the cursor with the edge exactly under the finger, and commits once it passes the snap. Opening feels like grabbing the rail by its edge and bringing it out, not pressing a button that reveals a panel.'
        },
        {
          term: 'Keyboard and persistence',
          text: 'arrows nudge by 16px, left past the snap collapses, right restores, double-click collapses. Width and state survive navigation and reload. The handle line only appears on hover, focus, or drag, so the rail reads as a clean edge at rest.'
        }
      ],
      links: [{ label: 'Drag the rail edge', path: '/home' }]
    },
    {
      id: 'variables',
      title: '12. Variables — creation drawer with .env import',
      summary:
        'The listing carried the creation form inside its own file. The form moved out into a dedicated drawer and the page kept only what a list owns: the records, the narrowing, and attaching whatever the drawer created.',
      points: [
        {
          term: 'A flat form',
          text: 'a Key / Value / Note trio repeated above a full-bleed divider, and the three settings below it. With one repeated group and three settings there is nothing for a section title to disambiguate — the divider already reads as the boundary between what the variables are and how they are stored.'
        },
        {
          term: 'A variable rarely comes alone',
          text: 'the trio is a repeater: Add Another appends an empty one and focuses the Key, every row past the first can be removed, and the list morphs on both actions, timed by the animation tokens.'
        },
        {
          term: 'Two bulk entries, one parser',
          text: 'Import in the footer reads a chosen .env, and pasting a file body into any Key input expands into one row per pair — instead of dumping the whole file into a single key, which is exactly what the footer hint promises.'
        },
        {
          term: 'Tolerant, but honest',
          text: 'it reads what a real .env has (export prefix, quotes, comments) and skips what it cannot read as a pair, so a stray line never becomes a variable named after half a sentence. No variable expansion and no multi-line values: the form round-trips neither, and half-supporting them in silence would be worse than skipping.'
        },
        {
          term: 'No Cancel',
          text: 'the panel X, the overlay, and Escape already close it; a second discard in the footer would only compete with Save for attention.'
        }
      ],
      links: [{ label: 'Variables → Create Variable', path: '/variables' }]
    },
    {
      id: 'submit-lock',
      title: '13. Submit state — what the screen says while it waits',
      summary:
        'A form locked by a 900ms request had two screens saying the wrong thing. The rule is now one: while waiting the fields are disabled, and nothing describing a field the user cannot operate stays on screen.',
      points: [
        {
          term: 'Disabled yes, helper no',
          text: 'on Sign Up both fields go :disabled with the scope, but the helper lines are removed while it is locked. A requirement line ("minimum 8 characters") under a field that accepts no typing instructs nothing, and the button :loading is already the message that a wait is happening.'
        },
        {
          term: 'A transient lock is not a padlock',
          text: 'FieldPassword and FieldSelect put disabled at the TOP of their own helper chain: with the field disabled the line gains a padlock and, in the password case, overrides invalid — a red error turned into gray padlocked text for 900ms. A padlock says "locked forever"; waiting on a request is not that.'
        },
        {
          term: 'Which is why the password is composed',
          text: 'the Sign Up password field became InputPassword + HelperText instead of FieldPassword: asking FieldPassword for an empty helper makes it invent "This field is locked." in its place. Composed from primitives, the screen decides what describes the field.'
        },
        {
          term: 'Nothing points at what does not exist',
          text: 'the aria-describedby of both fields leaves with the line, so no input references an element outside the DOM while the scope is locked.'
        },
        {
          term: 'Sign In follows the same divider as Sign Up',
          text: 'the hand-drawn hairline between email and social providers became the package Divider with the label "or", positioned BETWEEN the two paths — before, the Continue with Email button sat on the social side of the separator, which made the "or" separate the wrong thing.'
        },
        {
          term: 'Create Organization — the text column shrank',
          text: 'the four bands moved from 50/50 to 40/60 (guide on the left, fields on the right), with minmax(0,…) on each track so a long unbroken name cannot blow out the column.'
        }
      ],
      links: [
        { label: 'Sign In', path: '/login' },
        { label: 'Sign Up', path: '/signup' },
        { label: 'Create organization', path: '/organizations/new' }
      ]
    },
    {
      id: 'boundary-measure',
      title: '14. Boundary and measure — the inset does not come out of the measure',
      summary:
        'Deployments read 1572px of content where Workloads read 1615px, in the same viewport: the one listing in the console at a width no other used. The cause was not the page — it was the order between BOUNDARY and MEASURE, and it held for every page that applies its own boundary. One rule in the layout system instead of 24 page fixes.',
      points: [
        {
          term: 'The measure describes CONTENT',
          text: 'on a `padded` page AppLayout puts the inset on the scroll box, OUTSIDE the block carrying the cap — so --layout-measure arrives whole as content width. On every :padded="false" page (detail with tabs, the Deployments listing, the create flows, the forms) the boundary is applied on the SAME block as the measure, and with box-sizing: border-box the cap swallows the inset: 1620px of cap minus 24px per side = 1572px of content. The measure was describing something other than content, which is its only job.'
        },
        {
          term: 'When the boundary travels along, the cap grows by the inset',
          text: 'each column class declares its measure in --layout-column-measure, and a single rule adds the inset to the cap when the block also carries the boundary. Both forms now resolve to the SAME content column at any viewport — below the measure both are 100% minus the same inset, above it both are the measure, centered on the same axis. A page can gain or lose its own boundary (gain a tab bar, become padded) without changing width, and no page needs to know which form it is in.'
        },
        {
          term: 'The sticky bar joined the system',
          text: 'the ten action footers wrote px-(--layout-boundary-inline) by hand: it read the token, but sat outside the system — nothing tied the bar inset to that of the column it submits. It became .layout-boundary-inline, a class the measure rule sees, so the bar aligns with the body by construction rather than by coincidence (measured: body and bar at the same left/width across the six creation pages and the three forms).'
        },
        {
          term: 'Deployments kept its markup, changed its geometry',
          text: 'the tab bar is still full-bleed and the block still carries both classes, like every :padded="false" page — what changed is the resolved width. Measured at 1920px: padded listings, listing with tabs, detail with tabs, and tab views now all read an identical 281/1615; at 2560px, 599/1620.'
        },
        {
          term: 'Create Organization and Onboarding joined rule 13',
          text: 'the two screens that create an organization now follow "disabled yes, helper no": during the request the guide lines leave and aria-describedby leaves with them. On Onboarding that also erased the four "This field is locked." lines — the gap recorded in item 13 — without composing the select from primitives: it is enough NOT to pass :disabled to the FieldSelect, because the <fieldset :disabled> wrapping the form already blocks each trigger (it is a native button). The padlock only appeared because the wrapper answers its own disabled prop with a permanent blocking line, for a 900ms wait.'
        }
      ],
      table: {
        head: ['Context (at 1920px)', 'Content before', 'Content after'],
        rows: [
          ['Listing without tabs (padded)', '1615px', '1615px — reference, unchanged'],
          ['Deployments (listing with tabs)', '1572px', '1615px'],
          ['Detail with tabs and tab views', '1572px', '1615px'],
          ['Settings and forms', '976px', '1024px'],
          ['Create flows (body and sticky bar)', '1144px', '1192px']
        ]
      },
      links: [
        { label: 'Listing with tabs', path: '/deployments' },
        { label: 'Without tabs (reference)', path: '/workloads' },
        { label: 'Detail with tabs', path: '/applications/1784552864' },
        { label: 'Create organization', path: '/organizations/new' },
        { label: 'Onboarding', path: '/signup/onboarding' }
      ]
    }
  ]
</script>

<template>
  <BannerContainer max-width="7xl">
    <PageHeader
      size="page"
      eyebrow="Console sample"
      title="Changelog"
      margin-bottom=""
      description="What changed in the console sample — each decision with a link to the screen where it is applied. These are not screenshots: the links open the published app, so the behavior can be checked where it lives."
    >
      <template #actions>
        <Tag
          :label="`Updated ${UPDATED_AT}`"
          severity="info"
        />
      </template>
    </PageHeader>
  </BannerContainer>

  <SectionContainer max-width="7xl">
    <SectionModule
      v-for="entry in entries"
      :key="entry.id"
      :title="entry.title"
      :description="entry.summary"
    >
      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
        <!-- The substance: the decision in bold, why it went that way after it. -->
        <ul class="flex flex-col gap-(--spacing-md)">
          <li
            v-for="point in entry.points"
            :key="point.term"
            class="flex gap-(--spacing-sm) text-body-sm text-(--text-muted)"
          >
            <span
              class="mt-[0.55lh] size-(--spacing-xxs) shrink-0 rotate-45 bg-(--accent)"
              aria-hidden="true"
            />
            <p class="text-pretty">
              <strong class="font-medium text-(--text-default)">{{ point.term }}</strong>
              — {{ point.text }}
            </p>
          </li>
        </ul>

        <!-- Only where the decision IS a mapping. Scrolls on its own so a narrow
             viewport never makes the page scroll sideways. -->
        <div
          v-if="entry.table"
          class="overflow-x-auto rounded-(--shape-card) border border-(--border-default)"
        >
          <table class="w-full border-collapse text-left text-body-sm">
            <thead>
              <tr class="border-b border-(--border-default) bg-(--bg-surface)">
                <th
                  v-for="head in entry.table.head"
                  :key="head"
                  scope="col"
                  class="px-(--spacing-md) py-(--spacing-sm) text-body-xs font-medium text-(--text-default)"
                >
                  {{ head }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in entry.table.rows"
                :key="index"
                class="border-b border-(--border-muted) last:border-b-0"
              >
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  class="px-(--spacing-md) py-(--spacing-sm) align-top text-(--text-muted) first:text-(--text-default)"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- The screens. Relative paths, new tab: the reader keeps the changelog
             open while walking through what it describes. -->
        <div
          class="flex flex-wrap items-center gap-x-(--spacing-lg) gap-y-(--spacing-xs)"
        >
          <Link
            v-for="link in entry.links"
            :key="link.path"
            :label="link.label"
            :href="link.path"
            target="_blank"
            size="small"
          />
        </div>
      </div>
    </SectionModule>
  </SectionContainer>
</template>
