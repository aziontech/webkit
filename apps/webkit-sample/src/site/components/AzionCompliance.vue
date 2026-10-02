<script setup>
  // Compliance — https://www.azion.com/pt-br/compliance/, rebuilt from the Figma file that
  // designs it: `Azion.com` (QEbHSTFDWfh4VHkBp6NWN3). The overall shape below matches node
  // 13106:309674; the badge row's own count, asset set, and desktop arrangement were updated
  // again to match node 13113:6593 (five badges → seven) and then node 13113:6655 (one row of
  // seven → a 4×2 grid) — see "WHAT THIS REVISION CHANGES" below — pulled through the same
  // `figma-design-to-code` MCP flow. Figma is the spec for BOTH halves here — the copy and the
  // shape — read from the design's own generated markup, not eyeballed from a screenshot. Every
  // class below is our own token vocabulary; none of the design's raw pixel values or its
  // React/Tailwind markup came across — see CONTAINERS.md.
  //
  // ── THE SHAPE ──────────────────────────────────────────────────────────────────
  //
  //   hero              h1 + description + one button ("Contato", `kind="secondary"`, no icon)
  //   intro             a `SectionTitle` (`kind="left"`): eyebrow, h2, description, one button
  //   (no gap — the badge row sits flush against the intro, immediately in every arrangement)
  //   badge row         7 trust badges: image + a check-and-label pill (see below) — stacked
  //                     under the intro at mobile AND desktop widths, but a narrow column
  //                     BESIDE the intro in between (node 13113:7237, "tablet") — see the
  //                     `flex-col lg:flex-row xl:flex-col` wrapper around both
  //   spacer            medium
  //   "Regulamentações para proteção de dados" — a title cell beside a paragraph+links cell
  //   spacer            (closing, borderless — see below)
  //
  //   `SectionTitle` already IS a framed, flush-top, own-bottom band (see its own source), so
  //   the intro is a bare `<SectionTitle>` call. The badge row and the regulamentações section
  //   are each ONE outer `FrameBox` (flush against whatever sits above it) wrapping a hand-built
  //   grid with an internal `border-r`/`border-t` divider — the same shape this file already
  //   used for the certifications pair in the previous revision — rather than the design's own
  //   markup, which repeats a full 4-corner-marked `LayoutContainer` per cell/column. Two
  //   independently-framed siblings sitting edge to edge would double the rule between them;
  //   one frame with an internal divider does not. `SectionTitle` cannot be reused for the
  //   regulamentações title cell for the same reason — its `flush` is fixed to `top` and cannot
  //   also flush the shared right edge against its sibling cell, so that title is hand-built
  //   from `Overline` + `h2`, mirroring `SectionTitle`'s own `kind="left"` markup.
  //
  // ── WHAT THIS REVISION CHANGES FROM THE PREVIOUS ONE ──
  //
  //   • THE CERTIFICATIONS ARE NOW A FLAT TRUST-BADGE ROW, not two descriptive cards. The
  //     design drops the SOC/PCI paragraphs and their "Ler documentação" links entirely — each
  //     cell is now just a badge image and a certification pill. Five cells, not two: SOC 2
  //     Type 2 and SOC 3 Type 2 (sharing one badge image, same as the design's own `imgSlot`
  //     reuse), PCI DSS, LGPD, GDPR — all five badges are this site's own already-registered
  //     marks (`soc.svg`, `pci-dss.svg`, `lgpd.svg`, `gdpr.svg`, the same files
  //     AzionFinancialServices.vue's certifications band uses), not the design's own PNG/SVG
  //     exports.
  //   • THE PILL IS HAND-BUILT, NOT `Tag`. Its own component ("Badge Certification") pairs a
  //     small `pi-check` glyph inside its own filled circle (circle `bg-(--success-contrast)`,
  //     glyph `text-(--success)` — confirmed by downloading the design's exported check icon
  //     and reading its literal fill, `#0A2916`, which is this theme's `--success`) with a
  //     label set in `text-overline-xs` (uppercase, tracking-widest, the display/mono family —
  //     one utility already carries all three, see `texts.data.js`), inside a pill with its own
  //     1px border. `Tag`'s own template can't produce an icon-in-a-circle or overline-styled
  //     text, so this is composed directly rather than forced through `Tag`'s props.
  //
  //     THE OUTER BORDER IS THE DESIGN'S OWN "Border Gradient" STYLE, not a flat colour —
  //     `get_design_context` flattens it to `border-white` (a paint type it can't express as
  //     Tailwind), and `get_variable_defs` returns the style's name with no resolvable value,
  //     so neither read tool exposes its literal stops. Downloading the rendered badge and
  //     sampling its border pixels directly (against the pill's own `--bg-surface-raised` fill)
  //     put its brightness at roughly 1–10% white, brightest near the top-left corner — evidence
  //     enough for a subtle light gradient, not enough to fix an exact multi-stop definition.
  //     Reproduced as a two-layer `background` (a `padding-box` fill plus a `border-box`
  //     gradient, `135deg` from ~14% to ~3% white) rather than `border-image`, which the design
  //     also can't use here: `border-image` ignores `border-radius` entirely, and this pill is
  //     `rounded-full`.
  //   • THE BADGE LABELS ARE VERBATIM ENGLISH ("SOC 2 Type 2", not "SOC 2 Tipo 2"), even
  //     inside this otherwise-Portuguese page — that is what the design itself sets. See
  //     data/compliance.js.
  //   • THE ROW GREW FROM FIVE BADGES TO SEVEN (node 13113:6593): CCPA and CPRA — California's
  //     Consumer Privacy Act and Privacy Rights Act — joined SOC 2/3, PCI, LGPD and GDPR. Neither
  //     mark existed in the shared brand registry yet, so both were downloaded from this node's
  //     own Figma assets and added there (`ccpa.svg`, `cpra.svg`) alongside the other
  //     four. See data/compliance.js for the label/asset pairing and the CPRA text-casing note.
  //     Seven columns leave each cell narrower than five did, and the two longest labels ("SOC 2
  //     Type 2", "SOC 3 Type 2") wrapped onto a second line at that width, stretching the pill
  //     past its fixed `h-6` — the design's own badge text is `whitespace-nowrap` (confirmed in
  //     its generated markup), so the pill's label carries that here too.
  //   • THE DESKTOP ROW BECAME A 4×2 GRID (node 13113:6655), superseding the one-row-of-seven
  //     layout two revisions back — SOC 2/3, PCI, LGPD on top; GDPR, CCPA, CPRA on the bottom.
  //     The design's own version of this grid leaves the bottom row's fourth slot as a blank,
  //     border-only cell; at the user's request that cell was dropped and the three bottom
  //     badges stretch to fill the full width instead (a 12-column grid, 4×`col-span-3` on top
  //     and 3×`col-span-4` on the bottom — see the comment at the grid markup). Mobile and
  //     tablet are unaffected — both still stack the seven badges in one column; only the `xl`
  //     divider math and column count changed.
  //   • THE PRIVACY CARD'S OWN ICON AND TITLE ARE GONE. What was a titled card ("Privacidade de
  //     dados" as an `h3`, a `pi-shield` glyph) is now the section's own eyebrow — "Privacidade
  //     de dados" labels "Regulamentações para proteção de dados", the section's real title.
  //     No badge/icon renders here at all now.
  //   • THE PRIVACY LINKS DROPPED THEIR "FAQ sobre" PREFIX, show a `pi-external-link` icon on
  //     every row, and are no longer built from the `Link` component — see the "NOT `Link`"
  //     comment at that markup for why.
  //   • THE EMPTY 505PX PLACEHOLDER BAND BELOW THE LINKS IS GONE from the design as of this
  //     pull — it no longer appears at all, so there is nothing left to omit or flag here.
  //   • THE HERO, THE INTRO, AND THE "NO CLOSING CTA" / "sidebar rail not rendered" CALLS FROM
  //     THE PREVIOUS REVISION ALL STILL HOLD — the design keeps them unchanged. See git history
  //     on this file for that reasoning if needed.
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Button from '@aziontech/webkit/button'
  import Hero from '@aziontech/webkit/hero'
  import SectionContainer from '@aziontech/webkit/section-container'

  import { COMPLIANCE_CERTIFICATIONS, COMPLIANCE_PRIVACY_LINKS } from '../data/compliance.js'
</script>

<template>
  <!-- ══ The hero ═══════════════════════════════════════════════════════════════
       Hero owns the full-bleed band and the page's top rule. `--banner-offset` is
       the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it. -->
  <Hero
    texture="dots"
    texture-fade="bottom"
    kind="screen"
    align="center"
    max-width="site"
    class="[--banner-offset:3.5rem]"
  >
    <!-- The page's one h1, verbatim. No eyebrow — the design draws none for this band. -->
    <HeroTitle
      centered
      title="Certificações e conformidade da Azion"
      description="A Azion adere a rigorosos padrões de segurança, disponibilidade e privacidade para que os clientes possam adotar nossos serviços com confiança."
    >
      <template #actions>
        <Button
          label="Contato"
          kind="secondary"
          size="large"
          href="https://www.azion.com/pt-br/contato/"
        />
      </template>
    </HeroTitle>
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════ -->
  <SectionContainer max-width="site">
    <!-- The intro + the certifications share one row at tablet width (node 13113:7237): the
         intro on the left, the five badges stacked in a narrow column on the right, divided by
         one vertical rule. Below that (mobile, node 13109:6206) and above it (desktop, node
         13106:309674) they go back to stacking — the wrapper below is `flex-col` at both ends
         and only switches to `flex-row` in between; it is a no-op at mobile/desktop, where it
         just stacks two full-width blocks exactly as if they were plain siblings.

         `lg`/`xl` stand in for "tablet"/"desktop" here, NOT `md`/`lg` — this file has no
         bespoke breakpoint names, and the row can only start where the intro side is guaranteed
         enough room. `SectionTitle`'s own actions row switches its button from full-width to
         shrink-to-content at `sm` (640px, see its source); `Button` itself is
         `whitespace-nowrap`, so it never wraps — only ever gets wider or narrower by how much
         room it's given. This mattered when the button's label was the much longer "Consultar
         Modelo de Responsabilidade Compartilhada": starting the row at `md`/`lg` (as this
         section originally shipped) put the narrow end of that range at 768px, well below the
         ~590px that label needed once the fixed 338px cert column and this side's own padding
         are subtracted — the button overflowed its column there. `lg`/`xl` moves the narrow end
         to 1024px, clearing it. The label is now the shorter "Ver Matriz de Responsabilidade",
         which fits with room to spare at either range — the `lg`/`xl` move is kept regardless,
         since it is still correct and nothing calls for reverting it. -->
    <div class="flex flex-col lg:flex-row xl:flex-col">
      <!-- `SectionTitle` is already a framed, flush-top band on its own (see its source) —
           its `flush` lands directly on the hero's `border-b`, so nothing else needs to sit
           between them. It never draws its own left/right edges (its own `FrameBox` call is
           `borders="y"`, top/bottom only), so the vertical rule at tablet width is this
           wrapper's own `border-r`, not something `SectionTitle` could draw itself. -->
      <div class="lg:flex-1 lg:border-r lg:border-(--border-default) xl:border-r-0">
        <SectionTitle
          kind="left"
          eyebrow="Expertise em conformidade"
          title="Estamos comprometidos em garantir que nossos clientes e parceiros globais possam atender a diversos requisitos de conformidade"
          description="Segurança e Conformidade são responsabilidades compartilhadas entre a Azion e o cliente. Esse modelo compartilhado pode ajudar a aliviar o fardo operacional do cliente, pois a Azion opera, gerencia e controla os componentes desde o sistema operacional e camada de virtualização, incluindo atualizações e patches de segurança, até a segurança física das instalações onde o serviço opera."
        >
          <template #actions>
            <Button
              label="Ver Matriz de Responsabilidade"
              kind="secondary"
              size="large"
              href="https://www.azion.com/pt-br/documentacao/responsabilidade-compartilhada/"
            />
          </template>
        </SectionTitle>
      </div>

      <!-- ── The certifications ─────────────────────────────────────────────────
           No gap here — the design sets this directly against the intro's own bottom rule
           (stacked) or beside it (tablet), so `flush` lands there with nothing in between.

           DESKTOP: SOC 2/3, PCI, LGPD across the top; GDPR, CCPA, CPRA across the bottom — but
           unlike the design's own 4×2 grid (node 13113:6655), which leaves the bottom row's
           fourth slot as a blank cell, the three bottom badges stretch to fill the full width
           instead (a deliberate departure from the Figma reference, at the user's request — no
           leftover blank cell). A plain `grid-cols-4` can't give one row 4 equal columns and
           the other row 3 *different-width* ones — every row shares the same column tracks — so
           this is a 12-column grid instead (12 = lcm(4, 3)): the top row's four cells each span
           3 of those columns (`xl:col-span-3`), the bottom row's three cells each span 4
           (`xl:col-span-4`), and both rows fill all 12 with nothing left over.

           Divider math, per cell index (0-based): every cell but the first draws a `border-t`
           — that's the whole story at mobile/tablet, where everything stacks in one column. At
           `xl`, a cell also draws `border-l` unless it opens its own row (`index % 4 === 0`,
           still true for the bottom row's own first cell even though that row has only 3 cells
           — the grid auto-wraps there because the top row's four `col-span-3` cells already
           fill all 12 columns), and the FIRST row's own `border-t` is cancelled
           (`xl:border-t-0`) since that edge already belongs to the frame's own top rule, not an
           interior divider — the second row's `border-t` is deliberately left standing to draw
           the one rule between the two rows. -->
      <div class="lg:h-full lg:w-[338px] lg:shrink-0 xl:w-full">
        <FrameBox
          flush
          borders="y"
          marks="bottom"
          class="lg:h-full"
        >
          <div class="grid grid-cols-1 xl:grid-cols-12">
            <div
              v-for="(cert, index) in COMPLIANCE_CERTIFICATIONS"
              :key="cert.label"
              :class="[
                'flex flex-col items-center justify-center gap-(--spacing-lg) p-(--spacing-xl)',
                index > 0 && 'border-(--border-default) border-t',
                index > 0 && index < 4 && 'xl:border-t-0',
                index % 4 !== 0 && 'xl:border-l',
                index < 4 ? 'xl:col-span-3' : 'xl:col-span-4'
              ]"
            >
              <img
                :src="cert.badge"
                :alt="cert.alt"
                class="size-20 object-contain"
              />
              <span
                class="inline-flex h-6 shrink-0 items-center gap-(--spacing-xs) rounded-full border border-solid border-transparent py-[3px] pl-(--spacing-xxs) pr-(--spacing-xs) [background:linear-gradient(var(--bg-surface-raised),var(--bg-surface-raised))_padding-box,linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))_border-box]"
              >
                <span
                  class="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-(--success-contrast) p-[3px]"
                >
                  <i
                    class="pi pi-check text-[10px] text-(--success)"
                    aria-hidden="true"
                  />
                </span>
                <span class="whitespace-nowrap text-overline-xs text-(--text-default)">{{
                  cert.label
                }}</span>
              </span>
            </div>
          </div>
        </FrameBox>
      </div>
    </div>

    <SectionGap hatch />

    <!-- ── Regulamentações para proteção de dados ───────────────────────────────
         One frame: the title cell (hand-built — `SectionTitle` can't flush its own right
         edge) beside the paragraph+links cell, divided by the title cell's own `border-r`. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="grid sm:grid-cols-2">
        <div
          class="flex flex-col gap-(--spacing-lg) border-(--border-default) p-(--spacing-xxl) sm:border-r"
        >
          <Overline
            prefix="//"
            show-cursor
          >
            Privacidade de dados
          </Overline>
          <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">
            Regulamentações para proteção de dados
          </h2>
        </div>

        <div class="flex flex-col">
          <p
            class="m-0 border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-xxl) text-pretty text-body-md text-(--text-muted)"
          >
            A Azion entende que a privacidade dos dados de nossos clientes e usuários finais é
            fundamental. Temos compromisso com a proteção de dados e nossos controles se baseiam em
            práticas robustas, alinhados às principais legislações internacionais, como a Lei Geral
            de Proteção de Dados (LGPD) e o Regulamento Geral de Proteção de Dados da União Europeia
            (GDPR). Não comercializamos dados pessoais e os utilizamos exclusivamente para a
            execução dos nossos serviços. Oferecemos aos usuários dos nossos produtos a capacidade
            de acessar, corrigir e excluir suas informações pessoais, aderindo ao princípio de que
            nossos clientes e usuários finais devem ter controle total sobre os dados de sua
            propriedade que transitam pela nossa rede. Convidamos você a explorar nossas Perguntas
            Frequentes sobre Privacidade de Dados ou consultar nossa política de privacidade
            detalhada.
          </p>
          <!-- The design now frames this list on its own (a second `LayoutContainer`, node
               13107:9004, full corner marks) rather than as a plain stack under the paragraph.
               A nested `FrameBox` here would have to flush every edge it shares — the
               paragraph's own `border-b` above, and the outer frame's own bottom rule below —
               leaving nothing of its own left to draw; it would add a component instance with
               no visible effect. What the update actually changes is each row's own rhythm
               (`pl-xl pr-lg py-md`, asymmetric — not the shared `p-md` wrapper this had
               before), so that moved here instead.

               NOT `Link`. The design's own row (node 13107:9004 → "Item") is a plain label
               plus a trailing icon, the label at `flex-1` so the icon lands at the row's own
               right edge — the gap between them is however much space is left, not a fixed
               `gap-*` step. `Link`'s content is one `inline-flex` unit with a fixed
               `gap-(--spacing-xs)`; it cannot push the icon to the far edge like that no matter
               what's added around it (a flex parent has only one participating child to
               distribute space against). Hand-built directly instead: a real `<a>`, `text-(--
               text-default)` per the design, `flex-1` on the label is what gives the "auto"
               gap. Every row but the last carries its own `border-b` to divide it from the one
               below — the last one skips it, since that edge already belongs to the outer
               frame's own bottom rule (`marks="bottom"` below); drawing it twice would double
               that hairline. -->
          <div class="flex flex-col">
            <a
              v-for="(link, index) in COMPLIANCE_PRIVACY_LINKS"
              :key="link.href"
              :href="link.href"
              :class="[
                'flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) py-(--spacing-md) pl-(--spacing-xl) pr-(--spacing-lg) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none',
                index < COMPLIANCE_PRIVACY_LINKS.length - 1 && 'border-b border-(--border-default)'
              ]"
            >
              <span class="flex-1 text-heading-xxs">{{ link.label }}</span>
              <i
                class="pi pi-external-link size-4 shrink-0"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </FrameBox>

    <!-- The closing spacer, borderless: the footer below opens with its own full-bleed rule,
         and a bordered spacer here would land a second hairline on that pixel (see every
         other landing page's own closing spacer, e.g. AzionTechnology.vue). -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
