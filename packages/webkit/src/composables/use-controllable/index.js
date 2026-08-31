import { computed, ref, unref } from 'vue'

/**
 * Controlled / uncontrolled state (shadcn pattern): when the `prop` ref is undefined,
 * internal state seeded by `defaultProp` is used; `onChange` fires in both modes.
 * Returns the computed value with a `set` writer attached.
 */
export function useControllable({ prop, defaultProp, onChange }) {
  const internal = ref(defaultProp)

  const set = (next) => {
    if (unref(prop) === undefined) {
      internal.value = next
    }
    onChange(next)
  }

  const value = computed(() => (unref(prop) !== undefined ? unref(prop) : internal.value))

  return Object.assign(value, { set })
}
