// The greeting — what Overview says before it says anything about the account.
//
// A console's landing page opens on numbers, and numbers are the same at 9am and at
// 2am. One line that knows what time it is costs nothing and is the only part of the
// page addressed to the PERSON rather than to their infrastructure.
//
// ── THE BANDS ──
//
// Five, because English has five and collapsing them produces the two failures every
// time-aware greeting makes: "Good evening" at midnight, and "Good morning" at 4am to
// somebody who has not been to bed. The last two bands say what is actually happening
// instead of pretending it is a normal hour.
//
//   05–11  Good morning
//   12–17  Good afternoon
//   18–21  Good evening
//   22–01  Working late          (not "Good night" — in English that is a goodbye)
//   02–04  Up before the sun     (overnight; owns the wrap past midnight)
//
// The bands are declared as [startHour, label] over a 24-hour day and resolved by
// scanning DOWN, so the wrap at midnight is expressed once, by the 22:00 band running
// to 02:00, rather than by a special case at every call site.
//
// ── WHY IT IS REACTIVE ──
//
// A console tab stays open for days. A greeting read once at mount is wrong for
// however long the tab lives past the band it was computed in — "Good morning" at 6pm
// on a page nobody reloaded. So the ref re-reads on a timer aligned to the next hour,
// which is the coarsest tick that can never be wrong, and the timer is torn down with
// the scope that asked for it.
import { computed, onScopeDispose, ref } from 'vue'

const BANDS = [
  [22, 'Working late'],
  [18, 'Good evening'],
  [12, 'Good afternoon'],
  [5, 'Good morning'],
  [2, 'Up before the sun'],
  // 00:00–01:59 belongs to the band that started at 22:00 the previous day.
  [0, 'Working late']
]

const labelFor = (hour) => BANDS.find(([start]) => hour >= start)?.[1] ?? 'Hello'

/** ms until the top of the next hour — the only moment the label can change. */
const msToNextHour = (now) =>
  (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000 - now.getMilliseconds()

// Who the sample is signed in AS when the address carries no name of its own — the
// seeded account's Owner (../views/account/UsersManagement.vue). The placeholder
// address (`myemail@azion.com`) is the SAMPLE's own, not an unknown reader's: it is
// what every route falls back to when nobody typed an address at sign-in, and the
// account behind it already has an owner, a team and rows. Greeting that account by
// its owner's name is therefore the accurate line, and it is the one the page needs —
// a greeting with no name is a heading addressed to nobody, which is exactly what the
// rest of Overview already is.
const ACCOUNT_OWNER = 'Gabriel'

/**
 * A name to greet, derived from the signed-in address.
 *
 * The sample's identity is an email (it is what every route carries), so the name is
 * its local part, cleaned of the separators addresses use and title-cased:
 * `gabriel.mendonca@azion.com` → "Gabriel". Only the FIRST token — a greeting is not
 * a form field, and "Good morning, Gabriel Mendonca" reads like one.
 *
 * An address that names no person — the placeholder, an empty query, an account id
 * for a local part — falls back to the account owner above rather than to nothing.
 */
export const nameFromEmail = (address) => {
  const local = String(address ?? '')
    .split('@')[0]
    .trim()
  if (!local || local.toLowerCase() === 'myemail') return ACCOUNT_OWNER
  const first = local.split(/[._+-]/).filter(Boolean)[0] ?? ''
  // A local part that is mostly digits is an account id, not a person.
  if (!first || /^\d+$/.test(first)) return ACCOUNT_OWNER
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

/**
 * The greeting for right now, re-read on the hour.
 *
 * `greeting` is the bare label ("Good morning"); `nameFor(email)` is the person it
 * is addressed to; `greetingFor(email)` is the whole line as one string, for the
 * callers that render it as one.
 *
 * The two parts are exposed separately because Overview renders them in two colours —
 * the label muted, the name at full contrast — so the line reads as being addressed
 * to a person rather than as a label that happens to contain one.
 */
export function useGreeting() {
  const label = ref(labelFor(new Date().getHours()))

  let timer
  const tick = () => {
    label.value = labelFor(new Date().getHours())
    timer = globalThis.setTimeout(tick, msToNextHour(new Date()) + 1000)
  }
  timer = globalThis.setTimeout(tick, msToNextHour(new Date()) + 1000)

  onScopeDispose(() => globalThis.clearTimeout(timer))

  return {
    greeting: computed(() => label.value),
    nameFor: (address) => nameFromEmail(address),
    greetingFor: (address) => {
      const name = nameFromEmail(address)
      return name ? `${label.value}, ${name}` : label.value
    }
  }
}
