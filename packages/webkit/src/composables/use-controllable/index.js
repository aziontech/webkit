import { computed, ref, unref } from 'vue'

/**
 * Controlled / uncontrolled state (shadcn pattern).
 * When `prop` is `undefined`, internal state is used.
 *
 * @template T
 * @param {object} options
 * @param {import('vue').Ref<T | undefined>} options.prop - Controlled value from props (`undefined` when uncontrolled).
 * @param {T} options.defaultProp - Initial value when uncontrolled.
 * @param {(value: T) => void} options.onChange - Called when the value changes (controlled and uncontrolled).
 * @returns {import('vue').ComputedRef<T> & { set: (value: T) => void }}
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
