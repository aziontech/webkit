# Known test failures

The register of tests that fail for a reason we know and have not fixed yet: flaky tests that
pass alone and fail under load, and pre-existing failures that are not caused by the change under
review. A failure listed here does not block a PR on its own; a failure that is not listed does.

Keep it current: add a row when a failure is seen twice and understood, remove the row in the
commit that fixes it, and re-check every row before a release. The test environment (Vitest
browser mode in real Chromium, unstyled DOM) is described in [`OVERVIEW_TESTS.md`](./OVERVIEW_TESTS.md)
and [`testing.md`](../rules/testing.md).

All commands run from `packages/webkit`:

```bash
CI= PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm exec vitest run <test file> -t "<test name>"
```

## Pre-existing failures

Fail on every run, alone too.

| Test                                                                                                                     | Symptom                                                                                                                                                                                       | Status (checked 2026-11-16)                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/test/forced-colors-charts.test.ts` › `chart/error-state.vue keeps its marks under forced-colors: active` (Chromium) | `marks drawn with a background vanished: expected 0.2426 to be greater than 0.25`: under forced colors the error-state example keeps about 24% of its inked pixels, just under the 25% floor. | Open. Fails alone. Decide whether the error state should draw more marks in forced colors or the example is exempt from the floor. |

## Flaky under load

Pass alone, fail now and then in a full or sharded run on a busy host. Re-run the file alone before
treating one of these as a regression.

| Test                                                                                                                                                            | Symptom in the failing run                                                                                                                  | Status (checked 2026-11-16) |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `src/components/overlay/hover-card/hover-card.test.ts` › `hover opens after the open delay and leaving closes after the close delay`                            | The card is still open after the close delay (`expected <div id="v-0-hover-card"> to be null`): timer-based, slips when the host is loaded. | Open. Passes alone.         |
| `src/components/content/avatar/avatar.test.ts` › `draws the marble pattern in place of the initials and names it with the full label`                           | `Unable to find an element by: [data-testid="avatar__pattern"]`.                                                                            | Open. Passes alone.         |
| `src/test/blocks/account/team-permissions.test.ts` › `EditTeam` tests (asks for a user before Add, removes a member and Discard restores, asks before deleting) | `Unable to find an element with the text: Choose a user to add.` and similar: the drawer content is not there yet.                          | Open. Passes alone.         |
| `src/components/section/article-body/article-body.test.ts` › `scrolls to a heading from the outline and writes its hash`                                        | `expected '' to be '#results-and-impact'`: the hash is read before the scroll handler writes it.                                            | Open. Passes alone.         |

Other engines (Firefox and WebKit runs only) and the styled visual suite: see `ROADMAP.md`, M2.10
rows 52, 74 and 83 (OtpInput Backspace in Firefox, MapChart keyboard walk and a 320 px reflow in
WebKit, the console account-switch geometry check). Those rows were not re-checked for this register.
