// Git provider connection — the account's link to GitHub, which is a fact about the
// ACCOUNT and not about whichever screen happens to be asking.
//
// It used to be a `ref` inside the Creation Center's importer pane
// (../../pages/resources/creation/GitImporter.vue), which was fine while the importer was
// the only screen that cared. It is not: deploying a TEMPLATE creates a repository too,
// so ../../pages/marketplace/DeployTemplate.vue needs the same answer — and a reader who
// connected GitHub in the importer, then came back and picked a template, would have been
// asked to connect a second time by a screen with no way of knowing they already had.
//
// So the connection lives here, at module scope, and both screens read it:
//
//   | Surface                       | What it reads                                   |
//   | ----------------------------- | ----------------------------------------------- |
//   | the importer's empty state    | `gitConnected` — connect, or list repositories  |
//   | the deploy flow's first phase | `gitConnected` — connect, or configure the repo |
//   | both screens' scope Select    | `gitAccounts` — ONE roster, in both places      |
//
// The roster is the reason this is a store and not just a boolean. Each screen used to
// carry its own fixture — the importer offered a single `git-account`, the deploy page
// offered three unrelated names — so the account the reader picked while importing had no
// counterpart on the page that actually creates the repository. One list, read by both.
//
// Everything here is a MOCK of the GitHub handshake: connecting and linking another
// account are timers. They are timers at MODULE scope, like ./deploy-runs.js, so a
// handshake started in one pane still settles if the reader navigates away mid-flight —
// the connection is not the screen's to lose. Nothing is persisted: a session starts
// disconnected, which is the state the connect step exists for, and a reload is the way
// back to it.
import { computed, ref } from 'vue'

/** The one provider this prototype connects. Its label and glyph, in one place. */
export const GIT_PROVIDER = { id: 'github', label: 'GitHub', icon: 'pi pi-github' }

/** How long the mock OAuth handshake takes. */
const HANDSHAKE_MS = 1500

// The linked scopes, in the order GitHub would hand them over. Empty means "no provider
// connected", which is where every session starts.
const linked = ref([])

// A handshake in flight, and the promise itself — shared, so the button that started it
// is not the only control that knows, and a second click awaits the first handshake
// instead of starting another.
const connecting = ref(false)
let handshake = null

// What the first connection grants: the reader's own account, then the two organizations
// it gives them access to. Named after the owner the rest of the flow already assumes (a
// repo import defaults its owner to `gab-az`), so the roster and the deploy it feeds agree.
const FIRST_CONNECT_SCOPES = ['gab-az', 'aziontech', 'azion-templates']

// Extra accounts linked after the first, counted so each gets its own name.
let extraCount = 0

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/** The linked scopes as `{ label, value }` — the shape both scope Selects bind. */
export const gitAccounts = computed(() =>
  linked.value.map((name) => ({ label: name, value: name }))
)

/** Whether a provider is connected at all. What both screens gate their first phase on. */
export const gitConnected = computed(() => linked.value.length > 0)

/** Whether a handshake is in flight. Drives the connect control's loading state. */
export const gitConnecting = computed(() => connecting.value)

/**
 * Connect the provider (mock OAuth), or link one more account once it is connected.
 *
 * @returns {Promise<string>} The scope to select when the handshake settles — the
 *   personal account on a first connect, the newly linked one after that.
 */
export function connectGitProvider() {
  if (handshake) return handshake
  connecting.value = true
  handshake = wait(HANDSHAKE_MS).then(() => {
    connecting.value = false
    handshake = null
    if (!linked.value.length) {
      linked.value = [...FIRST_CONNECT_SCOPES]
      return linked.value[0]
    }
    extraCount += 1
    const account = `github-account-${extraCount}`
    linked.value = [...linked.value, account]
    return account
  })
  return handshake
}
