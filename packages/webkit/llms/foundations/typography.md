# Typography

> The generated typography classes: font, size, line height and tracking in one class.

Text uses the generated classes from `@aziontech/theme`. Each one bundles font family, size, line height and tracking, so a raw Tailwind size (`text-sm`), `leading-*`, `tracking-*` or a `font-family` is never needed and lint blocks them.

## Classes

| Class | Base size | Steps to | Purpose |
| --- | --- | --- | --- |
| `text-amount-lg` | `1.875rem` | sm: 3rem, md: 3.5rem | The largest price or amount. |
| `text-amount-md` | `1rem` | sm: 1.25rem, md: 1.5rem | A price or amount in a card. |
| `text-amount-sm` | `1rem` |  | A compact price or amount. |
| `text-big-number-lg` | `1.5rem` | sm: 2.25rem, md: 3.5rem | The largest numeric figure on one line, shrunk to fit its container. |
| `text-big-number-md` | `1.25rem` | sm: 1.5rem, md: 2.25rem | A numeric figure in a stat card, on one line, shrunk to fit. |
| `text-big-number-sm` | `1rem` | sm: 1.25rem | A compact numeric figure, on one line, shrunk to fit. |
| `text-big-number-unit-lg` | `1.5rem` | sm: 2.25rem, md: 3.5rem | The unit after a text-big-number-lg figure, in the text face so its case is kept (ms, Tbps). |
| `text-big-number-unit-md` | `1.25rem` | sm: 1.5rem, md: 2.25rem | The unit after a text-big-number-md figure, in the text face so its case is kept (ms, Tbps). |
| `text-big-number-unit-sm` | `1rem` | sm: 1.25rem | The unit after a text-big-number-sm figure, in the text face so its case is kept (ms, Tbps). |
| `text-body-2xs` | `0.75rem` |  | The smallest body text, such as footnotes. |
| `text-body-code-lg` | `1rem` |  | Wrapping or multi-line code at the 16px touch size, with a real line height. |
| `text-body-code-sm` | `0.75rem` |  | A monospace paragraph that wraps. |
| `text-body-lg` | `1rem` | md: 1.125rem | Lead paragraphs. |
| `text-body-md` | `1rem` |  | Body copy. |
| `text-body-prose-md` | `1rem` |  | Long-form prose at a relaxed line height. |
| `text-body-sm` | `0.875rem` |  | Secondary body copy and descriptions. |
| `text-body-xs` | `0.75rem` |  | Captions and helper text. |
| `text-button-lg` | `0.875rem` |  | The label of a large button. |
| `text-button-md` | `0.75rem` |  | The label of a medium or small button. |
| `text-heading-2xl` | `1.875rem` | sm: 2.25rem, md: 3rem -0.053em 0 | A marketing section heading. |
| `text-heading-2xs` | `0.875rem` |  | A small title or a wordmark written in type, a flat 14px. |
| `text-heading-3xl` | `1.875rem` | sm: 3rem, md: 3.5rem -0.046em 0 | The largest page heading, for a marketing hero. |
| `text-heading-lg` | `1.125rem` | md: 1.875rem | A large section heading. |
| `text-heading-md` | `1rem` | sm: 1.25rem, md: 1.5rem | A section heading. |
| `text-heading-sm` | `0.875rem` | sm: 1rem, md: 1.125rem | A subsection or dialog heading. |
| `text-heading-xl` | `1.25rem` | sm: 1.875rem, md: 2.25rem | A page title. |
| `text-heading-xs` | `1rem` |  | A card title, a flat 16px. |
| `text-label-code-lg` | `1rem` |  | A large monospace label. |
| `text-label-code-md` | `0.875rem` |  | A monospace label such as a file name bar. |
| `text-label-code-sm` | `0.75rem` |  | Monospace code lines and line numbers, one row per line. |
| `text-label-lg` | `1rem` |  | A large label of compact interface text. |
| `text-label-md` | `0.875rem` |  | Labels and compact interface text. |
| `text-label-sm` | `0.75rem` |  | Small labels and metadata. |
| `text-link` | `inherit` |  | An inline link inside body or heading copy; inherits the size. |
| `text-overline-md` | `0.75rem` | sm: 0.875rem | An uppercase overline above a heading. |
| `text-overline-sm` | `0.75rem` |  | A small uppercase overline or eyebrow. |
| `text-overline-xs` | `0.75rem` |  | The smallest uppercase overline. |
| `text-tag-md` | `0.75rem` |  | The label of a tag or badge. |
| `text-tag-sm` | `0.75rem` |  | The label of a small tag or badge. |
| `text-title-lg` | `0.875rem` | sm: 1rem, md: 1.125rem | The title of a dialog or drawer, medium weight. |
| `text-title-md` | `1rem` |  | The title of a side panel, medium weight, a flat 16px. |
| `text-title-sm` | `0.875rem` |  | The title of a popover, card, alert or toast, medium weight. |

## Related tokens

| Group | Count | Tokens |
| --- | --- | --- |
| font | 12 | `--font-code` · `--font-display` · `--font-sans` · `--font-weight-black` · `--font-weight-bold` · `--font-weight-extrabold` · `--font-weight-extralight` · `--font-weight-light` · `--font-weight-medium` · `--font-weight-normal` · `--font-weight-semibold` · `--font-weight-thin` |
| leading | 6 | `--leading-loose` · `--leading-none` · `--leading-normal` · `--leading-relaxed` · `--leading-snug` · `--leading-tight` |
| tracking | 6 | `--tracking-normal` · `--tracking-tight` · `--tracking-tighter` · `--tracking-wide` · `--tracking-wider` · `--tracking-widest` |
