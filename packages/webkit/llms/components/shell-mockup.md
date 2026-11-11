# Shell Mockup

> A scaled, inert picture of an Azion Console screen, for marketing bands that show the product. The consumer composes the screen's body from real webkit components at a fixed design width; the frame draws the console shell around it (the slim console bar, the side rail with breadcrumbs and actions, or the previous console's top bar) and scales the whole drawing to fit its host. Each piece of the body is a `ShellMockup.Part` that travels in on its own beat once the mockup scrolls into view, so the screen assembles itself instead of appearing all at once.

- Import: `import ShellMockupRoot from '@aziontech/webkit/shell-mockup-root'`
- Compound import (dot notation, not tree-shakeable): `import ShellMockup from '@aziontech/webkit/shell-mockup'`
- Category: content · Surface: product · Structure: composition
- API as JSON: [shell-mockup.json](https://github.com/aziontech/webkit/blob/main/.specs/shell-mockup.json)

## When to use

- Showing a console screen or fragment on a marketing band: a hero, a media split, a feature tab, a widget grid cell.
- Depicting a product workflow with real webkit controls instead of a screenshot, so the drawing follows the theme and stays sharp at any size.
- Staggering the parts of a mock so they arrive in reading order when the band scrolls into view, and replaying that entrance each time a tab makes the mock active.
- Drawing only a fragment of a screen (a list, a form row) floating on the band's own surface, with `kind="bare"` and `chrome` off.

## Do

- Compose the body at the design width (`width`, `mobileWidth`), not at the host's width; the frame scales the drawing, so sizes inside are design pixels.
- Give the host a height (or an aspect ratio); the frame fills its host and derives its design height from it.
- Number parts in reading order with `order`, starting at `0`; parts on the same beat land together.
- Keep the mockup decorative: it is hidden from assistive technology unless `interactive` is set, so the band's own copy must say what the picture shows.
- Set `active` from the host when several mockups share one slot (tabs), so only the visible one plays and it replays when it returns.
- Tune a fade with the consumer-side custom properties `--mockup-fade-start` / `--mockup-fade-end` (or `--mockup-fade-edge` for `y`) and match its color to the host surface with `--mockup-fade-color`.

## Don’t

- To show a real, working screen at a device size → use `browser-frame`; it renders live content in a true viewport, not a scaled picture.
- For a static screenshot or clip in documentation → use `doc-frame`.
- For an illustration scene → use `illustration`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [browser-frame](browser-frame.md) — a live, resizable viewport for real screens; `shell-mockup` is an inert, scaled drawing of the console.
- [texture-material](texture-material.md) — the texture the frame grounds itself with when `texture` is set.
- [frame-box](frame-box.md) — the page's registration frame a mockup band is often placed inside.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'window' \| 'bare'` | `'window'` | false | How the mockup is plated: a bordered console window, or bare parts floating on the host's surface. |
| `shell` | `'console' \| 'legacy'` | `'console'` | false | Console generation the shell draws: the current one, or the previous one with its top bar. |
| `width` | `number` | `860` | false | Design width of the frame from `md` up; the frame scales to fit its host. |
| `mobileWidth` | `number` | `390` | false | Design width of the frame below `md`. |
| `fade` | `'none' \| 'bottom' \| 'top' \| 'left' \| 'right' \| 'y'` | `'none'` | false | Edge the mockup fades out along; `y` fades top and bottom. |
| `chrome` | `boolean` | `true` | false | Draws the console bar over the body. |
| `title` | `string` | `''` | false | Module label on the console bar; with a rail, `›` splits it into breadcrumbs. |
| `rail` | `string` | `''` | false | Active entry of the console's side rail; empty renders no rail. |
| `texture` | `'dots' \| 'grid' \| 'lines' \| 'dither' \| 'pixelate' \| 'none'` | `'none'` | false | Texture the frame is grounded with, behind the body. |
| `textureFade` | `'none' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'edges' \| 'vignette'` | `'vignette'` | false | How the frame's texture fades out before its edges. |
| `travel` | `'fast-01' \| 'fast-02' \| 'moderate-01' \| 'moderate-02' \| 'slow-01' \| 'slow-02'` | `'slow-01'` | false | Duration token of each part's travel. |
| `beat` | `'fast-01' \| 'fast-02' \| 'moderate-01' \| 'moderate-02' \| 'slow-01' \| 'slow-02'` | `'fast-01'` | false | Duration token of the gap between one part's beat and the next. |
| `active` | `boolean` | `true` | false | Whether this mockup is the one showing; parts replay their entrance each time it becomes active. |
| `interactive` | `boolean` | `false` | false | Lets the viewer operate the controls inside instead of drawing them as an inert picture. |
| `animated` | `boolean` | `true` | false | Plays the entrance as the frame comes into view and replays it when `active` turns back on. Off draws every part in place from the start, with no entrance and no replay. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The mockup's body, composed of `ShellMockup.Part` beats. |
| `overlay` | — | A layer over the whole frame, bar and rail included, such as a drawer. |

## Sub-component imports

- `@aziontech/webkit/shell-mockup-part`

## Sub-components

- `shell-mockup-part/shell-mockup-part.vue` — one beat of the mockup's entrance. Context-aware: it reads the root's entered state and beat timing through `inject`, starts one step below its resting place at zero opacity, and travels into place on the beat its `order` names. Throws when rendered outside a `ShellMockup`.
  - Props: `order?: number` (default `0` — beat this part arrives on; each beat lands one `beat` after the one before it).
  - Slots: `default` — the part's content.
  - Root: a `div` with `data-entered` while landed, forwarding attributes; `data-testid` fallback `content-shell-mockup-part`.

Layout:

```
packages/webkit/src/components/content/shell-mockup/
├── shell-mockup.vue
├── shell-mockup.test.ts
├── index.ts                         (Object.assign(ShellMockup, { Part }))
├── injection-key.ts                 (ShellMockupContext + SHELL_MOCKUP_KEY)
├── composables/
│   └── use-shell-mockup-context.ts  (inject + throw outside the provider)
└── shell-mockup-part/
    └── shell-mockup-part.vue
```

Exports: `./shell-mockup` → `index.ts`, `./shell-mockup-root` → `shell-mockup.vue`, `./shell-mockup-part` → `shell-mockup-part/shell-mockup-part.vue`.

## States

- `data-kind` (`window` \| `bare`) on the root and the frame: `window` paints the canvas fill, a hairline rim lit from the top-left and bottom-right corners, and the card shape, and clips the drawing; `bare` paints nothing and lets parts overflow sideways while clipping vertically.
- `data-fade` mirrors `fade` on the root and the fade layer; `none` renders no fade layer.
- `data-interactive` is present while `interactive` is set; otherwise the root is `inert` and `aria-hidden`, ignores the pointer and blocks text selection.
- The bars and the rail are drawings: plain `div`s (no `header`, `aside` or `nav` landmark), each `inert` and `aria-hidden="true"` whatever `interactive` says, so only the slot body is ever operable.
- Shell matrix: `shell="console"` without `rail` draws the slim bar (brand, title, avatar); with `rail` it draws the side rail (from `md` up) and a top bar with breadcrumbs, a search field, Create, Agent and the avatar; `shell="legacy"` draws the previous console's top bar (menu, brand, Create, Copilot, Feedback, help, account) and swaps the legacy typography weights and line heights onto the frame. `chrome` off removes the bars; the rail stays.
- Entrance: parts are at rest offset and transparent until the root is at least 30% on screen and `active`; two animation frames later the root flips to entered and each part lands on its beat. `active` turning off resets it so it replays. `animated` off, or a reduced-motion preference, starts entered with no transition.
- Scale: the frame keeps the design width (`width` from `md` up, `mobileWidth` below) and scales to the host's width, deriving its design height from the host's height; it re-measures when the host resizes and when `width` or `mobileWidth` changes.

## Accessibility

- Visible focus: none by default — the root is `inert`, so nothing inside takes focus. With `interactive`, the composed controls keep their own focus rings.
- Keyboard map: none by default (inert). With `interactive`, `Tab` reaches the composed controls in DOM order and each keeps its own keyboard behavior; the shell's own bar, rail and search are drawings and never take focus.
- ARIA: the root is a `figure` with `aria-hidden="true"` and `inert` unless `interactive`; the band hosting it carries the text that describes it. The bars and the rail are non-landmark `div`s that stay `inert` and `aria-hidden="true"` even when `interactive`, so the mockup never exposes a `banner`, `navigation` or `complementary` landmark, nor a focusable drawn control, inside the host page.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the shell's text uses `var(--text-default)` and `var(--text-muted)` on `var(--bg-canvas)` / `var(--bg-surface-raised)`, the same pairs the console uses.
- `motion-reduce:` landing classes and `motion-reduce:transition-none` on every part.
- Touch target: not applicable by default (inert). Interactive content keeps the composed components' own targets.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`. The scaled frame is anchored at `start-0` and scales from its start corner (`origin-top-left`, `rtl:origin-top-right`), so it fits its host in both directions.
- Icons: the breadcrumb angle mirrors (`rtl:-scale-x-100`); the `Kbd` search hint stays left to right.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import ShellMockup from '@aziontech/webkit/shell-mockup'
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="h-96 w-full">
    <ShellMockup
      title="Workloads › my-workload"
      rail="workloads"
      fade="bottom"
    >
      <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
        <ShellMockup.Part :order="0">
          <div class="flex items-center justify-between gap-(--spacing-md)">
            <span class="text-heading-sm text-(--text-default)">Workloads</span>
            <Button
              label="Create workload"
              icon="pi pi-plus"
              size="medium"
            />
          </div>
        </ShellMockup.Part>
        <ShellMockup.Part :order="1">
          <div class="flex items-center gap-(--spacing-sm)">
            <Input
              placeholder="Search workloads"
              size="small"
            />
            <Tag
              label="3 active"
              severity="success"
              size="small"
            />
          </div>
        </ShellMockup.Part>
        <ShellMockup.Part :order="2">
          <Table bordered>
            <Table.Header>
              <Table.Row>
                <Table.HeadCell principal>Name</Table.HeadCell>
                <Table.HeadCell>Domain</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell principal>my-workload</Table.Cell>
                <Table.Cell>my-workload.azion.app</Table.Cell>
                <Table.Cell
                  ><Tag
                    label="Active"
                    severity="success"
                    size="small"
                /></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell principal>storefront</Table.Cell>
                <Table.Cell>shop.example.com</Table.Cell>
                <Table.Cell
                  ><Tag
                    label="Active"
                    severity="success"
                    size="small"
                /></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell principal>docs-portal</Table.Cell>
                <Table.Cell>docs.example.com</Table.Cell>
                <Table.Cell
                  ><Tag
                    label="Deploying"
                    severity="warning"
                    size="small"
                /></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </ShellMockup.Part>
      </div>
    </ShellMockup>
  </div>
</template>
```

### Types

```vue
<script setup>
  import ShellMockup from '@aziontech/webkit/shell-mockup'
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-(--spacing-lg)">
    <div class="h-80 w-full">
      <ShellMockup
        kind="window"
        title="Workloads"
        fade="bottom"
      >
        <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
          <ShellMockup.Part :order="0">
            <div class="flex flex-wrap items-center justify-between gap-(--spacing-md)">
              <span class="text-heading-sm text-(--text-default)">Workloads</span>
              <Button
                label="Create workload"
                icon="pi pi-plus"
                size="medium"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="1">
            <div class="flex items-center gap-(--spacing-sm)">
              <Input
                placeholder="Search workloads"
                size="small"
              />
              <Tag
                label="3 active"
                severity="success"
                size="small"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="2">
            <Table bordered>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell>Domain</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell principal>my-workload</Table.Cell>
                  <Table.Cell>my-workload.azion.app</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>storefront</Table.Cell>
                  <Table.Cell>shop.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>docs-portal</Table.Cell>
                  <Table.Cell>docs.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Deploying"
                      severity="warning"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </ShellMockup.Part>
        </div>
      </ShellMockup>
    </div>
    <div class="h-80 w-full">
      <ShellMockup
        kind="bare"
        :chrome="false"
        fade="bottom"
      >
        <div class="flex flex-col gap-(--spacing-md) p-(--spacing-lg)">
          <ShellMockup.Part :order="0">
            <div class="flex flex-wrap items-center justify-between gap-(--spacing-md)">
              <span class="text-heading-sm text-(--text-default)">Workloads</span>
              <Button
                label="Create workload"
                icon="pi pi-plus"
                size="medium"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="1">
            <div class="flex items-center gap-(--spacing-sm)">
              <Input
                placeholder="Search workloads"
                size="small"
              />
              <Tag
                label="3 active"
                severity="success"
                size="small"
              />
            </div>
          </ShellMockup.Part>
          <ShellMockup.Part :order="2">
            <Table bordered>
              <Table.Header>
                <Table.Row>
                  <Table.HeadCell principal>Name</Table.HeadCell>
                  <Table.HeadCell>Domain</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell principal>my-workload</Table.Cell>
                  <Table.Cell>my-workload.azion.app</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>storefront</Table.Cell>
                  <Table.Cell>shop.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Active"
                      severity="success"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell principal>docs-portal</Table.Cell>
                  <Table.Cell>docs.example.com</Table.Cell>
                  <Table.Cell
                    ><Tag
                      label="Deploying"
                      severity="warning"
                      size="small"
                  /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </ShellMockup.Part>
        </div>
      </ShellMockup>
    </div>
  </div>
</template>
```
