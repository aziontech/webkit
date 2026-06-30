# Estratégia de testes para `packages/webkit`

> **Status:** em execução — Fase 0 sendo entregue em waves na PR [#703](https://github.com/aziontech/webkit/pull/703) (branch `docs/testing-strategy-proposal`).
> **Escopo:** apenas `packages/webkit`. `packages/theme` e `packages/icons` ficam de fora.
> **Histórico:** começou como proposta (draft) → aprovada → execução em waves. As decisões da seção 6 estão fixadas; as seções 9 (progresso) e 10 (benefícios por ferramenta) refletem o estado atual.

## 1. Contexto

Hoje `packages/webkit` tem **157 componentes**, **77 stories**, **76 specs** e **zero testes**. A CI roda apenas lint, type-check, type-coverage (95 %) e `storybook:build` ([`.github/workflows/governance.yml`](../../.github/workflows/governance.yml)). O hook `/component-verify` (skill [`validate-component`](../skills/validate-component/SKILL.md)) também não roda testes — só os mesmos comandos da CI. Chromatic (`@chromatic-com/storybook` 5.0.1) e `@storybook/addon-a11y` estão **instalados mas não fiados** em nenhum workflow.

A consequência: regressões de comportamento (props, eventos, foco, ARIA, ordem de teclado, animação) só são pegas em revisão visual ou em produção. Os hooks de spec-compliance ([`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)) garantem que `.vue` declara o que o `.specs/<name>.md` promete, mas não garantem que **funciona**.

O objetivo desta proposta é estabelecer uma estratégia de testes **em camadas, pragmática e progressiva** que:

1. reaproveite o que já existe (stories + Storybook 8 + Chromatic);
2. cubra os quatro eixos pedidos (unit, integração, visual regression, a11y) sem virar cerimônia;
3. integre na CI sem dobrar o tempo de pipeline.

## 2. Princípio diretor — **a story é o fixture**

Em vez de manter dois mundos (stories + tests separados), tratamos cada `*.stories.js` como o fixture canônico. Storybook 8 já roda essas stories como teste via **Portable Stories** (`composeStories`) — o mesmo arquivo serve para documentação, visual regression (Chromatic), interaction test (`play()`) e unit test (importado no Vitest). Isso elimina duplicação e torna a barra de entrada de cada componente:

> "tem story + tem `play()` para os fluxos críticos + tem `<name>.test.ts` com o smoke."

## 3. A estratégia em 4 camadas

### Camada 1 — Unit (Vitest + Portable Stories)

**Stack:**

- `vitest` + `@vitest/browser` (modo browser com Playwright provider — necessário porque os componentes dependem de CSS real, `getBoundingClientRect`, foco do DOM e CSS anchor positioning, e a [regra de dependências](../rules/dependencies.md) proíbe libs de positioning)
- `@vue/test-utils` (mount programático quando a story não basta)
- `@storybook/vue3-vite` (já instalado) + `@storybook/test` (já 8.6.15) para `composeStories`

**Convenção:**

- Arquivo de teste **colocado** ao lado do componente: `packages/webkit/src/components/<category>/<name>/<name>.test.ts`
- Importa stories do mesmo nome via `composeStories` — sem reescrever fixtures
- Testa: contrato de props (tipos), eventos disparados, valores default, slots renderizados, atributos `data-*` corretos, compound API (`Foo.Bar` resolve), import standalone (`<name>-root`) tree-shakeable
- **Não testa:** aparência (Chromatic faz), implementação interna (CSS pseudo-classes, ordem de classes Tailwind)

**Barra mínima por componente:**

```ts
import { composeStories } from '@storybook/vue3-vite'
import { render } from '@testing-library/vue'
import * as stories from '<path>/Button.stories'

const { Default, Disabled } = composeStories(stories)

it('renders default with kind=primary', () => {
  const { getByRole } = render(Default())
  expect(getByRole('button')).toHaveAttribute('data-kind', 'primary')
})

it('does not emit click when disabled', async () => {
  // ...
})
```

### Camada 2 — Integração / interação (`play()` no Storybook + Vitest browser)

**Stack:** mesma da Camada 1 — `play()` functions já são suportadas por `@storybook/test` (userEvent + expect embutidos) e rodam no Vitest browser via `composeStories`.

**Convenção:**

- Toda story de **fluxo interativo** (toggle, focus trap, keyboard navigation, compound state) ganha um `play()` que documenta o fluxo
- O `play()` vira teste de integração **automaticamente** quando rodamos a Camada 1 — sem novo runner, sem novo CI step
- Foco em: ordem de Tab, Escape fecha overlay, Enter/Space ativa, ARIA states (`aria-expanded`, `aria-selected`), foco trap em modais, scroll lock
- Stories com `play()` que já existem: `ScrollArea.stories.js`, `NavigationMenu.stories.js` — viram os primeiros casos de Camada 2

### Camada 3 — Visual regression (Chromatic, já instalado)

**Stack:** `@chromatic-com/storybook` 5.0.1 (já em `package.json` raiz)

**Convenção:**

- Wirar Chromatic em um workflow GitHub Actions separado (`.github/workflows/chromatic.yml`), disparado em PR e push para `dev`
- Sem snapshot local — Chromatic detecta diff visual contra a baseline da `dev`
- Aprovação visual = parte do code review (Chromatic comenta no PR)
- Cobertura natural: as 77 stories existentes viram baseline na primeira run. Componentes novos entram na baseline assim que a story é criada (já requerido pelo [`component-scaffold`](../skills/component-scaffold/SKILL.md))

### Camada 4 — Acessibilidade (axe-core via Vitest browser)

**Stack:**

- `@storybook/addon-a11y` (já instalado) — feedback visual no painel para o autor
- `axe-core` + `@axe-core/playwright` no Vitest browser — runtime obrigatório
- Recomendado: integrar dentro da Camada 1 com `expect.toHaveNoViolations()` por story (alternativa: `@storybook/test-runner` dedicado, mais lento)

**Convenção:**

- Cada `composeStories` rodada na Camada 1 também roda `axe` na árvore renderizada
- Regras desabilitadas precisam de **justificativa explícita** na story (`parameters.a11y.config.rules`) — alinha com o padrão já visto em `Button.stories.js`

## 4. Onde a estratégia toca o repo

Edits previstos (alto nível, **não** parte deste PR — entram na PR da Fase 0):

| Caminho | Mudança |
|---|---|
| `packages/webkit/package.json` | Adicionar `vitest`, `@vitest/browser`, `@vue/test-utils`, `@testing-library/vue`, `@axe-core/playwright`, `playwright` em `devDependencies`; scripts `test`, `test:watch`, `test:a11y` |
| `packages/webkit/vitest.config.ts` *(novo)* | Config Vitest com browser provider Playwright; alias `@aziontech/webkit/*` apontando para `src/`; setup file |
| `packages/webkit/src/test/setup.ts` *(novo)* | Matchers globais (`toHaveNoViolations`), registro de componentes raiz, eventuais polyfills |
| `packages/webkit/src/components/**/<name>.test.ts` *(novos, incrementais)* | Um por componente — não 157 de uma vez, ver Rollout |
| `apps/storybook/.storybook/preview.js` | `parameters.a11y` default sem desabilitar regras; habilitar addon globalmente |
| `.github/workflows/test.yml` *(novo)* | Job paralelo ao `governance.yml`; roda `pnpm webkit:test` em PRs |
| `.github/workflows/chromatic.yml` *(novo)* | Job dedicado para visual regression |
| `.claude/skills/validate-component/SKILL.md` | Adicionar `pnpm webkit:test --filter <name>` no `/component-verify` |
| `.claude/skills/component-scaffold/SKILL.md` | Gerar `<name>.test.ts` mínimo (smoke + `composeStories(Default)`) junto com `.vue` + story |
| `.claude/rules/testing.md` *(novo)* | "toda story interativa tem `play()`; todo componente novo tem `<name>.test.ts` com pelo menos smoke + a11y" |
| `CONTRIBUTING.md` | Seção curta apontando para `testing.md` |

Arquivos de **referência** (consulta apenas):

- [`apps/icons-gallery/tests/unit/iconDownload.spec.js`](../../apps/icons-gallery/tests/unit/iconDownload.spec.js) — único exemplo de Vitest no monorepo hoje; serve de inspiração mas é jsdom puro (não suficiente para webkit)

## 5. Rollout (não fazer tudo de uma vez)

| Fase | Escopo | Critério de saída |
|---|---|---|
| **0 — Infra** | Vitest + browser mode + setup + 1 componente piloto (Button — já tem `parameters.a11y` declarado) | `pnpm webkit:test` verde local + CI; doc em `testing.md` |
| **1 — Componentes novos** | Toda spec nova entra com `<name>.test.ts` (smoke + a11y). Novo hook irmão de `enforce-spec-exists.mjs` | 100 % dos componentes criados pós-merge têm teste |
| **2 — Backfill prioritário** | Top 20 componentes mais usados (Button, Input, Modal, Table, Dropdown — calibrar com uso real) | Cobertura mínima desses 20 + Chromatic wired |
| **3 — Backfill restante** | Os outros 137 componentes, em PRs de ~5 | Eventual 100 % de smoke + Chromatic |
| **4 — A11y bar** | Habilitar `expect.toHaveNoViolations()` como **erro** (não warning) | CI quebra em violação axe |

Cada fase é **mergível e revertível**. Fase 0 é a única que precisa de aprovação cuidadosa — fixa as escolhas de stack.

## 6. Decisões fixadas

1. **Vitest browser mode (Playwright provider) — fixada.** Sem ele, componentes com `getBoundingClientRect`, foco, CSS anchor positioning e `<Teleport>` precisam de mocks frágeis. Custo aceito: ~30 s a mais por job CI e dependência do Playwright instalado.
2. **Test ao lado do `.vue` — fixada.** Segue o padrão de specs (um por componente) e facilita o `component-scaffold` emitir tudo junto.
3. **Chromatic em workflow próprio — fixada.** Chromatic tem cota mensal e budget de tempo independente; manter isolado evita travar PRs urgentes se a cota estourar.
4. **a11y bloqueante só na Fase 4 — fixada.** Warning até a Fase 3, falha bloqueante na Fase 4. Evita travar o backfill em violações pré-existentes.

## 7. Verificação da Fase 0 (quando for executada)

```bash
# instalação
pnpm install

# rodar testes locais
pnpm webkit:test          # roda Vitest no piloto (Button)
pnpm webkit:test:a11y     # roda axe via Playwright nas stories do piloto

# storybook + chromatic
pnpm storybook:dev        # confirma que addon-a11y mostra resultados no painel
pnpm chromatic --project-token=... --only-changed   # confirma snapshot da baseline

# CI
# - push para a branch de Fase 0 dispara test.yml + chromatic.yml
# - governance.yml continua passando (nada removido)
```

**Critério de sucesso da Fase 0:** Button (piloto) tem `*.test.ts` cobrindo Default, Disabled e variantes de `kind`; `play()` cobrindo focus/click; Chromatic com baseline; CI verde em ~+1 min sobre o tempo atual.

## 8. Próximo passo

A Fase 0 está sendo entregue na PR [#703](https://github.com/aziontech/webkit/pull/703), em waves pequenas e mergíveis (ver seção 9). Após o merge, a Fase 1 (gate em componentes novos via `enforce-test-exists.mjs`) já estará ativa — Fase 2 (backfill prioritário) abre como branch nova.

## 9. Progresso (Fases 0 + 1, execução em waves)

A entrega vem em **7 waves** sequenciais na PR #703. Cada wave é um commit isolado, mergível em teoria, com verificação verde local antes de prosseguir.

| Wave | Escopo | Status | Commit | Tipo |
|------|--------|--------|--------|------|
| 1 | Infra Vitest — `vitest`/`@vitest/browser`/`playwright`/`@testing-library/vue`/`@vue/test-utils` em devDeps; `vitest.config.ts` com browser mode (Chromium headless) + alias `@aziontech/webkit` → `@aziontech/webkit.dev`; `src/test/setup.ts`; scripts `test`/`test:watch` em webkit; aliases no root. | ✅ mergeada | `130ebf36` | `chore` |
| 2 | Button pilot — `button.test.ts` com 19 testes: render (button/anchor/data-testid/5 kinds/3 sizes), disabled (atributo nativo + `aria-disabled` + `data-disabled` + click suprimido), loading (`aria-busy` + spinner testid + click suprimido), click handler (`MouseEvent`), e a11y via `axe-core` direto em Default/Disabled/Anchor. | ✅ mergeada | `ebea0c25` | `test` |
| 3 | Button pilot — `play()` em Default (click + Tab + Enter/Space, asserting `onClick` chamado 3x) e Disabled (click suprimido + `aria-disabled`); teste roda essas stories via `composeStories(...).run()`. Deps `@storybook/test` + `@storybook/vue3` em webkit. | ✅ mergeada | `811c424a` | `test` |
| 3.5 | Fix fora do plano original — `@storybook/addon-interactions` instalado em `apps/storybook` e registrado em `.storybook/main.js` (em SB 8 não vem mais embutido no `addon-essentials`). Painel **Interactions** passa a aparecer no canvas. | ✅ mergeada | `8804806a` | `chore` |
| 4 | CI workflow `test.yml` — roda `pnpm webkit:test` em PRs/push para `dev`/`main`, com setup pnpm + Node + `npx playwright install --with-deps chromium`. Paralelo ao `governance.yml`. | ✅ mergeada | `e4d4cc91` | `ci` |
| 5 | CI workflow `chromatic.yml` — visual regression em workflow próprio. Pré-requisito: secret `CHROMATIC_PROJECT_TOKEN` no repo (ação humana). | ✅ mergeada | `a983cffd` | `ci` |
| 6 | Regra `.claude/rules/testing.md` + atualização das skills `validate-component` (passa a rodar `pnpm webkit:test --filter <name>` no `/component-verify`) e `component-scaffold` (gera `<name>.test.ts` mínimo) + nota em `CONTRIBUTING.md`. | ⏸️ a fazer | — | `docs` |
| 7 | Hook `enforce-test-exists.mjs` — gate PreToolUse bloqueando `.vue` novo sem `<name>.test.ts` ao lado; modelado em `enforce-spec-exists.mjs`; whitelist `legacy-components.json`; registro em `.claude/settings.json`. | ⏸️ a fazer | — | `chore` |

**Verificação local atual:** `cd packages/webkit && ./node_modules/.bin/vitest run` → `21 passed (21)` em ~1.5–3 s.

### Ajustes que apareceram durante a execução (não estavam no plano original)

| Ajuste | Por quê |
|---|---|
| `vitest-axe` removido, substituído por `axe-core` direto + helper local `expectNoA11yViolations` | `vitest-axe@0.1.0` usa `createRequire` do `node:module`, que não existe no browser env do Vitest |
| `define: { 'process.env.NODE_ENV': "'test'" }` em `vitest.config.ts` | `@testing-library/vue` lê `process.env.NODE_ENV` e quebra no browser sem polyfill |
| `afterEach(cleanup)` registrado em `src/test/setup.ts` | Em browser mode o cleanup automático do testing-library não dispara; sem isso, DOM acumula entre testes |
| Alias `@aziontech/webkit` → `@aziontech/webkit.dev` (não para `./src`) | Mantém a mesma resolução do Storybook, permitindo que `composeStories` resolva o subpath `@aziontech/webkit/button` consistentemente |
| Globals do ESLint estendidos no root (`Element`, `HTMLButtonElement`, `KeyboardEvent`, etc.) | Flat config não aceita `/* eslint-env browser */`; sem isso o `lint-staged` quebra no commit |
| `**/__screenshots__/` no `.gitignore` | Vitest browser mode escreve screenshots em failures; regeneráveis, não devem ser commitadas |
| `@storybook/addon-interactions` adicionado explicitamente | `addon-essentials@8.6.x` não inclui mais o `addon-interactions` (separado no SB 8) — painel Interactions não aparecia |

## 10. O que cada camada testa e o valor que entrega

A pergunta certa para cada peça do stack não é "o que ela é" — é **"o que ela testa do produto"** e **"que tipo de bug ela impede de chegar no usuário"**. Cada camada cobre uma classe distinta de regressão. Juntas, elas fecham o cerco.

### Camada 1 — Unit (Vitest + browser real)

**O que testa.** O **contrato do componente** quando usado isoladamente: as props que o consumidor envia, os eventos que o componente emite, os slots que renderiza, os atributos ARIA que expõe, o que acontece quando o usuário clica num botão `disabled` ou `loading`.

**O bug que impede.** Uma mudança no `button.vue` deixa o `disabled` passando o clique mesmo assim, ou um refactor renomeia o evento `click` para `pressed`. Hoje isso passaria para produção e quebraria silenciosamente todas as 200+ telas que importam o Button. A camada unit faz a CI vermelha no PR — antes de chegar no Console.

**O valor para o time.**

- **Refactor seguro.** Migrar `kindClasses` → `data-*` em qualquer componente da webkit deixa de ser uma operação assustadora — se o contrato visível não muda, o teste segura.
- **Documentação executável.** O autor de uma feature nova no Console abre `button.test.ts` e vê exatamente o que acontece em cada combinação de prop. Sem precisar perguntar no Slack.
- **Tempo de incidente menor.** Bug em produção vira "1 `it()` reproduzindo, fix, merge" em vez de "abrir DevTools no staging, tentar reproduzir, descobrir o que mudou".

### Camada 2 — Integração (`play()` no Storybook + Vitest browser)

**O que testa.** **Fluxos de interação do usuário** que envolvem mais de um passo: abrir um dropdown e fechar com `Escape`, navegar com `Tab` por um form, ativar um botão com `Enter`/`Space`, focus trap dentro de um Dialog, scroll lock quando um Drawer abre.

**O bug que impede.** Um Dropdown que abre mas não fecha no `Escape`. Um Modal onde o `Tab` "vaza" para o body atrás. Um Switch que reage ao clique mas não ao teclado. Esses bugs raramente aparecem em screenshot — só em uso real, e tipicamente são descobertos por usuários com teclado ou leitor de tela.

**O valor para o time.**

- **Acessibilidade comportamental.** Vai além de "tem `aria-*` correto" (isso é axe na Camada 4) — testa que o componente **se comporta** acessivelmente: ordem de foco, escape, ativação por teclado.
- **Documentação que não mente.** O `play()` aparece no painel Interactions do Storybook como uma demo guiada do componente. Designer/PM clica em "Default" e vê o fluxo. Se o fluxo quebrar, o painel mostra vermelho — a doc é o teste.
- **Custo zero de duplicação.** A mesma story que documenta o componente roda como teste. Sem manter dois mundos.

### Camada 3 — Visual regression (Chromatic)

**O que testa.** **Como o componente aparece** em pixel — em todas as stories existentes, em viewports diferentes, em modo claro/escuro. Captura o snapshot atual e compara com a baseline em `dev`.

**O bug que impede.** Alguém ajusta `--shape-button` no theme e sem querer mexe no `border-radius` de 30 componentes. Ou troca o token `--bg-disabled` e o disabled deixa de ter contraste. Ou um upgrade de Tailwind muda o behavior de uma utility. Esses bugs **só aparecem visualmente** — nenhum teste comportamental pega.

**O valor para o time.**

- **Confiança para mexer em theme/tokens.** Hoje, mudar um token global é apavorante porque não há feedback rápido sobre o impacto. Com Chromatic, você abre a PR e o serviço comenta com "47 stories afetadas, revisa essas screenshots" — você aprova as intencionais, e a CI reprova as não-intencionais.
- **Code review visual incorporado ao fluxo.** Reviewer não precisa rodar Storybook local pra ver o que mudou. O comentário do Chromatic na PR mostra antes/depois lado a lado.
- **Cobertura natural sem trabalho extra.** As 77 stories existentes já entregam a primeira baseline na hora que o workflow for ligado. Componentes novos entram automaticamente.

### Camada 4 — Acessibilidade (axe-core)

**O que testa.** **Violações de WCAG 2.1 AA estáticas** no HTML renderizado por cada story: contraste insuficiente, `<button>` sem nome acessível, `<img>` sem alt, `aria-*` inválido, ordem de heading quebrada, role redundante.

**O bug que impede.** Um IconButton que renderiza só um `<i class="pi pi-trash">` sem `aria-label`. Um Modal com `<div>` clicável em vez de `<button>`. Um link com texto "clique aqui". Esses são problemas que **bloqueariam um audit de a11y** se o produto fosse vendido para setor público, agência regulada ou enterprise com requisitos de inclusão.

**O valor para o time/produto.**

- **Risco regulatório controlado.** Compliance de acessibilidade está virando requisito comercial em muitos contratos enterprise. Ter `axe-core` rodando em CI documenta diligência — não é só "tentamos", é "a CI proíbe".
- **Inclusão real, não declarada.** Engineer sem experiência em a11y consegue mesmo assim acertar — o teste diz o que está errado e por quê (ex.: `color-contrast: 2.8:1 vs required 4.5:1`).
- **Sem custo recorrente.** Não precisa de auditoria manual a cada release. Axe roda em todo PR.

### Camada de governance — Hooks PreToolUse (Wave 7)

**O que testa.** Que **componente novo não nasce sem teste**. No momento em que o Claude/dev tenta criar `<name>.vue` sem `<name>.test.ts` ao lado, o hook bloqueia o `Write` antes do arquivo existir.

**O bug que impede.** A erosão típica de qualquer iniciativa de testing: a barra cai com o tempo, gente cria componente sem teste "só dessa vez", e seis meses depois a cobertura virou 30 %. Esse é o mecanismo que mantém a Fase 1 viva sem precisar de policiamento humano.

**O valor para o time/produto.**

- **Disciplina sem fricção humana.** Não tem code reviewer pedindo "cadê o teste?" — o sistema pede sozinho, antes do PR existir.
- **Compatível com legacy.** Whitelist `legacy-components.json` permite que os 156 componentes existentes fiquem isentos até serem migrados. Sem big-bang.

### Resumo — quem cobre o quê

| Tipo de regressão | Quem pega |
|---|---|
| Prop renomeada, evento removido, default mudado | **Camada 1 (unit)** |
| `disabled` deixa de suprimir click | **Camada 1 (unit)** |
| `Escape` não fecha overlay, `Tab` escapa do Modal, ativação por teclado quebra | **Camada 2 (`play()`)** |
| `border-radius` de 30 componentes mudou sem querer | **Camada 3 (Chromatic)** |
| Contraste insuficiente, `<button>` sem nome acessível, `aria-*` inválido | **Camada 4 (axe)** |
| Componente novo entra no repo sem teste | **Governance (hook PreToolUse)** |

Sem qualquer dessas camadas, há uma classe inteira de bug que **chega no usuário**. Com todas as cinco, as únicas regressões que escapam para produção são as que ninguém pensou em escrever — e mesmo essas geram um teste novo no post-mortem.
