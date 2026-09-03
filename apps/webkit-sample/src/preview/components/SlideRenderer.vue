<script setup>
  // KIND -> LAYOUT, and the two stage decisions that go with it.
  //
  // A slide's `kind` picks its layout component and nothing else about it. The two stage flags
  // are derived here rather than carried in the deck data, because they are consequences of the
  // layout, not editorial choices:
  //
  //   BLEED  the layout draws to the frame's rules — a cell grid or a split has no perimeter of
  //          its own, so it owns its padding and its own internal dividers.
  //   HATCH  the frame's texture, which in this language belongs to a band with no content of
  //          its own to compete with: the section dividers and the closing CTA.
  //   FRAME  off for a slide that draws its own perimeter. Exactly one does — the cover, whose
  //          shape is the deck's identity — and it needs the whole canvas, because half its
  //          composition (the mark, the platform line) sits outside the frame it drew.
  import SlideBackdrop from './SlideBackdrop.vue'
  import SlideBeforeAfter from './SlideBeforeAfter.vue'
  import SlideBullets from './SlideBullets.vue'
  import SlideCatalog from './SlideCatalog.vue'
  import SlideCells from './SlideCells.vue'
  import SlideClients from './SlideClients.vue'
  import SlideCopy from './SlideCopy.vue'
  import SlideCover from './SlideCover.vue'
  import SlideEvidence from './SlideEvidence.vue'
  import SlideLanes from './SlideLanes.vue'
  import SlidePlatform from './SlidePlatform.vue'
  import SlidePrinciple from './SlidePrinciple.vue'
  import SlideReasons from './SlideReasons.vue'
  import SlideScale from './SlideScale.vue'
  import SlideSplit from './SlideSplit.vue'
  import SlideStack from './SlideStack.vue'
  import SlideStage from './SlideStage.vue'
  import SlideTestimonial from './SlideTestimonial.vue'
  import SlideThanks from './SlideThanks.vue'
  import SlideVersus from './SlideVersus.vue'
  import SlideVision from './SlideVision.vue'
  import SpecimenMotion from './SpecimenMotion.vue'
  import SpecimenSpacing from './SpecimenSpacing.vue'
  import SpecimenType from './SpecimenType.vue'

  const LAYOUT = {
    cover: SlideCover,
    title: SlideCopy,
    section: SlideCopy,
    statement: SlideCopy,
    quote: SlideCopy,
    testimonial: SlideTestimonial,
    closing: SlideCopy,
    bullets: SlideBullets,
    catalog: SlideCatalog,
    clients: SlideClients,
    lanes: SlideLanes,
    backdrop: SlideBackdrop,
    grid: SlideCells,
    metrics: SlideCells,
    principle: SlidePrinciple,
    evidence: SlideEvidence,
    platform: SlidePlatform,
    reasons: SlideReasons,
    scale: SlideScale,
    split: SlideSplit,
    stack: SlideStack,
    'before-after': SlideBeforeAfter,
    thanks: SlideThanks,
    versus: SlideVersus,
    vision: SlideVision,
    'specimen-type': SpecimenType,
    'specimen-spacing': SpecimenSpacing,
    'specimen-motion': SpecimenMotion
  }

  const BLEED = new Set([
    'backdrop',
    'before-after',
    'clients',
    'evidence',
    'grid',
    'metrics',
    'reasons',
    'split',
    'stack',
    'specimen-type',
    'testimonial',
    'thanks',
    'versus',
    'vision'
  ])
  const HATCH = new Set(['section', 'closing'])
  const FRAMELESS = new Set(['cover'])

  const props = defineProps({
    slide: { type: Object, required: true },
    fit: { type: String, default: 'width' }
  })

  const layout = () => LAYOUT[props.slide.kind] ?? SlideCopy
</script>

<template>
  <SlideStage
    :fit="fit"
    :hatch="HATCH.has(slide.kind)"
    :bleed="BLEED.has(slide.kind)"
    :frame="!FRAMELESS.has(slide.kind)"
  >
    <component
      :is="layout()"
      :slide="slide"
    />
  </SlideStage>
</template>
