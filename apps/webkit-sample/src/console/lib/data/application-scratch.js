// FROM SCRATCH — the three answers an application layer needs, and nothing else.
//
// The other two doors into this create arrive WITH code: a repository to import, a
// starter to clone. From scratch arrives with none, so the questions it can usefully
// ask are not "what builds it" but "how does it cache" and "where does it fetch from" —
// the two halves of an application that has no bundle behind it yet.
//
// So the from-scratch part asks exactly three things:
//
//   NAME          the endpoint's one requirement, and the name the whole chain takes.
//   CACHE POLICY  a LIST OF TEMPLATES, each on its own switch. A cache policy written
//                 field by field is a screen of enums (see ./cache-settings.js for the
//                 full body) and nobody opens "create an application" to fill one in; a
//                 template is that policy already written, and what is left to ask is the
//                 part it cannot guess — asked under the row, the moment it goes on.
//                 SWITCHES AND NOT A ONE-OF CHOICE, because the templates are not variants
//                 of one policy: an application can cache its images one way and its
//                 static assets another, and both at once. Which also means the list needs
//                 no switch above it — none on is none created.
//   CONNECTOR     chosen by TYPE, because the type is what the address MEANS. An origin
//                 host, a bucket, an ingest region are three different values that cannot
//                 share one "address" field without the field lying about two of them.
//
// Both of those are CONDITIONAL FORMS, and they are conditional in the same way a rule's
// behavior is (./rules-engine.js): the choice decides what is asked next, so each option
// carries its own `fields` and the step renders THAT list instead of growing a chain of
// `v-if`s per option. Nothing is disabled — a field that does not apply is not rendered,
// because an input that accepts an answer nobody reads is worse than no input.
//
// Everything else the create endpoint takes — the seven module flags, `active`, `debug` —
// keeps its own default and is not asked here at all. This is the SHORT door.
import { BUCKETS } from './object-storage'

/** The two regions Azion streams live ingest from, as the console names them elsewhere. */
const INGEST_REGIONS = [
  { value: 'br-east-1', label: 'br-east-1, South America' },
  { value: 'us-east-1', label: 'us-east-1, North America' }
]

/** A free-text field descriptor. */
const text = (name, label, placeholder, extra = {}) => ({
  kind: 'text',
  name,
  label,
  placeholder,
  ...extra
})

/** A one-of field descriptor, over a fixed option list. */
const select = (name, label, options, extra = {}) => ({
  kind: 'select',
  name,
  label,
  options,
  ...extra
})

// ── CACHE POLICY ──────────────────────────────────────────────────────────────
//
// The template IS the policy: TTLs, the cache key, what varies. What each one still has
// to be told is the part it cannot guess — which files it is for, asked underneath the
// row the moment that row goes on.

/**
 * The image formats the image policy ARRIVES WITH — the whole common web image set, the
 * modern formats and the ones a site still has in its history, because an extension left
 * out of this line is an object that silently misses the cache it was created for.
 *
 * One const, because the same list is both the answer the field is filled with and the
 * placeholder it falls back to once a reader empties it — two literals would let the hint
 * drift from the value.
 */
const IMAGE_EXTENSIONS = 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff'

/** The cache policy templates, in the order the step offers them as toggle rows. */
export const CACHE_POLICY_TEMPLATES = [
  {
    value: 'images',
    label: 'Image caching',
    description:
      'Caches images for a long TTL and ignores the query string, so one object serves every variation of the same file.',
    fields: [
      // FILLED, not empty. The only reason this field is asked at all is that the
      // template cannot GUESS the file set — but it can propose the one every image
      // policy starts from, and a required field that arrives answered is a required
      // field nobody has to answer. What is left is an edit, which is a smaller ask
      // than a blank line under a switch that was just turned on.
      text('extensions', 'Extension matches', IMAGE_EXTENSIONS, {
        required: true,
        default: IMAGE_EXTENSIONS,
        description:
          'Comma-separated. The policy applies to requests whose path ends in one of them.'
      })
    ]
  },
  {
    value: 'files-optimization',
    label: 'File optimization',
    description:
      'Caches static assets and compresses them on the way out. The template carries the TTLs and the cache key.',
    fields: []
  }
]

/**
 * The answers a field list ARRIVES WITH — every descriptor that declares a `default`.
 *
 * A descriptor key and not a branch per template, for the reason the fields themselves
 * are descriptors: a template that wants to arrive filled says so in the catalog, and
 * the form that renders it needs no change.
 */
const seededValues = (fields) =>
  Object.fromEntries(
    fields
      .filter((field) => field.default !== undefined)
      .map((field) => [field.name, field.default])
  )

/** The policies currently switched on, in the order the list presents them. */
export const enabledCachePolicies = (config) =>
  CACHE_POLICY_TEMPLATES.filter((template) => config.cache.policies[template.value]?.enabled)

// ── CONNECTOR ─────────────────────────────────────────────────────────────────
//
// Keyed by the SAME type ids the Build → Connectors module uses (./connectors.js owns the
// label and the glyph), so a connector created here is the same kind of thing as every
// connector already in the list — one vocabulary, not two.

/** What each connector type asks for, keyed by the type id in ./connectors.js. */
export const CONNECTOR_TYPE_FIELDS = {
  http: [
    text('address', 'Origin address', 'origin.example.com', {
      required: true,
      description: 'The host the application fetches from. No scheme.'
    }),
    text('path', 'Path', '/', {
      description: 'Prefixed to the request path before it reaches the origin.'
    }),
    text('uriPrefix', 'Apply when $uri starts with', '/api', {
      description: 'Leave it empty to send every request to this connector.'
    })
  ],
  storage: [
    select(
      'bucket',
      'Bucket',
      BUCKETS.map((bucket) => ({ value: bucket.name, label: bucket.name })),
      { required: true, description: 'An Object Storage bucket in this workspace.' }
    ),
    text('prefix', 'Prefix', 'assets/', {
      description: 'The folder inside the bucket the connector reads from.'
    })
  ],
  'live-ingest': [
    select('region', 'Region', INGEST_REGIONS, {
      required: true,
      description: 'Where the stream is ingested. Select the one closest to the broadcaster.'
    })
  ]
}

/** The fields a connector type asks for; `[]` for an unknown type. */
export const connectorTypeFields = (type) => CONNECTOR_TYPE_FIELDS[type] ?? []

/** The field on each type that IS the connector's address, for the record it creates. */
const ADDRESS_FIELD = { http: 'address', storage: 'bucket', 'live-ingest': 'region' }

// ── The answers ───────────────────────────────────────────────────────────────

/**
 * The from-scratch half of the create form, empty — save for the fields that declare a
 * `default` and so arrive filled. Filled is not the same as ON: every switch is still
 * off, so a filled field is an answer waiting inside a disclosure nobody has opened, and
 * a create that never opens one still provisions nothing.
 *
 * `values` is keyed by field name and shared across the options of one question: switching
 * template or type resets it (see `resetScratchOption`), because a value keyed to an option
 * the reader has abandoned would be sent anyway.
 */
export const defaultScratchConfig = () => ({
  // EVERYTHING OFF. Neither a cache policy nor a connector is required to create an
  // application, and a create that arrives with them switched on spends resources on
  // behalf of a reader who never read the rows — the same mistake the firewall row used
  // to make (../../components/firewall/FirewallBinding.vue). Off is what makes from
  // scratch the SHORT door: a name is the whole minimum, and each of these is a decision
  // made rather than a default absorbed.
  //
  // The values survive a switch going off, so toggling back restores what was typed. Only
  // an OPTION changing resets them (`resetScratchOption`), because those answers belong to
  // the option that asked for them — and a switched-off policy is never read
  // (`enabledCachePolicies`), so nothing it still holds can ride into the request.
  cache: {
    // One part per template, keyed by its value: the policies are independent of each
    // other, so one being on says nothing about the next, and each keeps its own answers.
    policies: Object.fromEntries(
      CACHE_POLICY_TEMPLATES.map((template) => [
        template.value,
        { enabled: false, values: seededValues(template.fields) }
      ])
    )
  },
  connector: { enabled: false, type: 'http', values: {} }
})

/**
 * Clear the values of a question whose option just changed, back to what the NEW option
 * arrives with — the answers the abandoned option held go, and the ones its replacement
 * declares (`default`) take their place, so a reset lands where a fresh form would.
 */
export const resetScratchOption = (part, fields = []) => {
  Object.keys(part.values).forEach((key) => delete part.values[key])
  Object.assign(part.values, seededValues(fields))
}

/**
 * Every field currently ON SCREEN, with its `errors` key.
 *
 * A switched-off part contributes none: its fields are not rendered, so a check against
 * them would fail on something the reader was never shown. Same for the fields of an
 * option they are not on.
 */
export const scratchFields = (config) => [
  // Keyed by POLICY as well as by field, because two policies on at once can both ask for
  // an `extensions` — one `cache.extensions` message would then be shown under both.
  ...enabledCachePolicies(config).flatMap((template) =>
    template.fields.map((field) => ({
      field,
      part: config.cache.policies[template.value],
      key: `cache.${template.value}.${field.name}`
    }))
  ),
  ...(config.connector.enabled ? connectorTypeFields(config.connector.type) : []).map((field) => ({
    field,
    part: config.connector,
    key: `connector.${field.name}`
  }))
]

/**
 * Fill `errors` with a message per required field left empty, and answer whether the
 * part is complete. Only fields ON SCREEN are checked — the ones the abandoned options
 * declare are not asked, so they cannot be missed.
 */
export const validateScratch = (config, errors) => {
  let valid = true
  scratchFields(config).forEach(({ field, part, key }) => {
    if (!field.required) return
    if (String(part.values[field.name] ?? '').trim()) return
    errors[key] = 'This field is required.'
    valid = false
  })
  return valid
}

/**
 * Drop every message under a prefix.
 *
 * The counterpart of the check above, and it is a FLOW's job rather than the card's: the
 * card that renders these fields reads the map and reports which part of it an edit just
 * invalidated (../../components/application/ApplicationLayer.vue → `clear`), and the flow
 * that filled the map is the one that empties it. Prefix and not key, because the three
 * things that invalidate a message invalidate different amounts of it: editing a field
 * clears its own (`cache.images.extensions`), switching a part off clears everything under
 * it (`cache.images.`), and changing the connector type clears the whole question
 * (`connector.`).
 */
export const clearScratchErrors = (errors, prefix) => {
  Object.keys(errors).forEach((key) => {
    if (key.startsWith(prefix)) delete errors[key]
  })
}

/**
 * The cache policies the create makes — one per switched-on template, and `[]` when none
 * is on: the create then makes none, and the outcome must not list one it never
 * provisioned. `detail` is built from whatever that template was told, so a template added
 * to the catalog needs no change here.
 */
export const scratchCachePolicies = (config, applicationName) =>
  enabledCachePolicies(config).map((template) => {
    const { values } = config.cache.policies[template.value]
    const answers = template.fields
      .map((field) => [field.label, String(values[field.name] ?? '').trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
    return {
      name: `${applicationName}-${template.value}`,
      template: template.label,
      detail: answers.join(' · ') || template.label
    }
  })

/**
 * The connector the create makes, in the shape the provisioning store stores — or `null`
 * when the switch is off, which leaves the chain the storage connector a provisioned
 * application gets by default (../../../shared/lib/provisioning.js).
 */
export const scratchConnector = (config, applicationName, typeLabel) => {
  if (!config.connector.enabled) return null
  const address = String(config.connector.values[ADDRESS_FIELD[config.connector.type]] ?? '').trim()
  return {
    name: `${applicationName}-${config.connector.type}`,
    kind: typeLabel,
    address
  }
}
