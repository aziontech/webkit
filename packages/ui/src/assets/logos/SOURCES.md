# Brand mark sources

Where each third-party mark in WebKit comes from, under which terms it ships, and the marks we
asked for but did not add. One row per file. A new third-party mark lands with its row here: the
source URL, the licence or usage line quoted from the owner, and the date it was fetched.

Files are taken as published. The only changes allowed are SVG optimization and, for a
monochrome glyph in `@aziontech/icons`, `fill="currentColor"`.

## Shipped

### Datadog — `frameworks/datadog-symbol-color.svg`

- **Source:** Datadog press kit, https://www.datadoghq.com/about/resources/ →
  https://corp.dd-static.net/zip/Logo_Assets.zip, file
  `Logo Assets/DD Vector Logos/Icon/SVG/dd_icon_rgb.svg`.
- **Fetched:** 2026-11-12. The file in this folder is byte-identical to the press-kit file.
- **Terms (datadoghq.com/about/resources):** "Please don't invert the colors of the logo or modify
  the logo in the other ways outlined below." … "Don't modify color of logo" … "Don't contain logo
  in a box" … "Don't outline logo". The page publishes the files with no permission requirement.
- **Use:** the purple file as is, on light backgrounds. Do not recolour it. This is why Datadog is
  **not** in the `Marquee` brand-mark registry (`src/assets/brands/registry.ts`): those marks are
  drawn in `currentColor`, which recolours them.

### Nitro — `@aziontech/icons`, `packages/icons/src/svg-raw/ai/az-nitro.svg` (`az az-nitro`)

- **Source:** the Nitro repository's own icon,
  https://raw.githubusercontent.com/nitrojs/nitro/main/docs/.docs/public/icon.svg (last changed in
  commit `f62ba45fa5421d597c6a9c50b8735f8f1a9bb0e1`). Nitro is not in Simple Icons and publishes
  no brand kit or trademark policy.
- **Fetched:** 2026-11-12.
- **Licence:** MIT, https://github.com/nitrojs/nitro/blob/main/LICENSE — "Copyright (c) Pooya
  Parsa <pooya@pi0.io> and Nitro contributors. Permission is hereby granted, free of charge, to
  any person obtaining a copy of this software … to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software … The above copyright notice and
  this permission notice shall be included in all copies or substantial portions of the
  Software." The notice ships in the `@aziontech/icons` README.
- **Changes:** the glyph is the source's mark path, coordinates unchanged, filled with
  `currentColor`. The source's gradient, its blurred glow layer (a mask and a filter) and the
  clip rectangle are dropped, because a font glyph holds one solid colour. The circle and the
  bolt wind in opposite directions, so the bolt stays a hole under the font's nonzero fill.
- **Not used:** the copy on unjs.io — that site is "licensed under CC BY-NC-SA 4.0", which bars
  commercial use.

### Stencil — `@aziontech/icons`, `packages/icons/src/svg-raw/ai/az-stencil.svg` (`az az-stencil`)

- **Source:** Simple Icons `stencil`,
  https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/stencil.svg (24×24),
  whose recorded source is Ionic's own Ionicons, https://ionic.io/ionicons. The path is the
  Ionicons `logo-stencil.svg`
  (https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/logo-stencil.svg, 512×512)
  scaled by 3/64. Ionic owns Stencil.
- **Fetched:** 2026-11-12.
- **Licence:** Ionicons, https://github.com/ionic-team/ionicons — "Use them wherever you see fit,
  personal or commercial. They are free to use and licensed under MIT." (LICENSE: "Copyright (c)
  2015-present Ionic (http://ionic.io/)"); "All brand icons are trademarks of their respective
  owners. The use of these trademarks does not indicate endorsement of the trademark holder by
  Ionic, nor vice versa." Simple Icons
  (https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md): "Simple Icons is
  released under CC0 - though that doesn't mean to imply that all icons within the project are
  also CC0."
- **Changes:** `fill="currentColor"` only.

## Not added

Each needs the owner's permission or a licence WebKit does not have, or has no official source.
Checked on 2026-11-12.

| Mark                                | Why not                                                                                                                                                                        | Owner's terms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Datadog (monochrome `Marquee` mark) | The brand-mark registry draws in `currentColor`; Datadog forbids recolouring.                                                                                                  | "Don't modify color of logo" — https://www.datadoghq.com/about/resources/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Splunk                              | Logo use needs partner status or written consent.                                                                                                                              | "Use of our logos are not allowed unless you are a Splunk partner or you have obtained prior written consent from Splunk Legal." — https://www.splunk.com/en_us/legal/trademark-usage-guidelines.html                                                                                                                                                                                                                                                                                                                                                                                            |
| Google BigQuery                     | The public icon library grants use for diagrams and documentation only; the brand rules are behind the partner sign-in.                                                        | "Here you can find the Google Cloud product icons you need for your diagrams, technical documentation, and more." — https://cloud.google.com/icons; "If your business has an official co-branding relationship with Google, sign in to Partner Marketing Hub" — https://partnermarketinghub.withgoogle.com/brands/google/overview/                                                                                                                                                                                                                                                               |
| Amazon S3                           | Not in Simple Icons. AWS allows its service icons for architecture diagrams and its marks in plain text only.                                                                  | "We allow customers and partners to use these toolkits and assets to create architecture diagrams." — https://aws.amazon.com/architecture/icons/; "Any such use should be in plain text only (no logos)" — https://aws.amazon.com/trademark-guidelines/                                                                                                                                                                                                                                                                                                                                          |
| Amazon Kinesis                      | Same as Amazon S3.                                                                                                                                                             | Same as Amazon S3.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Zoop                                | No press kit and no published usage terms; the brand book PDF (https://www.zoop.com.br/Zoop-BrandBook.pdf) carries none in text. Needs Zoop's consent (marketing@zoop.com.br). | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| G2 Leader / High Performer badges   | Only the awardee may republish an earned badge, on its own website, with a backlink; redistributing badge files is not licensed.                                               | "If Client has earned a G2 Badge, Client may republish the badge on Client's website, provided that such republication contains a backlink to the G2 page for Client's applicable product or service." "Except as expressly permitted herein, G2 grants no license or right to Client to republish, share, duplicate, abridge or otherwise modify any G2 Content." — https://legal.g2.com/g2-profile-free-service-description; businesses must not "Republish, in whole or in part, any G2 Badge (except 'Users Love Us' badges) without a license." — https://legal.g2.com/community-guidelines |
| Rust                                | The logo is CC-BY, but trademark use in commercial material needs permission (trademark@rust-lang.org).                                                                        | "Most non-commercial uses of the Rust/Cargo names and logos are allowed and do not require permission; most commercial uses require permission." — https://github.com/rust-lang/rust-artwork/blob/master/logo/README.md                                                                                                                                                                                                                                                                                                                                                                          |

## Text wordmarks

Owner decision of 2026-11-17: until a brand above grants its logo, WebKit names it in plain text.
Each is an entry of `brandWordmarks` in `src/assets/brands/registry.ts`, offered under the same
names as the marks with artwork (`Marquee` `marks`, `QuoteTabs` `mark`, the catalog's brand-mark
list, where it carries `wordmark: true`). A wordmark is the brand's name set in WebKit's own font,
type scale and text colour (`text-heading-2xs`, `var(--text-default)` in `Marquee`): it copies
none of the brand's typeface, colours or shapes, so it ships no artwork and needs no licence. The
name is used only to refer to the product, as each owner's terms allow.

**Status: pending permission.** When an owner grants its logo, the file joins its registry with a
row under Shipped and the name leaves `brandWordmarks`; call sites do not change.

| Name                | Label             | Why text                                                     |
| ------------------- | ----------------- | ------------------------------------------------------------ |
| `splunk`            | Splunk            | Logo use needs partner status or written consent.            |
| `bigquery`          | Google BigQuery   | Icons are licensed for diagrams and documentation only.      |
| `amazon-s3`         | Amazon S3         | AWS allows its marks in plain text only.                     |
| `amazon-kinesis`    | Amazon Kinesis    | Same as Amazon S3.                                           |
| `zoop`              | Zoop              | No published terms as an integration mark; needs consent.    |
| `g2-leader`         | G2 Leader         | Only the awardee may republish a badge, on its own website.  |
| `g2-high-performer` | G2 High Performer | Same as G2 Leader.                                           |
| `rust`              | Rust              | Commercial use of the logo needs permission.                 |
| `datadog`           | Datadog           | One-ink rows recolour the mark; Datadog forbids recolouring. |

The colour Datadog file under Shipped is unchanged, and so is the Zoop client logo on
azion.com customer pages (`clients/zoop-extended-color.svg`); the wordmarks cover only the places
those files cannot go.
