export const LAYOUT_CLASS_ALLOWLIST = Object.freeze([
  Object.freeze({ family: 'w-full', pattern: 'w-full', match: /^w-full$/ }),
  Object.freeze({ family: 'max-w-*', pattern: 'max-w-<value>', match: /^max-w-\S+$/ }),
  Object.freeze({ family: 'self-*', pattern: 'self-<value>', match: /^self-\S+$/ }),
  Object.freeze({ family: 'shrink-0', pattern: 'shrink-0', match: /^shrink-0$/ })
])

export function isLayoutClass(token) {
  return LAYOUT_CLASS_ALLOWLIST.some((entry) => entry.match.test(token))
}

export function disallowedLayoutClasses(classString) {
  return String(classString)
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !isLayoutClass(token))
}

export const LAYOUT_CLASS_FAMILIES = Object.freeze(LAYOUT_CLASS_ALLOWLIST.map((e) => e.family))
