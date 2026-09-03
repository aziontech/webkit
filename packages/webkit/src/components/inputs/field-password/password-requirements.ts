/**
 * One password rule. It carries its test, not its result: the field owns the value and
 * re-evaluates every rule as the user types; a pre-computed boolean would freeze the
 * chips at whatever the consumer passed.
 */
export interface PasswordRequirement {
  /** Stable id, independent of the localizable label; a consumer removes or replaces a rule by key. */
  key?: string
  /** Text shown inside the chip. */
  label: string
  /** Pattern or predicate the current value must satisfy for the rule to be met. */
  test: RegExp | ((value: string) => boolean)
}

/**
 * The rule set a bare `requirements` prop enables, in design order. A consumer passes
 * their own array for a different set; to start from these and drop one, filter by `key`.
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { key: 'length', label: '8-128 characters', test: /^.{8,128}$/ },
  { key: 'uppercase', label: 'Uppercase letter', test: /[A-Z]/ },
  { key: 'special', label: 'Special character', test: /[^A-Za-z0-9]/ },
  { key: 'number', label: 'Number', test: /\d/ },
  { key: 'lowercase', label: 'Lowercase letter', test: /[a-z]/ }
]
