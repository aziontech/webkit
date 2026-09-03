<script setup>
  // Contact — a translation of https://www.azion.com/en/contact/ into this site's own page
  // language, produced with the /site-design-translate flow (the live page read mechanically
  // into a band inventory, then rebuilt band by band). The source is the specification for
  // WHAT the page says; CONTAINERS.md is the specification for HOW it is drawn. Every line of
  // copy below is the source's, verbatim; none of its grid, spacing, borders, colours or radii
  // came across.
  //
  // ── THE SOURCE'S SIX BANDS ────────────────────────────────────────────────────
  //
  //   0  hero, 2 columns          the pitch and its two actions | the contact form
  //   1  marquee, full-bleed      eleven client marks, no label
  //   2  `Our offices`            a centred h2 over four office cards
  //   3  EMPTY (spacer)           160px
  //   4  closing CTA, 2 columns   `Build once. / Run everywhere.`
  //   5  EMPTY (spacer)           80px
  //
  // Bands 0 and 1 are the source's only full-bleed ones and every band after them is inset —
  // which is exactly this language's own split, so the hero holds both and the framed column
  // opens at band 2.
  //
  // ── WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose ────────────────────────
  //
  //   • THE HERO IS ONE VIEWPORT. The source's opening band is 589px. Ours is `hero`, because
  //     that is this language's hero rule (CONTAINERS.md § the hero rule) and it is what the
  //     six sibling pages do. A change of FORM, not of content or running order.
  //
  //   • THE MARQUEE STANDS ON THE HERO'S FLOOR. The source draws it as its own band under the
  //     hero; both are full-bleed, and the strip is 169px of logos with no heading of its own.
  //     Putting it inside the band — copy and form at the top, marks on the floor, the leftover
  //     handed between them by `justify-between` — is what AzionHome does with the identical
  //     strip, so the two pages open the same way. Nothing is dropped and nothing is reordered:
  //     the marks still follow the copy, and they are still the last thing before the frame.
  //     It IS why our band count comes back lower than the source's; see the report.
  //
  //   • NO LABEL ON THE STRIP. The home page's carries `Trusted by mission-critical workloads`.
  //     This one carries nothing, because the source writes nothing there — a label would be
  //     an invention, and a plausible one is still an invention.
  //
  //   • THE REQUIRED MARKER IS THE DESIGN SYSTEM'S. The source appends a red `*` to six of its
  //     seven labels (`First Name:*`). Ours passes `required` to a `Label` we render ourselves,
  //     and it draws the system's own indicator: the same orange asterisk, plus the word
  //     `(Required)` beside it — so the marker carries a name a screen reader can read instead
  //     of being a bare glyph. The label TEXT is verbatim, including the source's own
  //     inconsistency: five labels end in a colon, `Phone` and `Message` do not.
  //
  //   • THE PHONE FIELD IS `FieldPhoneNumber`, NOT A TEXT BOX. The source ships a bare
  //     `type="text"` input named `mobilephone`. The design system has a complete field for this
  //     datum, so it wins: dial code, per-country mask and a digits-only model, none of which
  //     this page would otherwise get right by hand. Form, not content — the label and its
  //     optional status are still the source's.
  //
  //   • THE FORM POSTS NOWHERE, BUT BEHAVES AS IF IT DID. The source's is a HubSpot form with
  //     seven visible fields and eight hidden UTM/`form_action` inputs behind them. The hidden
  //     fields are tracking plumbing, not content, and this sample has no endpoint — so the
  //     request is a 900ms wait and the tracking inputs are not carried. Everything around it is
  //     the real contract (`/webkit-form`): validation on submit only, one flag locking the
  //     whole scope, the result reported as a toast, the lock released in `finally`.
  //     `Talk to Support` opens the source's live-chat widget, which this sample does not ship;
  //     it renders because the source renders it, and it goes nowhere for the same reason.
  //
  //   • `Send` IS TITLE CASE IN THE DOM. The source paints it `SEND` in CSS, and the same is
  //     true of every button on the page (`TALK TO SUPPORT`, `START FREE`). The verbatim string
  //     is the DOM's, so the label is `Send`; how our buttons are cased is `text-button-lg`'s
  //     business, not the copy's.
  //
  //   • TWO PARAGRAPHS, ONE `<p>`. The source sets its hero copy as two paragraphs that render
  //     as one continuous block. `HeroTitle`'s description region is a single paragraph, so the
  //     two sentences share it — with the phone number still the inline link the source makes
  //     it. Every word is present; one element is not.
  //
  //   • NO ASSET GAPS. All eleven marks resolve against this app's client registry, under its
  //     own names for three of them (`Itaú`, `América Móvil`, `GPA` — see data/contact.js).
  import Button from '@aziontech/webkit/button'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Label from '@aziontech/webkit/label'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { toast } from '@aziontech/webkit/toast'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { computed, reactive, ref } from 'vue'

  import BrandCarousel from '../../shared/ui/brand/BrandCarousel.vue'
  import { CONTACT_OFFICES, CONTACT_ROLES, CONTACT_TRUST_MARKS } from '../data/contact.js'
  import { CLIENTS } from '../ui/index.js'
  import SiteCta from './SiteCta.vue'

  // The strip's marks, resolved against the registry. A name with no mark still renders
  // (ClientMark falls back to a typographic wordmark), so the row stays the source's eleven
  // either way — as it happens, all eleven resolve.
  const trustMarks = computed(() =>
    CONTACT_TRUST_MARKS.map((name) => CLIENTS.find((client) => client.name === name) ?? { name })
  )

  // The form's own state, keyed by the source's own field names. Local because there is
  // nowhere to send it: this is a design reference, and a demo that posted a stranger's phone
  // number somewhere would be a worse lie than one that posts nothing.
  const form = reactive({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    company: '',
    mobilephone: '',
    message: ''
  })

  // `FieldPhoneNumber` carries its own dial code as a second model. The source's field is a bare
  // text input with no country control at all, so there is no source value to honour here — `US`
  // is the /en/ page's own audience and the first office the page lists.
  const phoneCountry = ref('US')

  // "" = valid. Populated ONLY by validate(), so no field shows feedback before a submit.
  const errors = reactive({
    firstname: '',
    lastname: '',
    email: '',
    role: '',
    company: '',
    message: ''
  })

  const submitting = ref(false)

  // The page's one inline-link treatment, declared once: the hero's phone number, and each office
  // card's phone and map links. All three do the same job — reach us at this number, at this
  // address — so they read the same, underlined in their paragraph's own ink rather than the
  // product UI's link blue. A flat literal string (not a computed class map, per the styling
  // rule), bound with `:class` so the call sites cannot drift apart.
  const LINK_CLASS =
    'underline underline-offset-2 transition-colors hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none'

  const REQUIRED = 'This field is required.'
  // Deliberately permissive — a shape check, not an RFC 5322 parser. Anything stricter rejects
  // addresses that are real, which is the worse failure for a form whose whole job is to be
  // reachable.
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Empty → the amber `required` prompt; present-but-malformed → the red `invalid` state.
  // Emptiness is the discriminator, so a field is never both at once.
  const validate = () => {
    errors.firstname = form.firstname.trim() ? '' : REQUIRED
    errors.lastname = form.lastname.trim() ? '' : REQUIRED
    errors.email = !form.email.trim()
      ? REQUIRED
      : EMAIL.test(form.email.trim())
        ? ''
        : 'Enter a valid e-mail address.'
    errors.role = form.role ? '' : REQUIRED
    errors.company = form.company.trim() ? '' : REQUIRED
    errors.message = form.message.trim() ? '' : REQUIRED
    return Object.values(errors).every((message) => !message)
  }

  // The sample has no endpoint, so the request is a 900ms wait — but everything around it is the
  // real contract: one re-entrancy guard, one flag locking the whole scope, the result reported
  // as a toast, and the lock released in `finally`.
  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      toast.success('Message sent.')
      Object.assign(form, {
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        company: '',
        mobilephone: '',
        message: ''
      })
    } catch (error) {
      toast.error('Could not send the message.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <!-- ══ Bands 0 + 1: the hero ══════════════════════════════════════════════════
       BannerContainer owns the full-bleed band and the page's top rule. `--banner-offset` is
       the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it. `dot-grid` is the texture every Site hero carries. -->
  <BannerContainer
    hero
    banner="dot-grid"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <!-- The band holds two things top to bottom: the copy-and-form row, and the trust strip
         standing on the floor. The wrapper declares the band's own height (one screen, less
         the container's `py-xl` at each end) and hands the leftover to the row with
         `justify-between` — which is what puts the marks on the bottom edge of ONE screen
         instead of floating them a third of the way up it. -->
    <div
      class="flex min-h-[calc(100dvh-var(--banner-offset,0px)-var(--spacing-xl)*2)] flex-col justify-between gap-(--spacing-xxl)"
    >
      <!-- `grid-cols-1` explicitly, not just the implicit single column: an implicit track is
           `auto`, which sizes to its content's max-content width and would let the form push
           the band past the viewport. `grid-cols-1` is `minmax(0, 1fr)`, which clamps that to
           zero. `items-center` seats the copy against the taller form half. -->
      <div class="grid flex-1 grid-cols-1 items-center gap-(--spacing-xxl) lg:grid-cols-2">
        <!-- Hero copy anatomy: headline → description → actions. No eyebrow, because the
             source writes none. -->
        <HeroTitle
          title="Talk to our Specialists"
          class="min-w-0"
        >
          <!-- The source's two paragraphs, in HeroTitle's one description region. The phone
               number is the inline link the source makes it — underlined, in the paragraph's
               own ink rather than the product UI's link blue, which is how the source draws
               it and what keeps a phone number inside a sentence from reading as a button. -->
          We are here to help and provide guidance on performance, security, and AI-native
          workloads. Feel free to give us a call at
          <a
            href="tel:+18333329466"
            :class="LINK_CLASS"
            >+1 833-332-9466</a
          >, use our live chat or submit your inquiry on the form.

          <template #actions>
            <!-- The source's chat widget is not part of this sample, so this control has
                 nowhere to go — it renders because the source renders it. -->
            <Button
              label="Talk to Support"
              kind="secondary"
              size="large"
            />
            <!-- A section CTA on this site is a `text` Button: Button's icon is leading-only
                 and Link paints the product UI's blue, so neither draws the source's trailing
                 orange arrow. The weight is what carries across. -->
            <Button
              label="Under CyberAttack?"
              kind="text"
              size="large"
              href="https://www.azion.com/en/lp/under-attack-mitigation/"
              target="_blank"
            />
          </template>
        </HeroTitle>

        <!-- THE FORM, in a registration frame. The source draws it as a bordered card with a
             radius; this language frames a box with crosshairs and keeps it square, so the
             form reads as a panel of the page rather than a card floating on it.

             It fills `--bg-surface` — the system's panel surface, one step off the canvas. The
             fill gives the dot-grid something to stop against, so the field borders read as the
             edges of a panel rather than boxes floating on the texture. -->
        <FrameBox class="bg-(--bg-surface) p-(--spacing-xl)">
          <!-- `novalidate`: this form owns its validation, so the browser's own bubble UI (which
               is unstyleable and inconsistent across engines) never fires. -->
          <form
            novalidate
            class="flex flex-col gap-(--spacing-lg)"
            @submit.prevent="submit"
          >
            <!-- ONE FIELDSET IS THE NATIVE SUBMIT LOCK. `:disabled` here blocks interaction with
                 the whole subtree while the request runs; each control ALSO takes `:disabled`
                 because webkit controls paint their disabled visual from their own prop, and a
                 fieldset alone would leave them looking active mid-submit. The legend is the
                 page's own h1 — the visible name of this group — so it is `sr-only` rather than
                 drawn twice. -->
            <fieldset
              :disabled="submitting"
              class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            >
              <legend class="sr-only">Talk to our Specialists</legend>

              <!-- EVERY FIELD RENDERS ITS OWN `Label` AND LEAVES THE WRAPPER'S `label` UNSET.
                   `field-*` couples its Label's required tag to the same `required` prop that
                   paints the field amber, so passing `required` for the tag alone lit every
                   mandatory field amber from first render — the "you got this wrong" state,
                   before the user had typed anything (measured: rgba(247,189,8,.5) on five of
                   seven fields at rest). Rendering the Label here keeps the tag persistent, and
                   the wrapper's `:required` now binds to the post-submit empty state, so only
                   the border and helper wait for a submit. -->
              <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <Label
                    for="contact-first-name"
                    required
                    >First Name:</Label
                  >
                  <FieldText
                    v-model="form.firstname"
                    input-id="contact-first-name"
                    name="firstname"
                    size="large"
                    autocomplete="given-name"
                    :disabled="submitting"
                    :required="!!errors.firstname"
                    :helper-text="errors.firstname"
                    @update:model-value="errors.firstname = ''"
                  />
                </div>
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <Label
                    for="contact-last-name"
                    required
                    >Last Name:</Label
                  >
                  <FieldText
                    v-model="form.lastname"
                    input-id="contact-last-name"
                    name="lastname"
                    size="large"
                    autocomplete="family-name"
                    :disabled="submitting"
                    :required="!!errors.lastname"
                    :helper-text="errors.lastname"
                    @update:model-value="errors.lastname = ''"
                  />
                </div>
              </div>

              <!-- The one field that can fail two ways: empty is the amber prompt, a malformed
                   address the red rejection. `!form.email.trim()` is the discriminator, so the
                   two are never both on. -->
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="contact-email"
                  required
                  >E-mail:</Label
                >
                <FieldText
                  v-model="form.email"
                  input-id="contact-email"
                  name="email"
                  type="email"
                  size="large"
                  autocomplete="email"
                  :disabled="submitting"
                  :required="!!errors.email && !form.email.trim()"
                  :invalid="!!errors.email && !!form.email.trim()"
                  :helper-text="errors.email"
                  @update:model-value="errors.email = ''"
                />
              </div>

              <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <!-- `for` points at the TRIGGER's id, which is what `input-id` sets on a
                       FieldSelect — labelling the wrapper would label nothing focusable. -->
                  <Label
                    for="contact-role"
                    required
                    >Role:</Label
                  >
                  <!-- The select opens unbound, so it needs its placeholder to paint anything at
                       all on the trigger — the source's own `Select your Role`. -->
                  <FieldSelect
                    v-model="form.role"
                    input-id="contact-role"
                    placeholder="Select your Role"
                    :options="CONTACT_ROLES"
                    size="large"
                    :disabled="submitting"
                    :required="!!errors.role"
                    :helper-text="errors.role"
                    @update:model-value="errors.role = ''"
                  />
                </div>
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                  <Label
                    for="contact-company"
                    required
                    >Company:</Label
                  >
                  <FieldText
                    v-model="form.company"
                    input-id="contact-company"
                    name="company"
                    size="large"
                    autocomplete="organization"
                    :disabled="submitting"
                    :required="!!errors.company"
                    :helper-text="errors.company"
                    @update:model-value="errors.company = ''"
                  />
                </div>
              </div>

              <!-- The one optional field, and one of the two labels with no colon — both the
                   source's. `FieldPhoneNumber` rather than a plain text input: it is the
                   complete field for this data, so the dial code, the per-country mask and the
                   digits-only model come with it instead of being a free-text box the sample
                   would have to validate by hand. Its Label carries no required tag, because
                   the source does not mark this field. -->
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label for="contact-phone">Phone</Label>
                <FieldPhoneNumber
                  v-model="form.mobilephone"
                  v-model:country="phoneCountry"
                  input-id="contact-phone"
                  name="mobilephone"
                  :disabled="submitting"
                />
              </div>

              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Label
                  for="contact-message"
                  required
                  >Message</Label
                >
                <FieldTextarea
                  v-model="form.message"
                  input-id="contact-message"
                  name="message"
                  :disabled="submitting"
                  :required="!!errors.message"
                  :helper-text="errors.message"
                  @update:model-value="errors.message = ''"
                />
              </div>
            </fieldset>

            <div class="flex justify-end">
              <!-- Button renders a hardcoded native `type="button"` and does not forward a
                   `type`, so the submit is driven from `@click` — passing `type="submit"` left
                   the control inert (measured: the rendered attribute stayed `button`). The
                   sr-only submit below is what keeps Enter working from inside a field. -->
              <button
                type="submit"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
              >
                Send
              </button>
              <Button
                label="Send"
                kind="secondary"
                size="large"
                :loading="submitting"
                @click="submit"
              />
            </div>
          </form>
        </FrameBox>
      </div>

      <!-- Band 1: the source's eleven marks, with no label because it writes none.
           `monochrome` is how the source paints this row — one white ink for every mark, so
           the one client that happens to ship a colour file is not the one the eye lands on. -->
      <BrandCarousel
        :clients="trustMarks"
        monochrome
      />
    </div>
  </BannerContainer>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band after the hero is a brick inside one centered column. The column carries only
       `border-x`; its top edge is the hero's `border-b` and its bottom edge the SiteFooter's
       `border-t`, so the four sides read as one frame with no doubled lines. -->
  <SectionContainer max-width="site">
    <!-- ── Band 2: the offices ──────────────────────────────────────────────────
         First module in the column, so `:divided="false"` — its top edge is already the hero's
         `border-b`. `:padded="false"` because the body is an edge-to-edge grid, and the
         module's own padding would pull it off the column's rules. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle title="Our offices" />
      </template>

      <!-- Only `y` — the left and right edges are the column's own `border-x`. `flush` and
           `marks="bottom"` say the same about the rule above: the SectionTitle in the `#header`
           slot is itself a frame and already draws its own bottom rule and its bottom pair of
           ticks, so this band owns only its floor. -->
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- Four cells, one per office, seams drawn by the grid's own `gap-px`. Each cell
             fills its own background or the gap trick paints the whole cell border-coloured. -->
        <CardGrid
          variant="divider"
          :columns="4"
          :mobile-columns="1"
        >
          <div
            v-for="office in CONTACT_OFFICES"
            :key="`${office.country}-${office.lines[1]}`"
            class="flex flex-col gap-(--spacing-md) bg-(--bg-canvas) p-(--spacing-lg)"
          >
            <!-- The source's own pin glyph, in the brand accent. Decorative: the country name
                 under it is the heading that names the card, so a screen reader that also
                 announced the icon would say the same thing twice. -->
            <i
              class="pi pi-map-marker text-(length:--text-body-lg) text-(--primary)"
              aria-hidden="true"
            />

            <div class="flex flex-col gap-(--spacing-xs)">
              <h3 class="m-0 text-heading-sm text-(--text-default)">{{ office.country }}</h3>
              <p
                v-for="line in office.lines"
                :key="line"
                class="m-0 text-body-md text-(--text-muted)"
              >
                {{ line }}
              </p>
              <!-- `Phone: ` is the source's own prefix and the number is its own link. -->
              <p class="m-0 text-body-md text-(--text-muted)">
                Phone:
                <a
                  :href="office.phoneHref"
                  :class="LINK_CLASS"
                  >{{ office.phone }}</a
                >
              </p>
            </div>

            <!-- Pushed to the cell's floor so four cards of unequal address length still share
                 one row of targets.

                 `outlined`, not `text`: the text kind draws no border and its hover is a
                 background plate, so at this size it read as grey copy rather than a control —
                 and forcing its padding off to align the label killed the plate entirely
                 (measured: transparent at rest AND hovered). An outlined button carries its own
                 edge, so the card's one action looks like one, and its box aligns on the card's
                 content column without any override. -->
            <div class="mt-auto pt-(--spacing-sm)">
              <Button
                label="Map"
                kind="outlined"
                size="medium"
                :href="office.map"
                target="_blank"
              />
            </div>
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- ── Band 3: the source's spacer ──────────────────────────────────────── -->
    <SectionGap hatch />

    <!-- ── Band 4: the closing CTA ──────────────────────────────────────────────
         The site's own closing band, every string the source's. The headline is one sentence
         in two tones, which is how the source sets it (`Run everywhere.` muted) and what this
         band's `title` / `titleMuted` pair already expresses. Three of the five strings differ
         from the band's defaults — the source says `Run everywhere.` where the home page says
         `Run anywhere.`, `lower latency` where it says `less latency`, and `Start Free` where
         it says `Start for free` — so all five are passed rather than inherited. -->
    <SiteCta
      eyebrow="Build"
      title="Build once."
      title-muted="Run everywhere."
      description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      primary-label="Start Free"
      secondary-label="Talk to our team"
    />

    <!-- ── Band 5: the closing spacer ───────────────────────────────────────────
         A bare FrameBox rather than SectionGap, at that component's own `medium` height,
         because this one must draw NO rules: the footer below opens with a full-bleed rule the
         way the hero closes with one, and SectionGap's fixed `borders="y"` would put a second
         hairline on that same pixel. Its sides stay the column's `border-x`. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
