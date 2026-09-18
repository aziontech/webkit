// The rules a seeded firewall is holding — the fixtures the Firewall → Rules Engine tab
// opens on (../../pages/secure/panels/FirewallRulesEngine.vue).
//
// Separate from ./firewall-rules.js for the same reason the application's seed is separate
// from its vocabulary: that file says what a firewall rule CAN be, this one is a handful of
// rules that exist. The shape is the record the drawer reads and writes — criteria as the
// structured model, behaviors carrying the argument their type declares — so a seeded rule
// and one written in the drawer are the same thing.
import { daysAgo } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'

const condition = (variable, operator, argument = '') => ({
  id: `${variable}-${operator}-${argument}`,
  join: null,
  variable,
  operator,
  argument
})

const SEED = [
  {
    id: 'fw-waf',
    name: 'Inspect everything',
    description: 'Scores every request against the default rule set.',
    phase: 'request',
    criteria: [{ id: 'fc1', conditions: [condition('${uri}', 'matches', '/*')] }],
    behaviors: [{ id: 'fb1', type: 'set-waf-ruleset', wafId: 'waf-1' }],
    status: 'Active',
    modifiedAt: daysAgo(6)
  },
  {
    id: 'fw-admin',
    name: 'Refuse admin from outside',
    description: 'Denies the admin path to anything that is not an office range.',
    phase: 'request',
    criteria: [{ id: 'fc2', conditions: [condition('${uri}', 'starts-with', '/admin')] }],
    behaviors: [{ id: 'fb2', type: 'deny' }],
    status: 'Active',
    modifiedAt: daysAgo(19)
  },
  {
    id: 'fw-rate',
    name: 'Rate limit the API',
    description: 'Caps a single client to 20 requests per second on the API.',
    phase: 'request',
    criteria: [{ id: 'fc3', conditions: [condition('${uri}', 'starts-with', '/api')] }],
    behaviors: [{ id: 'fb3', type: 'set-rate-limit', average: '20', burst: '40' }],
    status: 'Inactive',
    modifiedAt: daysAgo(41)
  }
]

/**
 * The rules one firewall holds. Every seeded firewall opens on the same three — they are
 * fixtures, not per-record data — decorated with the roster every other list reads, so a
 * rule written here and one seeded weeks ago carry the same Last Modified block.
 *
 * @param {string} firewallId The firewall whose rules these are.
 * @returns {object[]} A fresh copy, so one firewall's reorder cannot move another's rows.
 */
export const firewallRulesFor = (firewallId) =>
  SEED.map((rule, index) => {
    const person = authorAt(index)
    return {
      ...rule,
      id: `${firewallId}-${rule.id}`,
      author: person.name,
      authorAvatar: person.avatar
    }
  })
