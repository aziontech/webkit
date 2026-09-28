// Overview, first access — the three DOORS an empty account is offered.
//
// ── WHAT A DOOR IS ──
//
// A door is what an empty account can usefully DO, and that is not one door per
// resource type. A Workload without an application to serve is a hostname pointing at
// nothing, so "go live" as a first move asks the reader to build the middle of the
// chain first. Its slot goes to the thing that actually shortens the first deploy:
// onboarding the AI agent the reader already codes with. So the row is
//
//   Applications  → hand the reader to the platform's real create flow
//   Domains       → take the name here, in the card
//   Agent         → copy a setup prompt into their AI tool
//
// ── WHY EACH CARD CARRIES ART AND NOT A GLYPH ──
//
// On a first access the reader has never seen the product. A 16px icon beside the
// title can only repeat the title; a scene can show the anatomy. The mapping is a
// design choice, swappable in one line (`illustration`):
//
//   Applications → `modern-frontends` — the frameworks the reader already builds with,
//                  arriving at a live site.
//   Domains      → `dns-protection` — a name resolving to the site behind it.
//   Agent        → `ai-applications` — an agent pointed at a session that ships here.
//
// Never put two scenes that differ only in a label in one row — it reads as a
// rendering bug rather than as two different things.
//
// ── THERE IS NO SECOND STATE HERE ──
//
// This file used to carry more: usage metrics, per-resource table columns and a `seed`
// that faked the row a create would produce, because the first access grew its own
// populated Overview once something existed. It does not any more — creating the first
// resource turns the sample's version over to the populated Overview the console
// already has (../lib/sample-mode.js, flipped in components/Overview.vue). A first
// access is one screen, and what comes after it is a page that already exists.

/**
 * The three doors of a first access, in reading order. `action.kind` says what the
 * control does: `create` routes to the platform's create flow, `domain` IS the field
 * (the card takes the name itself), `copy-prompt` writes to the clipboard.
 */
export const firstUseDoors = [
  {
    id: 'applications',
    illustration: 'modern-frontends',
    title: 'Ship something new',
    description:
      'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
    // `create` hands the reader to the platform's own create flow (/create) instead of
    // inventing a shortcut here. It is the main road into Azion, it is where importing
    // from Git and starting from a template already live, and a first access is the
    // worst place to teach a path that only exists on one screen.
    action: { kind: 'create', label: 'Create Application' }
  },
  {
    id: 'domains',
    illustration: 'dns-protection',
    title: 'Add a domain',
    description:
      'Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection come with it.',
    // The action is the FIELD itself: the reader already knows their domain, and asking
    // them to press Create first to then type it adds a step that carries no decision.
    // The field answers the one question a name raises — is it free — in a Popover
    // anchored to it (see components/HomeEmptyState.vue).
    //
    // Register then hands that name to /domains/new, seeded, because the rest of what a
    // domain needs is not something the card can ask: the environment it binds, the
    // certificate that serves it, the TLS floor (`POST /workspace/workloads`, see
    // ./lib/create-resources.js).
    action: { kind: 'domain' }
  },
  {
    // The AGENT door. Not a resource: nothing is created, nothing appears in a list. It
    // belongs on this row because it is the move that most shortens a first deploy — the
    // reader leaves with their own editor able to ship to Azion — and because it is the
    // one door that pays off outside the console.
    //
    // Its control copies the prompt (lib/agent-onboarding.js), and copying is the whole
    // action: there is no flow to route to, and a button that opened a page to then
    // offer a copy button would be a step with no decision in it.
    id: 'agent',
    illustration: 'ai-applications',
    title: 'Onboard your agent',
    description:
      'Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project up to deploy on Azion.',
    action: { kind: 'copy-prompt', label: 'Copy prompt' }
  }
]
