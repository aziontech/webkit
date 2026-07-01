# Planejamento: Cobertura de testes funcionais do webkit

> Artefato de planejamento (rascunho pra revisão). A versão canônica fica em
> `~/.claude/plans/twinkly-moseying-zebra.md`. Docs que forem pro repo webkit
> (`testing.md`, `TESTING_STRATEGY.md`) permanecem **em inglês** (regra do projeto).

## Status atual da execução (Fase 0 em andamento)

- [x] `packages/webkit/vitest.config.ts` — Vitest **browser mode** (Playwright Chromium), alias `@aziontech/webkit` + `@stories`.
- [x] `packages/webkit/src/test/setup.ts` — importa `@aziontech/theme/globals.css` (DOM **estilizado** → axe confiável) + cleanup.
- [x] `packages/webkit/package.json` — deps (`vitest`, `@vitest/browser`, `@testing-library/vue`, `@storybook/vue3`, `axe-core`, `playwright`, `@vitejs/plugin-vue`), scripts `test`/`test:watch`, e `files` com negação (`!src/**/*.test.{ts,js}`, `!src/test/**`) pra **não vazar teste no publish**.
- [x] root `package.json` — `webkit:test` / `webkit:test:watch`.
- [x] `eslint.config.js` — globals de DOM pros testes.
- [x] `pnpm install` (40 pacotes) + `playwright install chromium` (binário baixado).
- [ ] `packages/webkit/src/test/axe.ts` — helper `expectNoA11yViolations`.
- [ ] `.github/workflows/test.yml` — job com **sharding por categoria + retry**.
- [ ] smoke test provando que o browser-mode roda + `pack:dry` sem arquivo de teste.

> ⚠️ **Achado**: o filtro `pnpm --filter webkit` **não casa** nada no pnpm 11 (o nome do pacote é `@aziontech/webkit.dev`) — os scripts `webkit:*` existentes dependem desse filtro quebrado. Vou usar `-C packages/webkit` / `--filter @aziontech/webkit.dev` pra garantir que rode. (Vale corrigir os scripts existentes num PR à parte.)
>
> ⚠️ **Branch**: estamos na `dev` (tree limpa). O Calendar rico (sub-componentes + `format.ts`/`parse-period.ts`) está só na `feat/ENG-46317-calendar`, **não na dev** — por isso os exemplares da Fase 1 foram adaptados pra componentes que existem na dev (Dialog, navigation-menu, Select). O Calendar ganha testes quando a branch dele mergear.

---

## Sobre a PR #704 (sugestão de outro autor — NÃO é a fonte da verdade)

Estudei a fundo. A **ideia central é boa e adotamos**; o resto avaliamos e corrigimos.

### O que NÃO está bom na #704 (não copiar como está)

1. **Testes vazam no publish** — `*.test.ts` em `src/` + `files: ["src"]` inalterado → vão no tarball do npm.
2. **Import de story com caminho relativo de 6 níveis** (`../../../../../../apps/storybook/...`) — frágil, acopla ao layout do storybook.
3. **a11y em DOM sem estilo** — `setup.ts` não carrega CSS de tema → `color-contrast` do axe não-confiável (falso negativo).
4. **Módulos de lógica pura de fora** — a regra "todo teste importa `composeStories`" não cobre `format.ts`/`parse-period.ts` (sem story).
5. **"Monta sem erro" (`it.each` smoke) como substância** — teste bobo, passa sempre, não pega regressão. Só serve de piso.
6. **Só provou o Button — o caso trivial** — sem overlay, composição ou recursão. A estratégia não foi validada onde estressa.
7. **Sem pensar em escala/CI** — 157 componentes × Chromium num job só = lento e flaky; falta sharding/retry.
8. **Skew de versão** — vitest 2.1.9 na #704 vs 4.1 no icons-gallery.
9. **axe ≠ a11y de verdade** — axe pega violação estática, não a11y comportamental (foco, Tab, Escape). A a11y real está na Camada 2 (`play()`), que a #704 só exercitou no Button.

### O que aproveitar (a ideia boa)

- **Vitest browser mode (Chromium real) em vez de jsdom** — decisão acertada; elimina falsos positivos de foco/`Teleport`/layout.
- **Story como fixture única (`composeStories`)** — uma fonte pra doc + interaction + unit.
- **Hook de governança** + whitelist de legados + scaffold que emite `.test.ts`.
- **A régua anti-bobo já escrita**: sem assert em string de classe; apagar teste que só passa pra uma implementação; asserir role/ARIA/`data-`/foco, nunca estado interno; proibido mockar layout.

---

## Contexto

`packages/webkit` tem **157 componentes / 77 stories / 76 specs / zero testes**. A CI roda lint + type-check + storybook:build; os hooks provam que o `.vue` *declara* o que o spec promete, mas não que **funciona**. Objetivo: cobertura **funcional** da biblioteca — componentes, UX, eventos, recursão — **sem teste trivial, sem falso positivo.**

Camadas (versão corrigida da ideia da #704):
- **C1 Unit** — Vitest browser mode + `@testing-library/vue` + `composeStories`: props, eventos, slots, ARIA, `disabled`/`loading`. **+ módulos puros por import direto** (corrige #4).
- **C2 Integração** — `play()` nas stories (`userEvent`/`expect`), na CI via `Story.run()`: Escape fecha overlay, focus trap, Enter/Space, scroll lock. **A a11y de verdade mora aqui.**
- **C3 a11y estática** — `axe-core` no browser mode, **com CSS de tema carregado** (corrige #3); complemento, não "a camada de a11y".
- **C4 Governança** — hook + whitelist + scaffold.

---

## Plano de execução

### Fase 0 — Fundação endurecida (na `dev`, sem commit até você pedir)
Infra browser-mode já corrigindo as lacunas: `files` com negação (#1), `setup.ts` com CSS de tema (#3), alias de story no vitest (#2), versão reconciliada (#8), carve-out de módulo puro no `testing.md` (#4), régua "smoke é piso" (#5), `test.yml` com sharding + retry (#7).

### Fase 1 — Provar os exemplares DIFÍCEIS (asserts comportamentais, não smoke)
- **Dialog** (overlay) — abrir/fechar, **Escape**, **focus trap + restauração**, **scroll lock**, `Teleport`.
- **navigation-menu / breadcrumb** (recursivo) — aninhamento ≥2 níveis + propagação de contexto.
- **Select / Table** (composição) — provide/inject, eventos, `v-model`.
- **Calendar rico** — quando a branch `feat/ENG-46317-calendar` mergear (composição + popover + grid + `format`/`parse-period`).

### Fase 2 — Rollout funcional em waves (157 componentes)
Por categoria, paralelizável com agentes em worktree. Wave final ativa o hook + vira o axe pra hard-fail.

**Régua funcional por componente — o contrato "sem bobo":**
- **Obrigatório:** todo evento da tabela de Events dispara com payload certo na ação real; `disabled`/`loading`/`readonly` **suprimem** a ação; `v-model` faz round-trip; ARIA/`data-state` reflete estado; interativo ganha `play()` com teclado + foco.
- **Permitido mas insuficiente:** smoke `it.each(variants)` "monta sem erro" (piso).
- **Proibido (falso positivo):** assert em string de classe/Tailwind, pixel/animação, estado interno, mock de layout/posicionamento, ou assert que só passa pra uma implementação.

Ordem: actions(6) · content(8) · feedback(7) · inputs-simples(~18) · inputs-compostos(select, multi-select) · data(table, paginator) · layout(5) · navigation(breadcrumb, link, menu-item, tab-view, dropdown, navigation-menu) · overlay(dialog, drawer, panel, tooltip) · templates(4) · misc/utils(spinner, svg/*, `cn`/`use-controllable`, `use-focus-trap`/`use-placement`).

---

## Verificação
1. `pnpm -C packages/webkit test` → verde no Chromium headless.
2. `pnpm -C packages/webkit pack:dry` → **nenhum `*.test.ts` no tarball**.
3. axe passa contra DOM **estilizado** (contraste real).
4. `test.yml` verde em PR de webkit; job pula limpo em PR não-webkit.
5. Painel Interactions do Storybook com os `play()` verdes.

## Higiene de commit
Branches/PRs via `/create-branch` + `/open-pr`, base `dev` nunca `main`; **sem `Co-Authored-By` / "Generated with Claude"**; nunca `--no-verify`; commitar só quando você pedir. Docs/regras (`testing.md`, `TESTING_STRATEGY.md`, em inglês) em PR própria.
