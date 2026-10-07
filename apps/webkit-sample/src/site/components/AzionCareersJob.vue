<script setup>
  // The posting's own page — a translation of azion.com's job page into this site's language,
  // laid out the way vercel.com/careers/<posting> lays its own out. Two sources, and they are not
  // the same half:
  //
  //   CONTENT   https://www.azion.com/en/careers/job/?id=07f7d281-…  (read 2026-09-25, rendered)
  //   LAYOUT    https://vercel.com/careers/dev-rel-engineer-agentic-infrastructure-6122437004
  //
  // Both were read mechanically (the /site-design-translate extractor for the layout, a real
  // browser for the content — azion.com's description is an island that hydrates from an ATS, so
  // the static HTML carries none of it). Every string is the Azion page's; every edge, rule and
  // token is ours. Nothing of Vercel's comes across but the SHAPE, and even that is rebuilt out of
  // the primitives in CONTAINERS.md rather than copied.
  //
  // ── WHAT THE VERCEL PAGE IS, AND WHAT WE TOOK ──
  //
  // Its inventory is two bands: a 360px header, then one long body. Read at the DOM:
  //
  //   a header BAND        a meta row (department · locations · contract, each with a glyph),
  //                        the h1 under it, and a breadcrumb row under that
  //   the body             one framed row per section, the copy held in a column down the
  //                        left ~55% of the frame, the right side left as air
  //   the apply section    a heading and one line, then the form
  //
  // We take that running order exactly: the trail, the meta row, the headline, the section-per-row
  // body on a reading measure, the form at the end. What we do NOT take is its header height (its
  // band is 360px; ours is the language's own `band` rhythm), its grid, its rules, its radii, or
  // its type scale.
  //
  // ── WHERE OUR FORM DEPARTS, on purpose ──
  //
  //   • THE BANNER IS A BAND, NOT A SCREEN. The careers listing opens on `kind="screen"` because
  //     a listing's hero is the page's one statement. A posting's is not: the reader arrived to
  //     read the posting, and a full viewport of headline between the click and the first line of
  //     the role is a toll. `kind="band"` gives the title its own register and hands the body the
  //     rest of the screen.
  //
  //   • THE HEADER CARRIES AN APPLY ACTION, which Vercel's does not. Its form sits 4,000px below
  //     the fold and the only way to it is the scrollbar. Ours anchors to the form and the scroll
  //     is smooth (the shell's scroller owns that — see SiteLayout — with the reduced-motion
  //     escape the accessibility rule requires).
  //
  //   • AND SO DOES A RAIL, which is the same action again, sticky, beside the description. A
  //     header action solves the first screen; a posting runs four to six of them, so past the
  //     first the button is as far away as it was on the source. The rail is the site's own
  //     answer — the careers listing already parks a sticky column beside a long scroll — turned
  //     around: the rail sits on the RIGHT and owns the `border-l` between it and the reading
  //     column. It ENDS where the form begins, because a sticky `Apply` beside the form it points
  //     at is a button pointing at itself.
  //
  //   • THE BAND IS START-ALIGNED, not centred like every other hero on this site. A centred hero
  //     belongs to a page whose headline is its statement; this headline is a label on a document
  //     the reader reads down the start edge, so the trail, the facets, the h1 and the action all
  //     open on the frame's own inset — the vertical the body column and the rail hang from.
  //
  //   • THE DESCRIPTION IS PORTUGUESE. The source writes this posting's body in Portuguese inside
  //     an otherwise English page. Translating it is the one thing the translation rule forbids
  //     outright, so it stands as the source renders it. The chrome AROUND it is ours and follows
  //     the microcopy standard, which is why the form's labels lost the source's trailing colons
  //     and title case (`Email Address:` → `Email address`) — a form's labels are interface, not
  //     the posting's editorial copy.
  //
  //   • ONE BODY, 23 POSTINGS. The header is per-posting and accurate (title and the four facets
  //     come from the listing's own data); the description is the one posting we read. Stated in
  //     `careers-job.js`, repeated here because it is the page's one honest caveat.
  //
  //   • THE FORM SUBMITS TO NOTHING. There is no ATS behind this app, so the submit runs the real
  //     locked-scope shape (validate on submit, one flag disabling every control, the primary
  //     showing `loading`) and then reports the result where the reader is looking — a `Message`
  //     in the section's own place, since this shell mounts no toaster.
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldText from '@aziontech/webkit/field-text'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hero from '@aziontech/webkit/hero'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import Overline from '@aziontech/webkit/overline'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { computed, reactive, ref, useId } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { CAREERS_JOBS, jobFacets, jobId } from '../data/careers.js'
  import {
    CAREERS_JOB_CLOSING,
    CAREERS_JOB_FORM,
    CAREERS_JOB_SECTIONS,
    CAREERS_JOB_SENT
  } from '../data/careers-job.js'

  const route = useRoute()
  const router = useRouter()

  /**
   * The posting this page is about. Every way into this route is a row of our own listing, so an
   * id that matches nothing is a hand-typed URL; it falls back to the first posting rather than
   * rendering a page with no subject.
   */
  const job = computed(
    () => CAREERS_JOBS.find((entry) => jobId(entry) === route.params.id) ?? CAREERS_JOBS[0]
  )

  /**
   * The glyph each facet of the meta line gets, in the line's own order: department, location,
   * arrangement, contract. The order is the source's, so the pairing is positional — a facet the
   * line does not state simply is not rendered.
   */
  const FACET_ICONS = ['pi pi-sitemap', 'pi pi-map-marker', 'pi pi-building', 'pi pi-clock']

  const facets = computed(() =>
    jobFacets(job.value).map((label, index) => ({ label, icon: FACET_ICONS[index] }))
  )

  const trail = computed(() => [
    { label: 'Careers', href: '/site/careers' },
    { label: 'Jobs', href: '/site/careers/jobs' },
    { label: job.value.title, current: true }
  ])

  const formId = useId()
  const fieldId = (key) => `${formId}-${key}`
  const helperId = (key) => `${formId}-${key}-helper`

  const values = reactive(
    Object.fromEntries(CAREERS_JOB_FORM.fields.map((field) => [field.key, '']))
  )
  const phoneCountry = ref('BR')
  const errors = reactive(
    Object.fromEntries(CAREERS_JOB_FORM.fields.map((field) => [field.key, '']))
  )

  const submitting = ref(false)
  const sent = ref(false)

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const URL_PREFIX = /^https?:\/\/.+/

  /**
   * Empty is a prompt, a bad value is a rejection: the messages differ so the field can pick the
   * amber `required` state for one and the red `invalid` state for the other, never both.
   */
  function validate() {
    for (const field of CAREERS_JOB_FORM.fields) {
      const value = values[field.key].trim()

      if (field.required && !value) {
        errors[field.key] = 'This field is required.'
        continue
      }

      if (field.kind === 'email' && value && !EMAIL.test(value)) {
        errors[field.key] = 'Enter an email address like name@example.com.'
        continue
      }

      if (field.kind === 'url' && value && !URL_PREFIX.test(value)) {
        errors[field.key] = 'Enter the full URL, starting with https://.'
        continue
      }

      errors[field.key] = ''
    }

    return CAREERS_JOB_FORM.fields.every((field) => !errors[field.key])
  }

  const isEmpty = (key) => !values[key].trim()

  function clearError(key) {
    errors[key] = ''
  }

  function onResume(event) {
    values.resume = event.target.files?.[0]?.name ?? ''
    clearError('resume')
  }

  async function submit() {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      sent.value = true
    } finally {
      submitting.value = false
    }
  }

  function goToTrail(event, href) {
    event.preventDefault()
    router.push(href)
  }
</script>

<template>
  <!-- ══ The header band ════════════════════════════════════════════════════════
       A BAND, not a screen: the reader came for the posting, so the headline takes its own
       register and hands the rest of the viewport to the body. `--banner-offset` is the sticky
       SiteNav's height, which the band's inline inset reads the same way every other page's
       hero does.

       THE COLUMN IS START-ALIGNED, and that is the one place this page parts with the site's
       other heroes. A centred hero is right for a page whose headline IS its statement; a
       posting's headline is a label on a document the reader is about to read down the start
       edge, and centring it puts the title on one vertical and every line under it on another.
       Left-aligned, the trail, the facets, the h1 and the action all open on the band's own
       boundary inset — the vertical `/site/pricing` and `/site/contact` already open their
       start-aligned headlines on. That is NOT the body's copy vertical: a band is inset by
       `--layout-boundary-inline` (the nav's own), the framed column's copy by `--spacing-xl`
       from its rule, so the two sit ~25px apart at 1440 by design, not by drift. -->
  <Hero
    kind="band"
    max-width="site"
    texture="dots"
    texture-fade="bottom"
    class="[--banner-offset:3.5rem]"
  >
    <!-- No `items-*`: a flex column stretches its children, so every row opens on the
         container's start edge and the actions row can still go full width on a phone. -->
    <div class="flex flex-col gap-(--spacing-lg)">
      <!-- The trail leads now, where a start-aligned page puts it. Centred, it read as a
           caption under the headline; on the start edge it is the way back up, which is what
           it is. -->
      <Breadcrumb
        :items="trail"
        @navigate="goToTrail"
      />

      <!-- The meta line, as the four facets it already states. One glyph each, so the row reads
           as a set of attributes rather than a sentence broken by pipes. -->
      <ul class="flex flex-wrap items-center gap-x-(--spacing-lg) gap-y-(--spacing-xs)">
        <li
          v-for="facet in facets"
          :key="facet.label"
          class="inline-flex items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
        >
          <i
            :class="facet.icon"
            class="shrink-0 text-[0.875rem] leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          {{ facet.label }}
        </li>
      </ul>

      <!-- The action Vercel's header does not carry, in the slot this language keeps a hero's
           actions in — which is also what makes it full width on a phone and inline from 20rem
           up. A plain fragment link, so the shell's own `scroll-smooth` does the gliding and a
           middle-click still opens the page at the form. -->
      <Hero.Title :title="job.title">
        <template #actions>
          <Button
            label="Apply for this position"
            kind="secondary"
            size="large"
            href="#apply"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </Hero.Title>
    </div>
  </Hero>

  <SectionContainer max-width="site">
    <!-- ── The description, and the rail beside it ──────────────────────────────
         ONE module, one frame, two columns — the shape the listing already uses for its own
         rail, mirrored. The frame passes `:divided="false"` (its top edge is the hero's
         `border-b`) and `flush` (same reason), so it draws a single `border-b` under the whole
         row and the bottom pair of registration marks; nothing inside draws a second one.

         The vertical between the two columns is the RAIL's `border-l` and nothing else, exactly
         as the listing's rail owns its `border-r`. The cell stretches to the row's full height,
         which is what lets that one rule run the column's whole length while the box inside it
         is what actually follows the reader.

         Below `lg` the rail is GONE, not stacked. It exists so the action can follow a reader
         four screens down; in one column it cannot be sticky, so what is left is the band's own
         title, facets and button repeated three lines under the band — a second copy of the
         hero, not a summary. The narrow page keeps the hero's action and the form it points at,
         which is what the source gives too. It still leads in the DOM, where the reader meets
         the summary before the prose; explicit placement puts it in the second track from `lg`
         up without a second copy of the markup. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-[minmax(0,1fr)_var(--container-xs)]">
          <!-- ── The rail ───────────────────────────────────────────────────────
               What the reader keeps while the description scrolls past: the posting restated
               in one block, and the one action the page is for. `top-14` is the bar's own
               height, so the card lands one inset under it rather than behind it.

               `--container-xs` (348px), two rungs above the listing rail's 256, because the
               action sets the floor: the button measures 212px at its natural width and its
               label is `whitespace-nowrap`, so at `xl` a 256px rail put the label 52px past the
               button's own edges and a 300px rail still ate 5px off each side of its padding —
               neither clipped, so neither showed up as anything but a button that looked tight.
               348 leaves the inner column 252px, 40 clear. The reading column is unaffected
               either way: it clamps at its own measure long before the rail's width reaches it. -->
          <aside
            class="hidden border-(--border-default) lg:col-start-2 lg:row-start-1 lg:block lg:border-l"
          >
            <div class="sticky top-14 flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
              <!-- The h1 is four screens up by the time this matters, so the card restates it.
                   Not a second heading: a `p`, so the document still has one title at this
                   level and the rail does not enter the outline twice. -->
              <div class="flex flex-col gap-(--spacing-xs)">
                <Overline>{{ job.area }}</Overline>
                <p class="m-0 text-pretty text-heading-sm text-(--text-default)">
                  {{ job.title }}
                </p>
              </div>

              <!-- The same four facets the band states, stacked instead of flowed — the rail
                   has no room for a row of four. `items-start` because a facet that
                   wraps must keep its glyph on the first line. -->
              <ul class="flex flex-col gap-(--spacing-sm)">
                <li
                  v-for="facet in facets"
                  :key="facet.label"
                  class="flex items-start gap-(--spacing-xs) text-body-sm text-(--text-default)"
                >
                  <i
                    :class="facet.icon"
                    class="mt-[0.2em] shrink-0 text-[0.875rem] leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                  {{ facet.label }}
                </li>
              </ul>

              <!-- The same fragment link the band carries, full width in its own column. -->
              <Button
                label="Apply for this position"
                kind="primary"
                size="large"
                href="#apply"
                class="w-full"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </div>
          </aside>

          <!-- ── The description ────────────────────────────────────────────────
               One row per section, in the source's order, on a reading measure down the
               column's start edge the way the reference sets its own. The rule between two
               sections is the LOWER one's `border-t`, and the last one draws nothing — the
               frame's own `border-b` is already under it. -->
          <div class="min-w-0 lg:col-start-1 lg:row-start-1">
            <section
              v-for="(section, index) in CAREERS_JOB_SECTIONS"
              :key="section.title"
              class="border-(--border-default)"
              :class="index > 0 ? 'border-t' : ''"
            >
              <div
                class="flex max-w-(--layout-measure-content) flex-col gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-xxl)"
              >
                <SectionTitle
                  :framed="false"
                  kind="left"
                  size="small"
                  :title="section.title"
                />

                <template
                  v-for="(block, blockIndex) in section.blocks"
                  :key="blockIndex"
                >
                  <p
                    v-if="block.kind === 'text'"
                    class="m-0 text-pretty text-body-md text-(--text-default)"
                  >
                    {{ block.text }}
                  </p>
                  <ul
                    v-else
                    class="m-0 flex list-disc flex-col gap-(--spacing-sm) pl-(--spacing-lg)"
                  >
                    <li
                      v-for="item in block.items"
                      :key="item"
                      class="text-pretty text-body-md text-(--text-default)"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </template>
              </div>
            </section>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── Apply ────────────────────────────────────────────────────────────────
         The anchor the header's action points at. `scroll-mt-14` is the sticky bar's height, so
         the section lands under the bar instead of behind it. -->
    <SectionModule
      id="apply"
      :divided="false"
      :padded="false"
      class="scroll-mt-14"
    >
      <template #header>
        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <div class="max-w-(--layout-measure-content) px-(--spacing-xl) py-(--spacing-xxl)">
            <SectionTitle
              :framed="false"
              kind="left"
              :title="CAREERS_JOB_FORM.title"
              :description="CAREERS_JOB_FORM.description"
            />
          </div>
        </FrameBox>
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="max-w-(--layout-measure-form) px-(--spacing-xl) py-(--spacing-xxl)">
          <!-- What the reader gets instead of a toast: this shell mounts no toaster, so the
               result is reported in the place the form was, which is where they are looking. -->
          <Message
            v-if="sent"
            severity="success"
            size="medium"
            :label="`${CAREERS_JOB_SENT.title} ${CAREERS_JOB_SENT.description}`"
          />

          <!-- `novalidate` because the validation is ours; the native bubble is unstyleable and
               fires per field. One flag locks the scope: the fieldset is the native lock, and
               every control takes the same flag so the webkit inputs show their disabled state
               rather than merely refusing input. -->
          <form
            v-else
            novalidate
            class="flex flex-col gap-(--spacing-xl)"
            @submit.prevent="submit"
          >
            <fieldset
              :disabled="submitting"
              class="grid gap-(--spacing-lg) sm:grid-cols-2"
            >
              <legend class="sr-only">{{ CAREERS_JOB_FORM.title }}</legend>

              <!-- The Label is rendered here and always carries its required tag, so the field
                   advertises that it is mandatory from first render; only the wrapper's amber
                   state is held back until a failed submit. -->
              <div
                v-for="field in CAREERS_JOB_FORM.fields"
                :key="field.key"
                class="flex w-full flex-col gap-(--spacing-xs)"
                :class="field.kind === 'file' ? 'sm:col-span-2' : ''"
              >
                <Label
                  :for="fieldId(field.key)"
                  :label="field.label"
                  :required="field.required"
                />

                <FieldPhoneNumber
                  v-if="field.kind === 'phone'"
                  v-model="values[field.key]"
                  v-model:country="phoneCountry"
                  :input-id="fieldId(field.key)"
                  :name="field.key"
                  :disabled="submitting"
                  :required="!!errors[field.key] && isEmpty(field.key)"
                  :invalid="!!errors[field.key] && !isEmpty(field.key)"
                  :helper-text="errors[field.key] || field.helper || ''"
                  @update:model-value="clearError(field.key)"
                />

                <!-- No file field ships in the system, so this is the native control with the
                     label and helper wired by hand, which is what the loose-control fallback
                     asks for. The format note is the source's own, moved out of the label it
                     was written into. -->
                <template v-else-if="field.kind === 'file'">
                  <input
                    :id="fieldId(field.key)"
                    type="file"
                    :name="field.key"
                    :accept="field.accept"
                    :disabled="submitting"
                    :aria-describedby="helperId(field.key)"
                    :aria-invalid="!!errors[field.key] || undefined"
                    class="w-full text-body-sm text-(--text-default) file:mr-(--spacing-md) file:cursor-pointer file:rounded-(--shape-button) file:border file:border-(--border-default) file:bg-(--bg-surface) file:px-(--spacing-md) file:py-(--spacing-xs) file:text-label-sm file:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
                    @change="onResume"
                  />
                  <HelperText
                    :id="helperId(field.key)"
                    :kind="errors[field.key] ? 'required' : 'helper'"
                    :label="errors[field.key] || field.helper"
                  />
                </template>

                <FieldText
                  v-else
                  v-model="values[field.key]"
                  :input-id="fieldId(field.key)"
                  :name="field.key"
                  :disabled="submitting"
                  :required="!!errors[field.key] && isEmpty(field.key)"
                  :invalid="!!errors[field.key] && !isEmpty(field.key)"
                  :helper-text="errors[field.key] || field.helper || ''"
                  @update:model-value="clearError(field.key)"
                />
              </div>
            </fieldset>

            <!-- The webkit Button renders a native `type="button"`, so Enter inside a field
                 would not submit without a real submit control in the form. It is hidden from
                 the a11y tree and out of the tab order so the reader does not meet the same
                 action twice; implicit submission does not need it focusable. -->
            <button
              type="submit"
              tabindex="-1"
              aria-hidden="true"
              class="sr-only"
            >
              {{ CAREERS_JOB_FORM.submit }}
            </button>

            <div class="flex">
              <Button
                :label="CAREERS_JOB_FORM.submit"
                kind="primary"
                size="large"
                :loading="submitting"
                @click="submit"
              />
            </div>
          </form>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── The band the source closes on ────────────────────────────────────────
         Its own copy, its own way out, routed to this app's listing rather than azion.com's. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          class="flex max-w-(--layout-measure-content) flex-col gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-xxl)"
        >
          <SectionTitle
            :framed="false"
            kind="left"
            :title="CAREERS_JOB_CLOSING.title"
            :description="CAREERS_JOB_CLOSING.description"
          />
          <div class="flex">
            <Button
              :label="CAREERS_JOB_CLOSING.action"
              kind="secondary"
              size="large"
              @click="router.push('/site/careers/jobs')"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
