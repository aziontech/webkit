// THE DECK — content only, no layout.
//
// One entry per slide, in presentation order. `kind` picks the layout (SlideRenderer maps
// it to a component); everything else is copy. Nothing in this file decides a colour, a
// size or a position — that is the layouts' job, working from lib/deck-canvas.js — so a
// deck is rewritten by editing this file alone, and the Figma build reads the same objects.
//
// `section` is the slide grid ROW a slide belongs to. Consecutive slides sharing a section
// become one row in Figma Slides, which is what the editor labels beside the row and what
// Presenter View lets a speaker jump between. Keep the names short (1-3 words).
//
// SPEAKER NOTES complement the slide, they do not repeat it: why a number matters, what a
// question usually follows, where the source is. Figma takes them as markdown (lists, bold,
// italic and strikethrough only — no headings, no code spans, no links).

export const DECK = {
  title: 'Azion Webkit — the framed grid',
  slides: [
    // ── Opening ──────────────────────────────────────────────────────────────────────
    {
      // The cover is its own layout, not the `title` one: it draws the brand's chamfered frame
      // and puts the mark and the platform line below it. `title` is still there — swapping
      // this `kind` back gives the hero-shaped opener with an eyebrow, a highlight and a meta
      // strip instead.
      kind: 'cover',
      section: 'Opening',
      eyebrow: 'Design system',
      headline: 'One system, every surface.',
      description:
        'Tokens, components and page language for the console, the marketing site and the docs — built from one source, verified in both themes.',
      tagline: 'The web platform for modern workloads',
      notes:
        'Open on the frame, not the copy.\n- The cut corner, the three marks and the texture ramp are the brand cover; the square frame every later slide carries is the deck-level promise that **everything here is drawn on a grid**\n- Say the three surfaces out loud — console, site, docs — that trio is the argument for a system at all'
    },
    {
      kind: 'statement',
      section: 'Opening',
      headline:
        'A design system is not a component library. It is the set of decisions nobody has to make twice.',
      attribution: 'The premise',
      notes:
        'The pause slide. Let it sit for a beat before moving.\n- If someone pushes back, the concrete version is the next section: six token families, one name each'
    },

    // ── The vision ───────────────────────────────────────────────────────────────────
    {
      // The one slide whose artwork is the GROUND rather than an element on it: the map runs
      // edge to edge and the frame's rules cut it, with a left-to-right wash holding the copy
      // column on canvas. `marks` names logos the app already ships (resolved against the
      // site's own client and tool registries), and `note` is the line that draws the
      // conclusion under them — both are shapes only this layout reads.
      kind: 'backdrop',
      section: 'Vision',
      eyebrow: 'The problem',
      headline: 'Perimeter security was not built for modern applications',
      bullets: [
        'Centralized security creates inspection bottlenecks, adds latency, and introduces regional points of failure.',
        'Legacy controls were not designed for distributed, API-driven, real-time, AI-enabled applications.',
        'Private data centers lack elastic scale and global reach when they are needed most.'
      ],
      // The asset the layout draws ON the map: one request, from a user in Brazil to a data
      // centre in the US. `place` names a point in the artwork's own coordinates (the
      // gazetteer is in shared/ui/banners/map-framing.js) rather than a position on the
      // slide, so the two markers stay on their coastlines if the crop ever moves.
      route: {
        from: { label: 'User', place: 'br-southeast', icon: 'pi pi-user' },
        to: { label: 'Data center', place: 'us-east', icon: 'pi pi-database' }
      },
      marks: {
        label: 'Built for the perimeter',
        // Names, not files — the layout resolves each one against the registries the
        // marketing site reads, so a mark is never imported twice in this repo.
        names: ['AWS', 'GCP', 'Azure', 'Equinix']
      },
      note: 'This architectural mismatch increases risk, slows mitigation, and limits resilience in modern digital environments.',
      notes:
        'The problem the next slide answers — state it as an ARCHITECTURAL mismatch, not as a vendor complaint.\n- The logos are the stack the room already runs; the claim is about where the controls SIT, not about who makes them\n- The map behind it is doing an argument of its own: the security has to be everywhere the map is\n- If someone asks for the numbers, the latency and mitigation figures live in the network deck, not here'
    },
    {
      // The one slide with an image on it, and the image is the site's own map — turning inside
      // a circular crop, with traffic drawn between arbitrary pairs of the artwork's own PoPs.
      // `pillars` is a shape only this layout reads: three peers, each an index, a claim and
      // the four moves that make it true.
      //
      // It carries NO `route`. The previous slide's drawing is one request between two named
      // ends, because its claim is about a single long trip; this one is the answer to that
      // claim, so its drawing has no ends to name — the mesh reads the artwork's PoP field
      // straight out of the gazetteer and needs nothing from the deck content.
      kind: 'vision',
      section: 'Vision',
      headline: 'Modern Applications',
      description:
        "Meet your customers' changing needs with applications that provide highly personalized experiences and change dynamically to respond to events in real time.",
      label: 'Our Vision',
      pillars: [
        {
          title: 'Runs Distributed',
          points: [
            'Provides global low-latency & high reliability',
            'Provide Infrastructure Interoperability',
            'Enables Immersive experiences',
            'Embrace modern Infrastructure'
          ]
        },
        {
          title: 'Delivers Business Agility',
          points: [
            'Deliver great developer experience',
            'Adopt composable architectures',
            'Adopt modern design patterns',
            'Embrace an AI-first mindset'
          ]
        },
        {
          title: 'Adheres to Zero Trust Security',
          points: [
            'Deliver a robust IAM',
            'Enables micro-segmentation',
            'Enables continuous authentication',
            'Adopt modern endpoint security'
          ]
        }
      ],
      notes:
        'The why, before any of the how. Three pillars, four moves each — read the pillars, not the bullets.\n- The globe is the same artwork the marketing hero carries, so this is the deck showing the system rather than describing it\n- If someone asks which pillar the design system serves: **all three**, and the second one is the one it is measured on'
    },

    {
      // THE BORROWED LINE. The vision above is ours; this is the same claim in somebody
      // else's mouth, which is the one thing an internal deck cannot say for itself. So it
      // gets the deck's only photograph: `testimonial` runs it full bleed, cut by the frame's
      // rules, and puts the sentence on an opaque card over the first four columns.
      //
      // `headline` and `attribution` are the same two keys the text-only `quote` slide uses —
      // the sentence and its source — plus `role`, the second caption line, and `image`, a
      // path Vite serves from `public/`. The file is dropped in by hand (public/quotes/README.md
      // lists it); until it is, the layout falls back to the dither texture rather than to a
      // broken-image glyph, and the slide still reads.
      kind: 'testimonial',
      section: 'Vision',
      image: '/quotes/satya-nadella.webp',
      headline:
        'Serverless computation is going to be the core of the future of distributed computing.',
      attribution: 'Satya Nadella',
      role: 'Microsoft CEO',
      notes:
        'The outside voice, placed between our vision and our numbers — the room hears the claim from the largest vendor in it before it hears our results.\n- Do not read the quote aloud; let them read it and say what it means for the ARCHITECTURE — the compute moves to where the request is\n- It is a public keynote line, so it is quotable in front of anyone; the attribution on the card is the whole citation\n- If it draws a "so why not just use their platform" question, the answer is the vision slide before this one: distributed by default, not a region with functions in it'
    },

    {
      // The proof under the vision, on the cell grid the deck already uses for figures — six
      // of them rather than three, so the wall carries the whole result set in one read. No
      // `note` on any cell: a figure this size with a caption is the claim, and a third line
      // under six of them turns a wall into a table.
      kind: 'metrics',
      section: 'Vision',
      eyebrow: 'Proof',
      headline: "Our customers' results",
      metrics: [
        { value: '80%', label: 'Lower TCO' },
        { value: '20x', label: 'Faster Deployment' },
        { value: '250%', label: 'Faster Applications' },
        { value: '100%', label: 'Availability SLA' },
        { value: '1 Day', label: 'Time to Value' },
        { value: '15 min', label: 'Engineer-to-Engineer Response' }
      ],
      notes:
        'The evidence slide — the vision is an argument, these are outcomes customers measured.\n- Lead with **TCO and time to value**: they are the two a buyer can check against their own numbers this quarter\n- The last one is a support commitment, not a platform metric — say so, it is the one that usually gets a follow-up question\n- Figures come from customer results; if a name is asked for, take it offline rather than attributing one here'
    },

    // ── Foundations ──────────────────────────────────────────────────────────────────
    {
      kind: 'section',
      section: 'Foundations',
      index: '01',
      headline: 'Foundations',
      description: 'Type, space, motion. Three scales, no local values.',
      notes:
        'Transition slide — the hatch texture marks a section break. Keep it under five seconds.'
    },
    {
      kind: 'specimen-type',
      section: 'Foundations',
      eyebrow: 'Typography',
      headline: 'The type ladder',
      description:
        'Every text style in the system is a named bundle — family, size, line height, tracking and case travel together. A component picks a name; it never sets a font size.',
      notes:
        'The point of the specimen is the **bundle**, not the sizes.\n- The right column is what a component would otherwise hardcode in five properties\n- Type sizes are responsive inside the token, so no component carries a breakpoint'
    },
    {
      kind: 'specimen-spacing',
      section: 'Foundations',
      eyebrow: 'Spacing',
      headline: 'Seven steps and a grid that divides',
      description:
        'The spacing scale grows at the breakpoints, so padding is one token everywhere. On this fixed canvas the steps are pinned to their widest value and the content box takes a 12-column grid that divides exactly.',
      notes:
        'The exact-division bit is worth stating: 12 x 97 + 11 x 24 = 1428.\n- That is why a half, a third and a quarter all land on whole pixels — in the browser **and** in Figma'
    },
    {
      kind: 'specimen-motion',
      section: 'Foundations',
      eyebrow: 'Motion',
      headline: 'Six durations, four curves',
      description:
        'Motion is a token like any other. Chrome enters on a productive curve, a large surface on an expressive one, and every motion-bearing surface ships a reduced-motion fallback.',
      notes:
        'The bars are live — they run the real tokens.\n- If the room has anyone with vestibular sensitivity, mention the reduced-motion fallback is **mandatory**, not optional'
    },

    // ── The language ─────────────────────────────────────────────────────────────────
    {
      kind: 'section',
      section: 'Language',
      index: '02',
      headline: 'The framed grid',
      description: 'The page language the three surfaces share.',
      notes: 'Second transition. From foundations to composition.'
    },
    {
      kind: 'bullets',
      section: 'Language',
      eyebrow: 'The one-frame principle',
      headline: 'No line is ever drawn twice',
      bullets: [
        'The whole page is one continuous frame; every edge in it is owned by exactly one element.',
        'The hero owns the top rule, the column owns the sides, the footer owns the bottom.',
        'The rule between two modules belongs to the lower one — so the first module in a column draws nothing.',
        'A doubled line is the one unmistakable failure of the language.'
      ],
      aside: {
        label: 'Owned by',
        rows: [
          ['Top rule', 'the hero band'],
          ['Side rules', 'the content column'],
          ['Bottom rule', 'the footer'],
          ['Between modules', 'the lower module'],
          ['Module sides', 'nobody']
        ]
      },
      notes:
        'This is the slide people screenshot. Slow down.\n- The table on the right is the whole rule in five rows\n- The common mistake in review is a module drawing its own side border'
    },
    {
      kind: 'split',
      section: 'Language',
      eyebrow: 'Composition',
      headline: 'Variants live on attributes, not in JavaScript',
      description:
        'A component renders one root element with one flat class string. Its variants are data attributes, and the styling switches on them — so every state is readable in the markup without crossing into the script.',
      code: {
        fileName: 'button.vue',
        language: 'html',
        // The design system's own CodeBlock highlights this — the deck does not ship a
        // second syntax theme. Keep a slide's snippet under ~12 lines: past that the type
        // has to shrink below the code label step and the slide stops being readable.
        code: [
          '<button',
          '  :data-kind="kind"',
          '  :data-size="size"',
          '  class="rounded-(--shape-button)',
          '    data-[kind=primary]:bg-(--primary)',
          '    data-[kind=primary]:text-(--primary-contrast)',
          '    data-[size=large]:h-10',
          '    data-[size=large]:px-(--spacing-md)"',
          '>',
          '  <slot />',
          '</button>'
        ].join('\n')
      },
      notes:
        'The contrast to draw: a class map in JS means two edits per variant, one in the script and one in the template.\n- Attributes also give designers a state they can read in the DOM'
    },
    {
      kind: 'grid',
      section: 'Language',
      eyebrow: 'The stack',
      headline: 'Four layers, one direction of travel',
      cells: [
        {
          index: '01',
          title: 'Tokens',
          body: 'Primitives compile to CSS custom properties. Colour, type, space, shape, motion — one source, two themes.'
        },
        {
          index: '02',
          title: 'Components',
          body: 'Spec first, then the component. Props are data; anatomy is elements. Nothing ships without a browser test.'
        },
        {
          index: '03',
          title: 'Page language',
          body: 'The framed grid: a fluid hero, a capped column, and modules divided by hairlines that nobody draws twice.'
        },
        {
          index: '04',
          title: 'Products',
          body: 'Console, site and docs compose the same parts. A change lands once and arrives on all three.'
        }
      ],
      notes:
        'Read the direction: tokens up to products, never back down.\n- A product needing a new token is a token PR, not a local override — that is the whole governance story in one line'
    },
    {
      kind: 'metrics',
      section: 'Language',
      eyebrow: 'Where it stands',
      headline: 'The system, measured',
      metrics: [
        { value: '26', label: 'Construction standards', note: 'Every one blocks the merge' },
        {
          value: '100%',
          label: 'Components with a browser test',
          note: 'Real Chromium, never jsdom'
        },
        { value: '2', label: 'Themes verified per change', note: 'Light and dark, every gate' }
      ],
      notes:
        'Sourced from the standards registry and the test gate — both are checked in CI, so these numbers cannot drift from the repo.\n- Expect "how do you enforce it": the answer is a write-time hook plus a CI ratchet for each one'
    },

    // ── Close ────────────────────────────────────────────────────────────────────────
    {
      kind: 'quote',
      section: 'Close',
      headline:
        'The difficulty of writing the spec is the cost of consistency. Pay it once, here, instead of carrying drift forward through every future component.',
      attribution: 'The migration rule',
      notes:
        'The line to leave the room with.\n- It is the answer to every "can we just do it the old way this once"'
    },
    {
      kind: 'closing',
      section: 'Close',
      eyebrow: 'Next',
      headline: 'Build it once. Use it everywhere.',
      description:
        'The system, the standards and the reference implementations are in the monorepo.',
      actions: ['Read the guidelines', 'Open the hub'],
      notes:
        'Close on the two links.\n- If there is time, the hub is the better live demo — it renders every component against both themes'
    }
  ]
}

/** The slide-grid rows, in order, each with the slides that belong to it. */
export const sections = () => {
  const rows = []
  for (const slide of DECK.slides) {
    const last = rows.at(-1)
    if (last && last.name === slide.section) last.slides.push(slide)
    else rows.push({ name: slide.section, slides: [slide] })
  }
  return rows
}
