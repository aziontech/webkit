# Skill: component-create

## Metadata

- `name`: `component-create`
- `version`: `1.0.0`
- `owner`: `webkit-design-system`
- `status`: `active`
- `last_updated`: `2026-05-21`

## Purpose

Criar, em uma unica execucao, o pacote completo de um componente novo na camada webkit (`packages/webkit/src/components/webkit/<category>/<name>/`): arquivo Vue em TypeScript tipado + `package.json` local + entry em `packages/webkit/package.json#exports` + arquivo Code Connect Figma + story Storybook com uso completo dos recursos (argTypes/args/parameters/actions/a11y/decorators/play). Segue o padrao dos canonicos (button, icon-button, card-pricing) e adere ao `packages/webkit/docs/Design.md`. Aplica Composition Pattern (estilo shadcn-vue) apenas quando faz sentido. Skill produz codigo, nao apenas guia.

## Inputs

- **Nome do componente** em kebab-case (ex.: `dialog`, `card-banner`, `drawer`).
- **Categoria alvo** dentro de `packages/webkit/src/components/webkit/`: `actions`, `content`, `data`, `feedback`, `inputs`, `layout`, `navigation`, `overlay`, `utils`.
- **Estrutura desejada:**
  - `monolithic` — 1 arquivo Vue com props + slots (padrao default; usado em atomicos e em componentes com layout fixo como `card-pricing.vue`).
  - `composition` — Composition Pattern com sub-componentes irmaos (Dialog/Card composto/Tabs/Accordion/etc.).
- **Referencia Figma:** URL do frame ou nodeId para extrair variaveis e estados via MCP `plugin:figma:figma`.
- **Fontes de verdade obrigatorias (skill le antes de implementar):**
  - `packages/webkit/docs/Design.md` (typography classes, spacing, max-width, shape, cores semanticas).
  - `packages/webkit/docs/COMPONENT_REQUIREMENTS.md` (estrutura geral, package.json, exports).
  - `packages/webkit/docs/PRIMEVUE_ABSTRACTION.md` (quando o componente envolve PrimeVue).
  - `packages/webkit/src/components/webkit/actions/button/button.vue` (canonico atomico interativo).
  - `packages/webkit/src/components/webkit/actions/icon-button/icon-button.vue` (variacao atomica).
  - `packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue` (canonico monolitico com props + slots, `data-testid` BEM, typography via classes geradas).
  - `packages/webkit/src/composables/` (logica reaproveitavel a checar antes de criar nova).
  - `packages/theme/src/tokens/` (universo de CSS vars e classes geradas).
  - Referencia externa: `https://www.shadcn-vue.com/docs/components` (criterio Composition Pattern).

## Outputs

Todos os artefatos sao **criados/editados pela skill**, nao apenas planejados:

- `packages/webkit/src/components/webkit/<category>/<name>/<name>.vue` (TypeScript com `<script setup lang="ts">`).
- Se `structure: composition`: sub-componentes irmaos no mesmo diretorio (`<name>-trigger.vue`, `<name>-content.vue`, `<name>-title.vue`, etc., conforme aplicavel ao componente).
- `packages/webkit/src/components/webkit/<category>/<name>/package.json` (padrao `main`/`module`/`types`/`browser./sfc`/`sideEffects:["*.vue"]`).
- `packages/webkit/src/components/webkit/<category>/<name>/<name>.figma.ts` quando Code Connect estiver habilitado no file Figma do projeto; caso contrario, pendencia registrada no relatorio.
- Linha(s) nova(s) em `packages/webkit/package.json#exports` (uma por componente publico).
- Composables compartilhados em `packages/webkit/src/composables/<name>/{index.ts, package.json}` quando ha logica reaproveitavel extraida.
- `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js` com uso completo de Storybook (argTypes, args, parameters.actions/a11y/backgrounds/docs/layout, decorators, stories Default/por kind/por size/Disabled/Loading/WithSlots/WithComposition/Controlled/Uncontrolled/LightDark/Accessibility/Playground, `play` function em Accessibility via `@storybook/test`).
- **Relatorio** (Markdown + opcionalmente `report.json`) com: tabela tokens Figma -> CSS var/classe Design.md, lista de gaps de tema, lista de utilitarios extraidos, mapeamentos Code Connect criados, checklist a11y/UX preenchidos, comandos rodados, evidencias (screenshots Storybook).

## Workflow

1. **Descoberta no Figma** — invocar `/figma-use` (mandatorio antes de qualquer chamada write do MCP). Chamar `mcp__plugin_figma_figma__get_variable_defs` + `get_design_context` no frame alvo. Coletar cores, tipografia, spacing, radius, sombras, estados (default/hover/active/focus/disabled), e identificar partes (header/body/footer/acoes) — informacao alimenta a decisao Composition vs Monolitico.

2. **Mapeamento tokens -> recursos do Design.md** — consultar `packages/webkit/docs/Design.md` e mapear:
   - **Typography:** identificar role + tamanho e usar classe gerada (`text-heading-md`, `text-body-sm`, `text-label-md`, `text-button-lg`, `text-overline-md`, `text-big-number-lg`, etc.). **Nunca** `text-[length:var(--text-*)]` raw, **nunca** `leading-*`/`tracking-*`/`font-family` direto.
   - **Spacing:** `var(--spacing-*)` em `px-[...]`/`py-[...]`/`gap-[...]`/`m-[...]`.
   - **Max width:** `var(--container-*)` para conteudo fixo; `var(--container-max-width)` para layout containers.
   - **Shape:** `rounded-[var(--shape-button)]`, `rounded-[var(--shape-card)]`, `rounded-[var(--shape-elements)]`, `rounded-[var(--shape-flat)]`.
   - **Cores semanticas:** `var(--primary)`, `var(--bg-surface)`, `var(--text-muted)`, `var(--border-default)`, etc. **Proibido:** HEX/RGB/HSL, palette Tailwind (`bg-gray-*`), utilitarios PrimeVue (`text-color`, `surface-*`).

   Se token Figma sem equivalente, registrar **gap de tema** com `TODO: tokenizar` e usar primitivo mais proximo temporariamente.

3. **Analise de reuso (anti-duplicacao)** — antes de implementar, varrer:
   - `packages/webkit/src/composables/` — logica ja existente (`use-toast`, `use-dialog`).
   - `packages/webkit/src/components/webkit/utils/` — sub-componentes utilitarios (`spinner`).
   - `packages/webkit/src/components/webkit/` na mesma categoria — pode reusar como Currency/Tag em [card-pricing.vue](../packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue).
   - `packages/theme/src/` — animacoes/transicoes globais.

   Qualquer utilitario novo reaproveitavel **deve** ir para local compartilhado, nunca inline no componente.

4. **Decidir estrutura — Composition Pattern so quando faz sentido** (referencia [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components)):
   - **Composition (SIM):** consumer precisa trocar ORDEM ou OMITIR partes — Dialog (`Dialog`/`DialogTrigger`/`DialogContent`/`DialogTitle`/`DialogDescription`/`DialogClose`), Card composto (`Card`/`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`), Tabs, Accordion, DropdownMenu, Sheet/Drawer, Form fields.
   - **Monolitico com props + slots (NAO Composition):** layout fixo com variacoes via configuracao + inversao pontual via slots. Exemplo: [card-pricing.vue](../packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue).
   - **Atomicos:** Button, IconButton, Tag, Spinner, Badge, Currency — sempre monoliticos sem slots.
   - Criterio decisor: "o consumer precisa trocar a ORDEM ou OMITIR partes que o root expoe?" Em duvida, comecar monolitico.

5. **Estrutura de arquivos** — criar diretorio, arquivos `.vue` (root + sub-componentes se composition), `package.json` local.

6. **Implementacao seguindo o padrao real (TypeScript tipado):**
   - `<script setup lang="ts">` antes de `<template>`.
   - `defineOptions({ name: 'PascalCase', inheritAttrs: false })`.
   - **Tipos explicitos com JSDoc/TSDoc em cada prop publica:**

     ```ts
     type Kind = 'primary' | 'secondary' | 'outlined' | 'text'
     type Size = 'small' | 'medium' | 'large'

     interface Props {
       /** Visible label rendered inside the component. */
       label?: string
       /** Visual variant. Use `primary` for primary actions. */
       kind?: Kind
       /** Size token. Affects height, padding, and typography. */
       size?: Size
       /** Disables interaction and applies disabled token set. */
       disabled?: boolean
       /** Controlled open state. Use with `v-model:open`. */
       open?: boolean
       /** Initial open state when uncontrolled. */
       defaultOpen?: boolean
     }

     const props = withDefaults(defineProps<Props>(), {
       label: '',
       kind: 'primary',
       size: 'large',
       disabled: false,
       open: undefined,
       defaultOpen: false
     })

     const emit = defineEmits<{
       click: [event: MouseEvent]
       'update:open': [value: boolean]
     }>()

     defineSlots<{ default(): unknown; actions(): unknown }>()

     const openModel = defineModel<boolean>('open', { default: undefined })
     ```

   - `const attrs = useAttrs()` + `const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? '<category>-<name>')`.
   - Computed para estados derivados (`isInactive`, `isAnchor`, `isOpen`) tipados.
   - Maps tipados: `const kindClasses: Record<Kind, string> = { ... }`, `const sizeClasses: Record<Size, string> = { ... }`.
   - `rootClasses` computed combina `sharedClasses` + `kindClasses[kind]` + `sizeClasses[size]` + estados + `attrs.class`.
   - **Tokens exclusivamente** via classes geradas do Design.md (typography) + `var(--*)` semanticos (cores/spacing/shape/max-width).
   - Pseudo `before:` para overlays hover/active em componentes interativos.
   - **`data-testid` BEM-style:** raiz com fallback `'<category>-<name>'`; filhos com `${testId}__<part>` (dois underlines): `__header`, `__title`, `__description`, `__actions`, `__action`, `__close`, `__loading`, `__icon`, `__panel`, `__backdrop`, `__error-message`.
   - Polimorfismo `<a>`/`<button>` quando interativo + suporta `href` (sempre `rel="noopener noreferrer"` em `_blank`).
   - **Estados controlados/nao-controlados** (padrao shadcn) quando aplicavel: prop controlada (default `undefined`) + `defaultProp` + emit `update:prop` + computed que decide entre `defineModel` e ref interna.
   - **Naming conventions:**
     - Variantes visuais sempre `kind` (nunca `variant`/`color`/`appearance`).
     - Tamanhos sempre `size` (`'small' | 'medium' | 'large'`).
     - Booleanos sem prefixo `is`/`has` na prop (`disabled`, `loading`, `open`, `selected`, `expanded`).
     - Eventos kebab-case (`update:open`, `before-close`).
     - `defineModel<T>('propName')` para v-model da prop principal.
   - **Clean code:** nomes claros, funcoes pequenas, sem `any`, sem `// @ts-ignore`, imports ordenados (Vue -> @vueuse -> webkit interno -> relativos), sem logica complexa inline em template, sem `<style>` (preferir Tailwind + CSS vars).

7. **Composition Pattern (quando aplicavel)** — sub-componentes irmaos no mesmo diretorio, mesmo padrao do root (script setup lang=ts, inheritAttrs:false, useAttrs, rootClasses com attrs.class). Estado compartilhado via `provide`/`inject` tipado:

   ```ts
   // <name>.vue (root)
   import type { InjectionKey } from 'vue'
   interface <Name>Context { close: () => void; testId: string }
   const <Name>InjectionKey: InjectionKey<<Name>Context> = Symbol('<Name>Context')
   provide(<Name>InjectionKey, { close, testId: testId.value })

   // <name>-header.vue (sub)
   const ctx = inject(<Name>InjectionKey)
   ```

   Cada sub-componente publico recebe entry propria em `packages/webkit/package.json#exports`.

8. **Acessibilidade (WCAG 2.1 AA)** — aplicar em root e em cada sub-componente:
   - Semantica HTML correta (`<button>`/`<a>`/`<dialog>`/`<nav>` nativo antes de `role=...`).
   - Foco visivel: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`. Nunca `outline: none` sem substituto.
   - Navegacao por teclado: Tab/Shift+Tab; Enter/Space em botoes; Esc fecha overlays; setas em menus/listas/radio; trap de foco em modais; foco retorna ao trigger ao fechar.
   - ARIA: `aria-label`, `aria-labelledby`/`aria-describedby`, `aria-busy`, `aria-disabled`, `aria-hidden="true"` em icones decorativos, `aria-current`/`aria-selected`/`aria-expanded`, `aria-live="polite"` para feedback dinamico.
   - Contraste: >=4.5:1 (texto) / >=3:1 (large/icones), incluindo disabled.
   - `prefers-reduced-motion`: `motion-reduce:transition-none motion-reduce:transform-none`.
   - Touch target: >=40x40px; menores exigem justificativa.
   - Forms: `<label>` associado, `aria-describedby` para hint/erro, `aria-invalid="true"` em erro, mensagem via `aria-live`.
   - Screen reader test (VoiceOver/NVDA) — comportamento anunciado claramente.

9. **Usabilidade** — checklist obrigatorio:
   - Estados distintos sem depender so de cor (borda, sombra, icone, padrao).
   - Feedback <100ms; loading em >300ms; progresso em >2s.
   - Loading nao-bloqueante (`cursor-loading` + `aria-busy`).
   - Erro acionavel com mensagem clara.
   - Hit area generosa (padding >=`var(--spacing-2)`).
   - i18n-ready (textos via props, suporta strings longas).
   - Consistencia com componentes da mesma categoria.
   - Affordance clara.

10. **Exports** — adicionar em `packages/webkit/package.json#exports` mantendo a ordem alfabetica/por categoria existente:

    ```json
    "./<category>/<name>": "./src/components/webkit/<category>/<name>/<name>.vue",
    // Para Composition Pattern, uma entrada por sub-componente publico:
    "./<category>/<name>-header": "./src/components/webkit/<category>/<name>/<name>-header.vue"
    ```

11. **Storybook (uso completo de recursos)** — `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js`:
    - Imports via `@aziontech/webkit/<category>/<name>`.
    - **Meta:** `title: 'Webkit/<Category>/<Name>'`; `component`; `subcomponents` quando Composition; `tags: ['autodocs']`.
    - **`argTypes` para CADA prop** com `control` apropriado (`select`/`radio` com `options`, `boolean`, `text`, `number`, `color`), `description` (do JSDoc), `table.defaultValue`.
    - **`argTypes` para CADA evento** com `{ action: '<event-name>' }`.
    - **`args`** com defaults sensatos para Default story.
    - **`parameters`:**
      - `parameters.actions = { argTypesRegex: '^on[A-Z].*', handles: [...] }`.
      - `parameters.a11y` (addon) com regras WCAG.
      - `parameters.docs.description.component` + `parameters.docs.description.story` em cada story.
      - `parameters.backgrounds` com valores light/dark do tema.
      - `parameters.layout` (`'centered'` / `'fullscreen'`).
    - **`decorators`** quando necessario (theme provider, mount root, router).
    - **Stories obrigatorias:** Default + por `kind` + por `size` + Disabled + Loading (se aplicavel) + WithSlots/WithComposition + Controlled + Uncontrolled (se aplicavel) + **LightDark** + Accessibility + **Playground**.
    - `play` function em Accessibility (ou Playground) com `@storybook/test`: `userEvent`, `expect`, `within`.
    - `render: (args) => ({ ..., setup() { return { args } }, template: '<Comp v-bind="args" />' })`.

12. **Figma Code Connect** — gerar `<name>.figma.ts` via `mcp__plugin_figma_figma__add_code_connect_map` (skill `/figma-code-connect` como prerequisito). Mapear: variantes Figma (`kind`/`size`/`state`) -> props Vue, slots Figma -> children Vue, snippet de exibicao. Se Code Connect indisponivel no file, registrar pendencia no relatorio.

13. **Validacao** — rodar:

    ```bash
    pnpm webkit:lint
    pnpm webkit:type-check
    pnpm webkit:type-coverage
    pnpm webkit:build:dts
    pnpm storybook:build
    ```

    Forcar `:hover`/`:focus-visible`/`:active` no DevTools. Testar navegacao so com teclado. Validar VoiceOver no story principal. Conferir light/dark no story `LightDark`.

14. **Relatorio final** — Markdown com:
    - Componente criado (categoria, estrutura monolitico/composition).
    - Lista de arquivos criados (paths absolutos).
    - Exports adicionados.
    - Tabela tokens Figma -> CSS var/classe Design.md.
    - Gaps de tema (com `TODO: tokenizar`).
    - Utilitarios extraidos (composables, sub-componentes).
    - Mapeamentos Code Connect.
    - Checklists a11y/UX preenchidos.
    - Comandos rodados (status de cada).

## Rules

1. **Sempre TypeScript** para novos componentes: `<script setup lang="ts">` com `defineProps<...>()`, `defineEmits<...>()`, tipos para variantes, zero `any`.
2. **JSDoc/TSDoc obrigatorio em toda prop publica** — uma linha descrevendo o proposito.
3. **Naming conventions estritas:**
   - Variantes visuais sempre `kind`.
   - Tamanhos sempre `size` (`small`/`medium`/`large`).
   - Booleanos sem prefixo `is`/`has` na prop.
   - Eventos kebab-case na emissao.
   - `defineModel<T>('propName')` para v-model.
4. **Estados controlados/nao-controlados** (padrao shadcn) quando o componente tem estado interno relevante (open/value/selected/expanded).
5. **Slots tipados** com `defineSlots<...>()` quando ha inversao de controle.
6. **Nunca HEX/RGB hardcoded.** Apenas tokens.
7. **Typography sempre via classe gerada** do Design.md (`text-heading-md`, etc.). Nunca raw.
8. **Nunca declarar `class` em `defineProps`.** Usar `attrs.class` via `useAttrs()` com `inheritAttrs: false`.
9. `<script setup>` sempre antes de `<template>`.
10. **Composition Pattern so quando faz sentido** (Dialog/Card/Tabs/Accordion/etc.); em duvida, monolitico. Atomicos sempre monoliticos.
11. **Nao duplicar utilitarios:** animacoes/classes/logica reaproveitavel vao para `packages/theme/`, `packages/webkit/src/composables/`, ou `packages/webkit/src/components/webkit/utils/`.
12. **Tokens iguais aos canonicos** + adesao ao Design.md. Em conflito, Design.md vence.
13. **Clean code:** nomes claros, funcoes pequenas, sem comentarios obvios, sem codigo morto, imports ordenados.
14. Nome do diretorio, do arquivo `.vue` e do `defineOptions.name` combinam (kebab-case fs, PascalCase `name`).
15. **`data-testid` hierarquico BEM-style:** raiz `'<category>-<name>'`, filhos `${testId}__<part>`.
16. Toda variante declarada em props tem entrada nos maps de classes E story dedicada.
17. **Story `LightDark` obrigatoria** validando o componente em ambos os modos.
18. **Storybook completo:** `argTypes`/`args`/`parameters.actions/a11y/docs/backgrounds/layout`/`decorators` + `play` function em Accessibility.
19. **Foco visivel obrigatorio** com `focus-visible:ring-*` + ring-offset baseado em `--bg-canvas`.
20. **Cumprir WCAG 2.1 AA** em contraste, foco e operabilidade por teclado.
21. **Figma Code Connect** quando o file Figma do projeto suporta: gerar `<name>.figma.ts`.
22. Categoria deve existir em `packages/webkit/src/components/webkit/`; nova categoria exige justificativa.

## Guardrails

- Nunca criar componente sem descobrir tokens no Figma primeiro (excecao: pedido explicito "ad-hoc, sem Figma" registrado no relatorio).
- Nunca tocar em `packages/webkit/docs/COMPONENT_REQUIREMENTS.md`, `Design.md` ou `PRIMEVUE_ABSTRACTION.md` (skill **le**, nao edita).
- Nunca alterar `package.json` raiz ou `.github/workflows/*`.
- Nunca criar testes (webkit nao tem suite hoje); story + checklist visual cobrem a validacao.
- **Nunca fechar a skill** com checklists a11y/UX incompletos — itens nao atendidos viram pendencias explicitas.
- **Nunca remover** `focus-visible`, `aria-*`, `data-testid`, `disabled` HTML, polimorfismo `<a>`/`<button>` ou tipagem TS "para simplificar".
- **Nunca usar `any` ou `// @ts-ignore`** no codigo gerado.
- **Nunca criar animacao/classe utilitaria inline** se ela for generica para ser compartilhada.
- **Nunca usar typography raw** (`text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, `font-family`). Sempre classe gerada do Design.md.
- **Nunca usar palette Tailwind** (`bg-gray-*`, `text-violet-*`) ou utilitarios PrimeVue (`text-color`, `surface-*`) em componentes da camada webkit.
- **Nunca aplicar Composition Pattern por reflexo** — verificar o criterio "consumer precisa trocar ORDEM ou OMITIR partes?".

## Fallbacks

- Se MCP Figma nao responder ou frame nao tiver variaveis, perguntar URL/screenshot ao usuario e usar `get_screenshot` para inferir manualmente; registrar pendencia.
- Se token Figma sem CSS var equivalente, registrar **gap de tema** e usar primitivo mais proximo com `TODO: tokenizar`.
- Se categoria alvo estiver vazia (primeiro componente da categoria), avisar no relatorio.
- Se utilitario compartilhado proposto nao couber em local existente, propor novo local (`packages/webkit/src/composables/<name>/` ou `packages/webkit/src/components/webkit/utils/<name>/`) no relatorio, sem criar sem confirmacao.
- Se Code Connect indisponivel no file Figma, pular `<name>.figma.ts` e registrar pendencia.
- Se em duvida sobre Composition Pattern, comecar monolitico e refatorar depois se aparecer caso de uso real.

## Definition of Done

Todos os artefatos foram **criados** pela skill ao final, nao apenas planejados:

- [ ] `packages/webkit/src/components/webkit/<category>/<name>/<name>.vue` criado em TypeScript tipado com **JSDoc em cada prop publica**.
- [ ] Se Composition Pattern: sub-componentes criados no mesmo diretorio com `provide`/`inject` tipado.
- [ ] `package.json` local criado.
- [ ] Linha(s) adicionada(s) em `packages/webkit/package.json#exports`.
- [ ] `<name>.figma.ts` (Code Connect) criado ou pendencia justificada no relatorio.
- [ ] `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js` criado com uso completo de Storybook: meta com `argTypes`/`args`/`parameters`/`decorators`/`subcomponents`; stories Default + variantes por `kind`/`size` + Disabled + Loading + WithSlots/WithComposition + Controlled + Uncontrolled + **LightDark** + Accessibility (com `play` function via `@storybook/test`) + Playground.
- [ ] Componente segue padrao dos canonicos (script setup lang=ts primeiro, `inheritAttrs: false`, `useAttrs`, `testId` BEM-style, arrays de classes tipados, `rootClasses` com `attrs.class`, sem HEX, sem `any`, typography via classes geradas Design.md).
- [ ] **Naming conventions** aplicadas (`kind`/`size`/booleanos sem prefixo, eventos kebab-case, `defineModel`).
- [ ] **Estados controlados/nao-controlados** implementados quando aplicavel.
- [ ] **Slots tipados** com `defineSlots<...>()` quando aplicavel.
- [ ] Utilitarios reaproveitaveis extraidos para locais compartilhados.
- [ ] `pnpm webkit:lint && pnpm webkit:type-check && pnpm webkit:type-coverage && pnpm webkit:build:dts && pnpm storybook:build` passam.
- [ ] Story `LightDark` valida componente em ambos os modos.
- [ ] Relatorio com tabela token Figma -> classe Design.md/CSS var, gaps, utilitarios extraidos, mapeamentos Code Connect.
- [ ] **Checklist de acessibilidade** preenchido.
- [ ] **Checklist de usabilidade** preenchido.

## Example

**Input do usuario (texto natural):**

> "Preciso de um Dialog no webkit em `overlay`. Tem header com titulo e botao fechar, content, footer com acoes primaria/secundaria. Suportar controlado (v-model:open) e nao-controlado (defaultOpen), trap de foco, ESC fecha. Figma: figma.com/design/abc/?node-id=10-42"

**Invocacao:**

```
/component-create dialog --category overlay --structure composition --figma figma.com/design/abc/?node-id=10-42
```

**Arquivos criados:**

```
packages/webkit/src/components/webkit/overlay/dialog/
  dialog.vue                    # root, defineModel('open'), provide context, focus trap
  dialog-trigger.vue            # inject context, abre via click
  dialog-content.vue            # inject context, panel + backdrop
  dialog-title.vue              # text-heading-md
  dialog-description.vue        # text-body-sm text-[var(--text-muted)]
  dialog-close.vue              # IconButton interno, inject context.close
  dialog.figma.ts               # Code Connect: kind/size/open -> props Vue
  package.json

packages/webkit/src/composables/use-focus-trap/
  index.ts
  package.json

apps/storybook/src/stories/webkit/overlay/Dialog.stories.js
```

**Exports adicionados (6):** `./overlay/dialog`, `./overlay/dialog-trigger`, `./overlay/dialog-content`, `./overlay/dialog-title`, `./overlay/dialog-description`, `./overlay/dialog-close`, `./use-focus-trap`.

**Trecho `dialog-title.vue`:**

```vue
<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({ name: 'DialogTitle', inheritAttrs: false })
  defineSlots<{ default(): unknown }>()

  const ctx = inject(DialogInjectionKey)
  const attrs = useAttrs()
  const rootClasses = computed(() => ['text-heading-md text-[var(--text-default)]', attrs.class])
</script>

<template>
  <h2
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__title`"
  >
    <slot />
  </h2>
</template>
```

**Consumo no app:**

```vue
<Dialog v-model:open="open">
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Confirm action</DialogTitle>
    <DialogDescription>This cannot be undone.</DialogDescription>
    <Button kind="text" label="Cancel" @click="open = false" />
    <Button kind="primary" label="Confirm" @click="handleConfirm" />
    <DialogClose />
  </DialogContent>
</Dialog>
```

**Relatorio (trecho):**

```text
Componente: overlay/dialog (Composition Pattern, 6 sub-componentes)
Tokens mapeados:
  color/surface          -> var(--bg-surface)
  text/heading-md        -> classe .text-heading-md (Design.md)
  text/body-sm           -> classe .text-body-sm (Design.md)
  spacing/6              -> var(--spacing-6)
  radius/card            -> var(--shape-card)
  color/mask             -> var(--bg-mask)
Gaps (1): color/overlay-shadow -> sem CSS var, usando shadow-lg primitivo. TODO: tokenizar.
Utilitarios extraidos: use-focus-trap.
Code Connect: dialog.figma.ts criado (node 10-42).
Checklist a11y: 12/12.
Checklist UX: 8/8.
Validacao: lint v, type-check v, type-coverage 97.2%, build:dts v, storybook:build v.
```
