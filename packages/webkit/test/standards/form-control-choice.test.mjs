import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REPO_ROOT = resolve(PKG_ROOT, '..', '..')
const INPUT_DIR = join(PKG_ROOT, 'src', 'components', 'input')
const SKILL = join(REPO_ROOT, 'skills', 'webkit-form', 'SKILL.md')
const HEADING = '## Pick the control from the kind of value'

// Not a control that holds a value: the field wrapper, the info glyph and a display token.
const NOT_A_VALUE_CONTROL = new Set(['field', 'hint', 'chip'])
// Controls from other categories a form field also uses.
const OTHER_FORM_CONTROLS = ['code-editor']

const pascal = (name) =>
  name
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('')

function section() {
  const text = readFileSync(SKILL, 'utf8')
  const start = text.indexOf(HEADING)
  assert.notEqual(start, -1, `skills/webkit-form/SKILL.md has no "${HEADING}" section`)
  const end = text.indexOf('\n## ', start + HEADING.length)
  return text.slice(start, end === -1 ? undefined : end)
}

function inputComponents() {
  return readdirSync(INPUT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(INPUT_DIR, name, `${name}.vue`)))
    .filter((name) => !NOT_A_VALUE_CONTROL.has(name))
}

test('the form skill names every input component in its control table', () => {
  const body = section()
  const missing = [...inputComponents(), ...OTHER_FORM_CONTROLS]
    .map(pascal)
    .filter((name) => !new RegExp(`\`${name}\``).test(body))
  assert.deepEqual(
    missing,
    [],
    `skills/webkit-form/SKILL.md, "${HEADING}": add a row for ${missing.join(', ')} ` +
      '(the kind of value it holds, what it binds, what it replaces). ' +
      'A form control the skill does not name is a control agents do not use.'
  )
})

test('the control table sends a date and a date and time to DatePicker', () => {
  const body = section()
  assert.match(body, /\| `DatePicker`\s+\|/)
  assert.match(body, /`DatePicker` with `show-time`/)
  assert.match(body, /`DateRangePicker`/)
})
