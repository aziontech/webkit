/**
 * One password rule. The rule carries its test, not its result: the field owns the
 * value, so it evaluates every rule against the current one and re-renders as the
 * user types. A pre-computed boolean would freeze the chips at whatever the consumer
 * passed, which is decoration rather than validation.
 */
export interface PasswordRequirement {
  /**
   * Stable identifier for the rule, independent of its localizable label. Every default
   * rule carries one so a consumer removes or replaces it by key, never by the label.
   */
  key?: string
  /** Text shown inside the chip. */
  label: string
  /** Pattern or predicate the current value must satisfy for the rule to be met. */
  test: RegExp | ((value: string) => boolean)
}

/**
 * The rule set a bare `requirements` prop enables, in the order the design shows it.
 * A consumer who needs a different set passes their own array instead; to start from
 * these and drop one, filter by `key`.
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { key: 'length', label: '8-128 characters', test: /^.{8,128}$/ },
  { key: 'uppercase', label: 'Uppercase letter', test: /[A-Z]/ },
  { key: 'special', label: 'Special character', test: /[^A-Za-z0-9]/ },
  { key: 'number', label: 'Number', test: /\d/ },
  { key: 'lowercase', label: 'Lowercase letter', test: /[a-z]/ }
]
