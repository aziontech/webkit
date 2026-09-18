// THE PROJECT THE READER JUST DROPPED — its files, held between the screen that took the
// drop and the screen that deploys it.
//
// Everything else about an upload rides the URL: the Creation Center navigates to
// `/deploy?upload=<name>&framework=<tech>`, and both of those are strings a reload can
// recover. The FILES are not. A `File` off a `DataTransfer` is a live handle to bytes on
// the reader's machine — there is no query-string form of it, no id to fetch it back by,
// and serializing the listing into the URL would put a project's filenames in the address
// bar and still lose it on the next drop.
//
// So the manifest lives here, at module scope, exactly like the Git connection does
// (./git-provider.js): written by whichever surface reads the drop, read by the deploy
// flow, and gone when the tab is.
//
// ── WHAT A RELOAD DOES ──
//
// Loses it, and that is the honest answer. A reloaded `/deploy?upload=my-project` still
// knows what the project is called and what it is built with, so the form still works;
// the file listing and the root picker simply are not drawn, because the browser no
// longer has the files and we will not draw a listing we cannot stand behind. Dropping
// the project again brings them back.
//
// Keyed by the project NAME rather than kept as a bare latest-drop: two deploys open in
// two tabs share this module in neither direction, but a reader who drops one project,
// goes back, and drops another should not see the first one's files under the second
// one's name.
import { ref } from 'vue'

const dropped = ref(null)

/**
 * Hold on to a project read off a drop or a picker, so the deploy screen can list it.
 *
 * @param {{ name: string, files: { path: string, name: string, size: number }[], truncated: boolean }} project
 */
export const rememberDroppedProject = (project) => {
  dropped.value = project
}

/**
 * The manifest for the named project, or `null` when this session never read it — a
 * reload, a pasted link, or a deploy that did not come from a drop at all.
 *
 * @param {string} name The project name on the URL (`?upload=`).
 * @returns {{ name: string, files: { path: string, name: string, size: number }[], truncated: boolean } | null}
 */
export const droppedProjectFor = (name) =>
  dropped.value && dropped.value.name === name ? dropped.value : null
