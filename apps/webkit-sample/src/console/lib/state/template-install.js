import { ref } from 'vue'

const pending = ref(null)

/**
 * Hold the rule an integration template just prepared, so the application it installs on
 * can open its Rules Engine already drafted. Module scope, like a dropped project's
 * manifest (./dropped-project.js) — a reload loses it and the Rules Engine opens on its
 * list instead.
 *
 * @param {{slug: string, title: string, application: string, rule: object}} install
 */
export const rememberTemplateInstall = (install) => {
  pending.value = install
}

/**
 * The install waiting for the named template, or `null` when this session never prepared
 * one.
 *
 * @param {string} slug
 */
export const templateInstallFor = (slug) =>
  pending.value && pending.value.slug === slug ? pending.value : null

/** The install waiting to be saved, whichever template it belongs to. */
export const pendingTemplateInstall = () => pending.value

/** Drops the pending install once its rule has been read. */
export const clearTemplateInstall = () => {
  pending.value = null
}
