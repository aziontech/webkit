// Device Groups — the User-Agent classes an application groups requests into.
//
// Azion v4 creates one with a two-field request:
//
//   POST /v4/edge_application/applications/{application_id}/device_groups
//   { name, user_agent }
//
// That IS the whole resource — there is no third field to reach for. What the API
// does add is a constraint the console has to carry, because the endpoint rejects
// anything else: `name` is LOWERCASE ALPHANUMERIC ONLY. No spaces, no underscores,
// no hyphens, no uppercase. So `mobiledevices`, never `Mobile devices`.
//
// The store lives here rather than in the Device Groups panel because a device
// group is referenced from OUTSIDE that panel: a cache setting's Adaptive Delivery
// varies the cache key by device group (./cache-settings.js), and a rule can match
// on one. A group created on the Device Groups tab has to be selectable on the
// Cache Settings tab in the same session, which a ref local to one panel cannot do.
import { ref } from 'vue'

/** The API's name rule, as a matcher. Empty is not valid — the field is required. */
export const DEVICE_GROUP_NAME_PATTERN = /^[a-z0-9]+$/

/** Says once, for every field that needs it, what the endpoint will accept. */
export const DEVICE_GROUP_NAME_RULE =
  'Lowercase letters and numbers only. Spaces, uppercase and special characters are rejected.'

// Seeded so both tabs land on a populated surface. The names obey the constraint
// above on purpose — a seed the API would reject teaches the wrong shape.
const deviceGroups = ref([
  { id: 'dg-mobile', name: 'mobiledevices', userAgent: '(Mobile|iPhone|Android|BlackBerry)' },
  { id: 'dg-desktop', name: 'desktop', userAgent: 'Mozilla.*(Windows|Macintosh)' }
])

/** Every device group on this application. */
export const useDeviceGroups = () => deviceGroups

/** Prepends a new group, so it appears in the list without a reload. */
export const addDeviceGroup = ({ name, userAgent }) => {
  const record = { id: `dg-${Date.now()}`, name, userAgent }
  deviceGroups.value = [record, ...deviceGroups.value]
  return record
}

/** `{ label, value }` options for a selector over the groups. */
export const deviceGroupOptions = () =>
  deviceGroups.value.map((group) => ({ label: group.name, value: group.id }))
