// One channel per filter, so the CHIPS can open the BUTTON'S panel while living in a
// different row of the page.
//
// The two halves of the filter are siblings on screen — the button sits on the search's
// line, the chips on the row under it — which rules out both of the usual ways of
// sharing state: `provide`/`inject` needs one to be inside the other, and a prop pair
// would make every one of the ~29 list pages wire a ref it has no interest in.
//
// What they DO already share is the page's field catalog: the same array object is
// passed to both components. So the catalog is the key. A WeakMap keyed by it hands both
// halves the same ref without either knowing the other exists, and drops the entry when
// the page that owns the catalog goes away.
//
// The value is a {field, token} pair rather than a bare field id: asking twice for the
// same field is a real request both times (open Author, close, open Author again), and a
// watcher on a value that has not changed does not fire.
import { ref } from 'vue'

const channels = new WeakMap()

/** The shared open-request ref for `fields`, created on first use. */
export const openChannel = (fields) => {
  let channel = channels.get(fields)
  if (!channel) {
    channel = ref(null)
    channels.set(fields, channel)
  }
  return channel
}

/** Ask whoever owns `fields`' panel to open it on `fieldId`. */
export const requestOpen = (fields, fieldId) => {
  const channel = openChannel(fields)
  channel.value = { field: fieldId, token: (channel.value?.token ?? 0) + 1 }
}
