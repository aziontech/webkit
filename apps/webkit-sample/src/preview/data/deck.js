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

// THE STACK, NAMED ONCE. Two slides draw these nine marks — the `stack` slide, which opens the
// vision section with the sprawl as its evidence, and the `before-after` slide further down,
// which quotes the same drawing back as the "before" half of a comparison. A quote that has
// drifted is not a quote, so the list is one constant read twice rather than two lists somebody
// has to keep identical by hand.
//
// A tool NAME resolved against the site's own registries, and the one job it does. THE NINE ARE
// THE MARKS THIS REPO SHIPS THAT CAN SIT IN A TILE, which is a narrower set than "the marks it
// ships" — see the `stack` slide's own note for the two filters that decide it.
const STACK = [
  { tool: 'Terraform', label: 'Provisioning' },
  { tool: 'AWS', label: 'Compute' },
  { tool: 'GCP', label: 'Data' },
  { tool: 'Azure', label: 'Identity' },
  { tool: 'Node.js', label: 'Runtime' },
  { tool: 'Next.js', label: 'Frontend' },
  { tool: 'OpenAI', label: 'Models' },
  { tool: 'Elastic', label: 'Logs' },
  { tool: 'Grafana', label: 'Dashboards' }
]

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
        'Open on the frame, not the copy.\n- The cut corner and the texture ramp are the brand cover; the square frame every later slide carries is the deck-level promise that **everything here is drawn on a grid**\n- The three surfaces the description names — console, site, docs — are what the rest of the deck goes on to show; name them out loud rather than reading the line'
    },
    {
      kind: 'statement',
      section: 'Opening',
      headline:
        'A design system is not a component library. It is the set of decisions nobody has to make twice.',
      attribution: 'The premise',
      notes:
        'The pause slide. Let it sit for a beat before moving.\n- If someone pushes back, the concrete version is the whole rest of the deck — do not argue it here'
    },

    // ── The vision ───────────────────────────────────────────────────────────────────
    {
      // THE SETUP FOR THE PROBLEM, and the deck's one drawing that is not a map. The claim is
      // the pressure; the evidence beside it is the graph that causes it — a vendor per job,
      // and a hop between every pair of them. It sits HERE, ahead of the perimeter slide,
      // because that slide answers a question this one has to have asked: the pressure comes
      // first, the architectural reason for it second.
      //
      // `emphasis` names the PHRASE the marker highlights, not a pre-split headline, so the
      // sentence stays one string an editor can rewrite (see SlideStack). `stack` is a shape
      // only this layout reads: a tool NAME resolved against the site's own registries, and
      // the one job it does on this slide.
      //
      // THE NINE ARE THE MARKS THIS REPO SHIPS THAT CAN SIT IN A DISC, which is a narrower set
      // than "the marks it ships". Two filters, both real:
      //
      //   NO ASSET. The reference render used Docker and Kubernetes; neither exists in
      //   `shared/ui/brand/clients`, and adding SVGs is an icon-library change, not a slide.
      //   NOT A SYMBOL. GitHub, Kafka and Equinix DO ship, as WORDMARKS — github.svg is a
      //   200x200 raster of the lettering, kafka.svg is 511x233, equinix.svg is 173x25. A
      //   56px tile holds a square mark; a wordmark in one renders as an illegible smudge
      //   (it did, first pass). The registry's aspect ratio is the test, and these three fail
      //   it. A GitHub node is worth having — it wants the octocat SYMBOL added to the
      //   registry, in its own change.
      //
      // Three of the nine (AWS, GCP, Azure) are deliberately three of the four the next slide
      // names under "Built for the perimeter": the stack that sprawls here is the stack whose
      // controls sit in the wrong place there.
      kind: 'stack',
      section: 'Vision',
      eyebrow: 'The pressure',
      headline:
        'As applications become more distributed, API-driven, and critical to the business, many organizations face growing pressure on costs, resilience, and speed.',
      emphasis: ['distributed, API-driven, and critical to the business'],
      stack: STACK,
      notes:
        'The setup. Read the highlighted phrase and stop — the drawing does the rest.\n- Nobody in the room chose badly: every one of those nine is a reasonable pick, which is why the sprawl is not a procurement problem\n- The three words that matter are the last three: costs, resilience, speed. The rest of the deck answers them in that order\n- Three of these marks come back on the next slide as "built for the perimeter" — the same stack, seen from the security side'
    },
    {
      // The one slide whose artwork is the GROUND rather than an element on it: the map runs
      // edge to edge and the frame's rules cut it, with a left-to-right wash holding the copy
      // column on canvas. `marks` names logos the app already ships (resolved against the
      // site's own client and tool registries), and `note` is the line that draws the
      // conclusion under them — both are shapes only this layout reads.
      kind: 'backdrop',
      section: 'Vision',
      eyebrow: 'The problem',
      // ONE DRAWING, NOT TWO. This slide used to carry the mesh as well, on the theory that
      // the claim is the contrast between the network as it is (peers talking to peers) and
      // what a centralized control does on top of it. Rendered, the two drawings cost each
      // other: seventeen rays crossing the map is a busy field, and the ONE request the whole
      // headline is about — the long trip out of the network and back — has to be found inside
      // it. A slide arguing that a single hop is too long draws a single hop. The mesh belongs
      // to the slide whose claim IS the field ("One security plane…", further down), which is
      // where the contrast now lives: one long labelled trip here, n:n with no ends there.
      headline: 'Perimeter security was not built for modern applications',
      bullets: [
        'Centralized security creates inspection bottlenecks, adds latency, and introduces regional points of failure.',
        'Legacy controls were not designed for distributed, API-driven, real-time, AI-enabled applications.',
        'Private data centers lack elastic scale and global reach when they are needed most.'
      ],
      // The asset the layout draws ON the map, and now the only one: one request between a
      // user in Brazil and a data centre in the US, on one wire, in both directions — no
      // arrowheads, because nothing here needs to assert a direction. `place` names a point in
      // the artwork's own coordinates (the gazetteer is in shared/ui/banners/map-framing.js)
      // rather than a position on the slide, so the two markers stay on their coastlines if
      // the crop ever moves.
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
      // THE CASE, CLOSED — the last problem slide, and the only one whose evidence is not ours.
      // `stack` states the pressure and draws where it comes from; `backdrop` says the controls
      // sit in the wrong place. This one prices both, in three figures nobody in the room has to
      // take our word for, which is what earns the vision the next slide asks for.
      //
      // `concerns` and a `source` per figure are shapes only this layout reads: a wrapped row of
      // the things that all have to be true at once, and the house that measured each number,
      // set on its own line under the finding rather than folded into its parentheses.
      //
      // The headline restates `stack`'s claim in four words. That is deliberate at this distance
      // — a map slide sits between them and the second telling is the one carrying the numbers —
      // but the two are the same argument, so if the deck is ever cut for time, cut one of them.
      kind: 'evidence',
      section: 'Vision',
      headline: 'Applications are too complex to build, secure, and scale',
      emphasis: ['complex'],
      concerns: [
        'Performance',
        'Reliability',
        'Security & Compliance',
        'Innovation',
        'Business Agility',
        'Global Reach',
        'Flexibility',
        'Cost',
        'Lock-in'
      ],
      metrics: [
        {
          value: '5x',
          label: 'Slower growth where developer velocity is poor',
          source: 'McKinsey'
        },
        { value: '82%', label: 'Of enterprises incur unnecessary cloud costs', source: 'Virtana' },
        {
          value: '68%',
          label: 'Of CIOs are concerned about cloud vendor lock-in',
          source: 'Flexera'
        }
      ],
      notes:
        'The last slide of the problem, and the one with outside numbers on it. Read the marked word, then the row, then stop.\n- The nine are the point: not one of them is optional, and no team gets all nine right at once with a stack assembled per job\n- Every figure is published and attributed on the slide — say the house out loud, it is what makes this the slide a CFO believes\n- **5x is about velocity, not headcount**; it is the one that gets misheard\n- If a figure is challenged, do not defend it: the next slide is ours, and it is where the argument actually lives'
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
      // THE ASSET THE VISION PRODUCES — what a network that runs everywhere can SEE.
      //
      // The vision slide above is an architecture claim; this is the consequence of having
      // shipped it, and it is the one figure slide in the deck that is CENTRED rather than laid
      // on the cell grid. That is the layout's whole argument, and it is in `scale`: the other
      // figure slides are read as a set, this one is a single sentence with three numbers under
      // it that exist to make the sentence credible.
      //
      // `overline` is a shape only this layout reads: the market each figure belongs to, above
      // the number rather than beside it, because the market is not a finding ABOUT the number
      // — it is the thing the number is OF.
      kind: 'scale',
      section: 'Vision',
      headline: 'We are building the future of the web with the data intelligence no one else has',
      emphasis: ['the future of the web', 'the data intelligence'],
      description:
        'Azion became a live map of digital activity — enabling adaptive defenses, unmatched fraud prevention, behavioral intelligence, and data-driven innovation across every sector.',
      metrics: [
        {
          overline: 'Transactions',
          value: '+400B',
          label: 'Multi-sector transactions processed daily'
        },
        {
          overline: 'Payments',
          value: '+200M',
          label: 'Payment transactions rely on the Azion platform every day'
        },
        {
          overline: 'Retail intel',
          value: '+300B',
          label: 'In US$ retail transactions flow through Azion yearly'
        }
      ],
      notes:
        'The scale slide, and the only one where the number is not about our software.\n- Read the three markets, not the three numbers: the argument is the BREADTH, and any one figure invites a challenge the breadth does not\n- **The volume is the moat**: nobody can assemble this view after the fact, because it is a by-product of running the traffic\n- Expect "is this customer data": no — it is aggregate activity on the platform, and the answer to say out loud is that the intelligence is derived, never resold\n- It sets up the results slide later in this section: this is what we can see, that is what customers got'
    },

    {
      // THE OPPOSITION — the vision above, set against what the room is running today.
      //
      // It sits here rather than in the problem run because it is not a problem slide: the left
      // column is, but every line on the right is an answer, and an answer before the vision has
      // nothing to be an answer to. So the order is pressure, problem, price, vision — then this,
      // which is the vision put line by line against the alternative.
      //
      // `sides`, `pairs` and `verdict` are shapes only this layout reads. A PAIR IS A TUPLE, and
      // the pairing is the whole content: each legacy line has exactly one answer opposite it, in
      // the column order `sides` names. Same [term, value] shape the bullet slide's aside table
      // carries. Adding a line to one side without adding its opposite is not a longer list, it
      // is a broken table — and the layout will render the row with one half empty to show it.
      //
      // Sentence case, against the reference render's title case, and it is the pairing that
      // decides it: "Confusing primitives" over "Serverless primitives" lines the shared word up,
      // so the eye lands on the word that CHANGED. Title case makes fourteen proper nouns.
      //
      // The eyebrow the reference carries ("Legacy solutions are not enough") is deliberately
      // absent: it restates the headline, and an overline would spend an accent the verdict's
      // marker bands need. It is in the notes instead, as a line to say rather than to show.
      kind: 'versus',
      section: 'Vision',
      headline: 'Modern threats and AI-driven attacks require a modern platform',
      sides: ['Legacy', 'Azion'],
      // WHERE A CENTRALIZED CLOUD PUTS ITS INFRASTRUCTURE — the legacy map's markers, named
      // as places in the artwork's own gazetteer (shared/ui/banners/map-framing.js) rather
      // than as positions on the slide, so they stay on their coastlines if the crop moves.
      // The count is the argument, and it is editorial: three regions against a field of 78.
      // `us-east` is deliberately the same data centre the perimeter slide's request travels
      // to, so the two slides point at one building.
      regions: ['us-west', 'us-east', 'br-southeast'],
      pairs: [
        ['Confusing primitives', 'Serverless primitives'],
        ['Centralized', 'Worldwide scale'],
        ['Unreliable, fails often', 'Fully autonomous'],
        ['Ops-intensive', 'Fully managed, no ops'],
        ['Vendor lock-in', 'Open standards'],
        ['Static architectures', 'Programmable and extensible'],
        ['Single-purpose security', 'Built-in security']
      ],
      verdict: ['Faster.', 'More reliable.', 'Best price-performance.'],
      notes:
        'Do not read fourteen lines out loud — pick three pairs and let the room read the rest.\n- Open with the line this slide does not print: **legacy solutions are not enough**\n- The pairs are exact, one answer per line, which is what makes this a table and not two lists\n- **Ops-intensive / fully managed** is the pair with a headcount attached, so it is the one a buyer follows up on\n- The three marked lines are the only claims here a customer measured; everything above them is architectural'
    },

    {
      // THE THREE ANSWERS, EXPANDED. The table above names fourteen differences in two words
      // each; three of its right-hand lines — open standards, programmable and extensible,
      // fully managed with no ops — are the ones a developer has to believe before any of the
      // rest matters. This slide is those three, given a sentence and the marks they are made
      // of, which is why it sits immediately after the table rather than in the build section:
      // it is the table's own claim, unpacked, while the pairing is still on the wall.
      //
      // `reasons` is an ORDERED list — the layout numbers it, and nothing here types a figure.
      // Each entry names its marks; the layout resolves them against the site's registries and
      // paints the wordmark for a name with no artwork.
      kind: 'reasons',
      section: 'Vision',
      eyebrow: 'Build',
      headline: 'Fast to learn. Easy to use.',
      description:
        'The experience developers always wanted and the business agility your company needs.',
      reasons: [
        {
          // The reference's six, with the bodies' own artwork: none of them was a client or a
          // tool, so none was in a registry — they are `shared/ui/brand/standards.js` now, which
          // is where a specification belongs (see that file for each mark's source, and for why
          // TC39's had to be normalized to a knockout before one ink could hold it).
          title: 'Open Standards',
          description: 'No need to learn anything new, or proprietary software.',
          marks: ['IETF', 'TC39', 'W3C', 'JavaScript', 'WebAssembly', 'ONNX']
        },
        {
          // The reference's sixth mark is Svelte, which has artwork in `clients/` but no entry
          // in any registry — and a registry is a claim a specific site page makes, so it is
          // not widened from a slide. Astro stands in: same cohort, already registered.
          title: 'Programmable and Extensible',
          description:
            'Bring your own code; test new features or fixes against real data; merge new ideas straight into production; clone an environment in one click.',
          marks: ['Gatsby', 'React', 'Next.js', 'Vue', 'Astro', 'Hugo']
        },
        {
          // Four of the reference's marks are legible (GitHub, Terraform, Grafana, OpenAI); the
          // other two are unidentifiable at that size, so they are not guessed at. Elastic and
          // Node.js take their places — the first is already this deck's observability mark (the
          // `stack` slide labels it "Logs"), the second is what the CLI and the SDKs in "API,
          // CLI and UI" are written in. Kafka was the first choice for the sixth and is the
          // wrong shape: the registry's aspect ratio is the test a mark in a cluster has to
          // pass, and kafka.svg is 511x233 lettering, which reads as a caption beside five
          // square symbols. Same test the `stack` slide's constellation applies.
          title: 'NoOps',
          description:
            'Fully automated operations; GitOps and infrastructure as code; driven by API, CLI and UI. Governance over the technology and the process alike.',
          marks: ['GitHub', 'Terraform', 'Grafana', 'Elastic', 'OpenAI', 'Node.js']
        }
      ],
      notes:
        "The developer-experience slide, and the one an engineer in the room decides on. Read the three titles, not the sentences under them.\n- **Open standards** is the answer to lock-in: the language, the runtime and the model format are all somebody else's specification, so what is written here runs elsewhere\n- **One-click cloning** is the line that usually draws the follow-up — a full copy of an environment, with real traffic to test against\n- **NoOps** is a claim about headcount, so pair it with the ops line from the table before this one\n- The marks are what the reason is made of, not a customer list; if asked, the frameworks are the ones the platform ships presets for"
    },

    {
      // THE PRODUCT, NAMED, AND THE ONE PICTURE THE SECTION HAS BEEN DESCRIBING. Everything
      // before it in this run argues: a pressure, a perimeter, a table of differences, three
      // reasons. This slide asserts nothing — it puts the name at the opener's type step and
      // draws where the platform sits, so the room has a shape to hang the rest on before the
      // outside voice and the numbers close the section.
      //
      // `ring` is a shape only this layout reads: the seats of the wheel, CLOCKWISE FROM
      // TWELVE O'CLOCK, each an external world the platform sits between and the glyph that
      // names it. The order is editorial (the people first, then where the workloads live,
      // then how they are reached), and the layout derives everything else from the count —
      // the seat angles, the radius, the centre — so adding an eighth re-solves the wheel
      // rather than needing a coordinate.
      //
      // THE GLYPHS ARE ICON NAMES FROM @aziontech/icons, the same library every console
      // surface in this app draws from, given as the full class so nothing has to be
      // reassembled at render time (`ai-cor` is a different font and would paint an empty
      // box, so a colour variant is never named here). Five are the primeicons the library
      // ships, one is Azion's own `ai-sparkles`; all seven are 14px outline glyphs on one
      // grid, which is what keeps a mixed set reading as one family.
      kind: 'platform',
      section: 'Vision',
      eyebrow: 'The web platform for modern applications',
      headline: 'Azion Platform',
      description:
        'A radically different approach that simplifies how customers build, accelerate, automate, and secure their workloads in a globally distributed infrastructure.',
      ring: [
        { label: 'Users', icon: 'pi pi-users' },
        { label: 'Public Clouds', icon: 'pi pi-cloud' },
        // Azion's own sparkles, and it is spelled `pi` on purpose: the library ships this
        // glyph in BOTH fonts, and the azionicons one is a hole — `ai ai-sparkles` renders
        // the .notdef box (verified in the browser, 2026-09-03), while `pi ai-sparkles` draws
        // it. An AI platform is a vendor rather than a device, so it takes the generic mark
        // and not `ai-edge-ai`, which is our own product's glyph.
        { label: 'AI Platforms', icon: 'pi ai-sparkles' },
        { label: 'SaaS Applications', icon: 'pi pi-box' },
        { label: 'Public Internet', icon: 'pi pi-globe' },
        { label: 'Branch Offices', icon: 'pi pi-building' },
        // The reference draws a building here and a laptop for the branch; swapped, because a
        // network is a topology and there is a glyph that says so.
        { label: 'Enterprise Networks', icon: 'pi pi-sitemap' }
      ],
      notes:
        "The name slide. Say the sentence once and then point at the wheel — the seats are the whole content.\n- The claim is the POSITION, not the feature list: every one of those seven already exists in the customer's estate, and the platform is what sits between them\n- Users and public internet are the two seats a buyer maps to revenue; clouds, SaaS and enterprise networks are the ones an architect maps to their diagram\n- If asked what the platform IS, the next sections answer it — one security plane, then the execution path\n- Nothing on this slide is a product name on purpose; the catalogue is the slide after it"
    },

    {
      // THE PAYOFF, IN WEEKS. The slide above names the platform and draws where it sits; this
      // one says what sitting there is worth, and it is the only slide in the deck whose claim
      // is a DURATION. It is placed immediately after the wheel because the wheel is what makes
      // the right-hand drawing legible — the room has just been shown that the platform is the
      // thing everything else is wired to, so a fan of nodes under one mark reads as that
      // arrangement seen from the developer's side rather than as a new diagram.
      //
      // `sides` is a pair the layout takes in order: the world before, then ours. Each is a
      // title and the SAME SENTENCE with one word changed, which is the whole argument — the
      // pairing only works if the two claims stay identical apart from the number, so rewrite
      // them together or not at all. `emphasis` is the phrase the deck's marker band lands on,
      // and it is named on the second side only: marking both numbers makes the two halves
      // equally loud and cancels the comparison.
      //
      // `stack` is the constant the `stack` slide reads — the same nine marks, quoted back on
      // purpose. `delivery` is a shape only this layout reads: who writes the application, the
      // platform's own rank (a COUNT and one glyph, because every node of it is the same node),
      // and everything it is delivered to (a list, because those are five different things).
      // The glyphs are icon classes from @aziontech/icons, the library every console surface in
      // this app draws from, given in full so nothing is reassembled at render time.
      kind: 'before-after',
      section: 'Vision',
      sides: [
        { title: 'Before Azion', claim: '3 months to build and secure an application' },
        {
          title: 'With Azion',
          claim: '1 week to build and secure an application',
          emphasis: ['1 week']
        }
      ],
      stack: STACK,
      delivery: {
        author: { label: 'Developer', icon: 'pi pi-user' },
        // Three, and a microchip — the reference render's own count and its own glyph. The
        // count is editorial and the drawing solves itself around it: a fourth node narrows
        // the pitch of both ranks and re-draws every link.
        network: { count: 3, icon: 'pi pi-microchip' },
        // Five ways an application is reached, each a different one — people, a phone, a
        // desk, a network, another cloud. The reference draws three identical avatars here;
        // five distinct glyphs say the same thing about volume and something more about
        // reach, at no extra cost.
        consumers: ['pi pi-users', 'pi pi-mobile', 'pi pi-desktop', 'pi pi-wifi', 'pi pi-cloud']
      },
      notes:
        "The slide a buyer writes down. Say the two numbers and let the room compare the two drawings.\n- The line this slide does not print: **the work does not go away, the platform absorbs it** — nine vendors to integrate, secure and operate becomes one to deploy to\n- The left drawing is the same one from the pressure slide at the top of this section; if anyone recognizes it, that is the point\n- **3 months to 1 week** is the customer-observed range for a first production workload, not a benchmark — if pushed, the honest answer is that it depends on how much of the nine they keep\n- The right-hand fan is the platform slide seen from the developer's side: one deploy, and the network is already everywhere"
    },

    {
      // THE CATALOGUE, and it comes straight after the wheel on purpose: that slide names no
      // product at all — it argues the platform's POSITION — and the first question a room
      // asks once it has the shape is what is actually in it. So the answer follows
      // immediately, as a wall rather than as an argument, and the section returns to
      // arguing (the borrowed line, then the numbers) with the catalogue behind it.
      //
      // FOUR COLUMNS, EACH ITS OWN FRAME. `columns` is a shape only this layout reads: the
      // four verbs the platform's own navigation is grouped by, in the order a workload meets
      // them — build it, store its data, secure it, watch it. Order inside a column is
      // editorial too, not alphabetical: the products a conversation starts from come first.
      //
      // A product carries `note` for a parenthetical (a roadmap quarter, or a qualifier like
      // "with Vector"), `tag: 'New'` for the blue marker, and `parts` for capabilities sold
      // inside it rather than beside it. A quarter is a fact about the roadmap and lives
      // here; how a roadmap fact is drawn is SlideCatalog's business.
      kind: 'catalog',
      section: 'Vision',
      eyebrow: 'The fastest path to AI-hyperscale',
      headline: 'Azion Products',
      columns: [
        {
          label: 'Build',
          products: [
            { name: 'AI Inference', parts: ['LoRA Fine Tune'] },
            {
              name: 'AI Studio',
              note: 'Q4/26',
              parts: ['Builder', 'Search', 'Chat', 'Prompts', 'Skills']
            },
            { name: 'Application Accelerator' },
            { name: 'Cache' },
            { name: 'Functions' },
            { name: 'Orchestrator' },
            { name: 'Image Processor' },
            { name: 'Runners', note: 'Q1/27', tag: 'New' }
          ]
        },
        {
          label: 'Store',
          products: [
            { name: 'Durable Objects', note: 'Q2/27' },
            { name: 'Object Storage' },
            { name: 'SQL Database', note: 'with Vector' },
            { name: 'KV Store' },
            { name: 'Queues', note: 'Q3/27', tag: 'New' }
          ]
        },
        {
          label: 'Secure',
          products: [
            { name: 'Bot Manager' },
            { name: 'Load Balancer' },
            // Network Shield is named ONCE. The reference render lists it twice, four rows
            // apart — a copy-paste in the source, not two products — and a duplicate in a
            // catalogue is the one error that makes a room stop trusting the whole wall.
            { name: 'Network Shield' },
            { name: 'Private Access', note: 'Q1/27', tag: 'New' },
            { name: 'AI Gateway', note: 'Q4/26', tag: 'New' },
            { name: 'Secure Access', note: 'Q4/26', tag: 'New' },
            { name: 'Web Application Firewall' },
            { name: 'Edge DNS' },
            { name: 'Certificate Manager' }
          ]
        },
        {
          label: 'Observe',
          products: [
            { name: 'Data Stream' },
            { name: 'Edge Pulse' },
            { name: 'Real-Time Metrics' },
            { name: 'Real-Time Events' }
          ]
        }
      ],
      notes:
        'The reference wall. Do not read it out — name the four verbs and let the room find its own product.\n- The four labels are the platform’s own grouping, so a customer who has seen the console recognizes the navigation\n- Blue tags are what shipped or ships next; a parenthetical quarter is a roadmap date, and every date on this slide is a commitment somebody has to keep\n- Indented entries are capabilities INSIDE the product above them, not separate SKUs — the AI Studio question ("is Builder a product?") comes up every time\n- If asked what is missing: this is the catalogue, not the pricing sheet'
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

    {
      // THE CLIENT WALL. The slide before this one says what customers MEASURED; this one says
      // who they are, and it is the only slide in the deck that answers a question by showing
      // rather than by claiming. So it carries no argument at all: a plate, four company
      // figures, the two investors, and twenty-eight logos in their own colours.
      //
      // ITS RIGHT HALF IS THE DECK'S ONE LIGHT SURFACE. `--bg-contrast` (#FAFAFA on this dark
      // deck), because a client wall on black can only be white silhouettes — which says
      // "logos" without saying whose, and whose is the entire point. The reasoning, and the
      // one-accent consequence for the figures on the left, is in SlideClients.vue.
      //
      // THE WALL IS NOT CONTENT AND IS NOT LISTED HERE. It is a registry — a client and the
      // file that draws it, in one tuple, in preview/data/client-marks.js — for the same
      // reason `versus` names places and lets the gazetteer own their coordinates: an asset
      // path in a content file is a broken image waiting for somebody to move a folder. The
      // wall's order (alphabetical), its two documented gaps (Linx and Sólides, neither of
      // which publishes a current SVG) and the provenance of every mark live there.
      //
      // The headline is the reference deck's, and it is the SECOND slide to carry it — the
      // `platform` wheel above states it as the position. Here it is a plate over the
      // company's own numbers rather than a claim, which is why it takes no overline.
      kind: 'clients',
      section: 'Vision',
      headline: 'Azion Platform',
      description:
        'Powering mission-critical workloads — from ports and airports to retail, supply chain, finance, and the public sector.',
      // Four, and two-by-two: the count is what the copy column can hold at the figure step
      // without the captions breaking every second word. The NPS carries the industry number
      // as a `note` rather than inside its caption's parentheses — a figure and the benchmark
      // it beats are two facts, and only one of them is ours.
      metrics: [
        { value: '100+', label: 'Data Centers Worldwide' },
        { value: '20k', label: 'Customers' },
        { value: '400B', label: 'Transactions Per Day' },
        { value: '70', label: 'Net Promoter Score', note: '(industry avg 20)' }
      ],
      backedBy: 'Backed by',
      notes:
        'The recognition slide — do not read it, let the room find its own logos on it.\n- Point at ONE mark and name the workload behind it; the airport and the two banks are the ones that land, because they are the customers a room already believes are hard\n- The four figures are the company, not the platform: data centres, customers, transactions, NPS — the NPS is the one that gets a follow-up, and the industry average is on the slide for exactly that\n- Qualcomm and monashees answer "who is behind you" before it is asked; they are investors, not customers, which is why they sit under their own label\n- Linx and Sólides are customers and are NOT on the wall — neither publishes a current vector mark. If either is asked for, say so; do not claim the wall is the whole list'
    },

    // ── How we built it ──────────────────────────────────────────────────────────────
    {
      // The answer to the problem slide, in the SAME shape: the map is the ground again, the
      // frame's rules cut it again, and the copy sits in the same six columns. That repetition
      // is the argument — the first backdrop draws one long trip to one data centre, this one
      // draws no trip at all, because the claim is that there is nowhere left to travel to.
      //
      // So it carries no `route`, and it is the first slide to put `metrics` in a copy column:
      // three figures under the claim, in the brick the metrics slide already uses.
      kind: 'backdrop',
      section: 'How we built it',
      eyebrow: 'How we built it — 01',
      headline: 'One security plane, distributed across the whole network',
      // The drawing this slide takes instead of a route: n:n traffic between the artwork's own
      // PoPs, nothing labelled and nothing in the middle — the shape of the claim above it.
      mesh: true,
      description:
        'The same plane protects workloads running as functions on Azion and your own origins behind it — including agents built on LangGraph and LangChain, and the MCP servers they call.',
      metrics: [
        { value: '100+', label: 'points of presence running the policy' },
        { value: '30 ms', label: 'median latency to the decision' },
        { value: '100%', label: 'availability SLA' }
      ],
      notes:
        'The turn from problem to architecture — every figure here is a property of WHERE the policy runs, not of how fast the box is.\n- The middle one is the number that lands: 30ms is the decision, not the round trip, so it is the latency a policy ADDS\n- Agents and MCP servers are named on purpose — they are the workloads the room is about to ship, and they are protected by the same plane, not by a second product\n- 100% availability SLA also appears on the results slide; say it once, here it is the plane, there it was the outcome'
    },
    {
      // The claim the slide before it earns: if the policy runs everywhere the network runs,
      // then it can run ON the call rather than beside it. `lanes` is the layout for exactly
      // this shape of argument — the same journey drawn twice, where the only difference is
      // what sits in the middle — and it is the one layout whose composition carries the
      // claim on its own: the two lanes share both ends by construction, so the middle box is
      // the only thing left to see.
      //
      // TWO OR THREE NODES PER LANE. The wires hand their packet over one crossing apart and
      // the shared packet is only in flight for the first 45% of its cycle, so a lane can stop
      // its request at most once before the cycle comes round (see SlideLanes.vue). A fourth
      // node needs a clock of its own.
      //
      // The lanes carry no colour and no order beyond their own: the LAST lane is the claim
      // and everything above it is the ground being argued against, which is why "same plane"
      // is written second. Swap them and the slide argues for the wrong one.
      kind: 'lanes',
      section: 'How we built it',
      eyebrow: 'The execution-path principle',
      headline: "Defense runs on the agent's execution path",
      lanes: [
        {
          label: 'Out of band',
          nodes: ['Agent', 'Tool'],
          note: 'Records what already happened'
        },
        {
          label: 'Same plane',
          nodes: ['Agent', 'Policy', 'Tool'],
          note: 'Decides before it happens'
        }
      ],
      notes:
        'The architectural claim of the whole section, in one drawing — let the room find the extra box before saying it.\n- The distinction is WHEN, not how much: an out-of-band control can only describe a call that already returned, so its best case is a good record of a bad outcome\n- On the same plane the policy is a step in the call, so the decision happens before the tool runs — that is the difference between an audit log and a control\n- If someone asks what the policy costs, the number is on the slide before this one: 30ms to the decision, and it is the latency the policy ADDS\n- The traffic is drawn on the same clock in both lanes, so the muted request lands while the checked one is still at the policy; that gap is the argument, not decoration'
    },

    // ── Close ────────────────────────────────────────────────────────────────────────
    {
      // THE SLIDE THAT STAYS UP. It is the one the room looks at while it asks questions, so it
      // carries the two ways to follow up and nothing else: the speaker, and the thing the deck
      // was about.
      //
      // `link.url` is the ONE address on this slide. The QR encodes it and the muted line under
      // the email is the same string with its scheme stripped, so a code that scans somewhere
      // other than where the slide says is not a mistake this deck can make. The QR is generated
      // from that string at render time (lib/qr-code.js) rather than pasted in as an image —
      // edit the URL here and the code follows it.
      kind: 'thanks',
      section: 'Close',
      headline: 'Thank you.',
      contact: 'rafael@azion.com',
      link: {
        url: 'https://mh2saqc1un.map.azionedge.net/site/hub',
        caption: 'Scan to open the Hub'
      },
      notes:
        "Leave it up for the questions — it is the only slide with the address on it.\n- The code goes to the Hub, which is the live version of everything in the deck; if someone wants the standards instead, they are one click from there\n- The host is the sample's own Azion domain and survives a redeploy (only the prefix rotates), but **scan it once before presenting** — if the sample ever moves, the code follows whatever URL is in this file and nothing else will tell you"
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
