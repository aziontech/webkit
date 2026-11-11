# WebKit visual suite

`@aziontech/webkit-visual` is the styled visual regression of WebKit: Playwright screenshots, with
the real theme CSS, of the docs site's examples and blocks and of the demos. The browser unit
suite (`packages/webkit`, Vitest) runs without CSS and owns behavior, structure and ARIA; this
suite owns pixels: layout, color, contrast in context, focus rings, overflow.

```bash
pnpm docs:build && pnpm demos:build   # the suite serves apps/docs/dist and apps/demos/dist
pnpm visual:test                      # compare with apps/visual/baselines
pnpm visual:update                    # rewrite the baselines (only inside the Playwright image)
```

## What it covers

| Spec                     | Pages                                                          | Matrix                                                                                                                                                                                                                     |
| ------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/examples.spec.ts` | `/example/<dir>/<file>` — the first example of every component | light 1280, dark 1280, light 390                                                                                                                                                                                           |
| `tests/blocks.spec.ts`   | `/frame/<state>/<id>` — the primary state of every block       | light 1280, dark 1280, dark 390; every state of `platform/ai/*` in light and dark at 320 and 1280 and right to left                                                                                                        |
| `tests/demos.spec.ts`    | every demo route, plus the flows end to end                    | light 1280, dark 1280, dark 390; resource routes also light 1280 right to left in pt-BR                                                                                                                                    |
| `tests/geometry.spec.ts` | styled geometry that the unstyled unit suite cannot see        | `Table` cell presets at 360 / 768 / 1280, a reorder mid-drag beside frozen columns, the open `OverflowCount`, `OtpInput` at 320, team permissions, the token reveal and the account switcher at 320 / 1920 / right to left |

New examples, blocks and demo routes are picked up from the files: add an example to
`packages/webkit/examples/<name>/` and the docs page and its visual test exist; the only manual
step is the baseline.

Each test fixes the clock (2026-11-10 12:00 UTC), the time zone (UTC) and the locale, reduces
motion, waits for fonts, and blocks every request that is not to `localhost` (remote avatars and
fonts render their fallback), so a screenshot changes only when WebKit does.

## Baselines

`baselines/` is committed and is the CI contract. Screenshots differ between machines (font
rasterization), so baselines are generated only in `mcr.microsoft.com/playwright:v1.62.0-noble`,
the image the `visual` job in `.github/workflows/governance.yml` runs in. To regenerate them for a
branch, dispatch `.github/workflows/visual-baselines.yml` (`pnpm visual:update:baseline`) and
commit the artifact after reviewing it; the `regen-baselines` skill describes the flow. Locally,
run the suite inside the same image:

```bash
docker run --rm --ipc=host -v "$PWD":/w -w /w/apps/visual \
  mcr.microsoft.com/playwright:v1.62.0-noble npx playwright test
```
