# Geração automática de documentação de componentes

Este documento descreve **como funciona** e **como executar** a geração automática de páginas e artefatos de documentação a partir do pacote **webkit**. A documentação de componentes do ds-docs é derivada do código-fonte do webkit; ao adicionar ou alterar componentes lá, você pode regenerar a doc aqui.

## Visão geral

O fluxo automático:

1. **Descobre** todos os componentes Vue em `packages/webkit/src/core` e `packages/webkit/src/components`.
2. **Extrai** a API (props, events, slots) de cada componente via parsing do SFC.
3. **Gera** os artefatos usados pelo ds-docs: API JSON, props do Playground, páginas MDX (EN/PT) e o registry do Playground.

A **fonte da verdade** é o webkit. O script de scaffold **não** inventa componentes; ele apenas reflete o que existe no pacote `@aziontech/webkit` e no `package.json` (exports).

## Como rodar

**Pré-requisito:** executar a partir da raiz do app **ds-docs**:

```bash
cd apps/ds-docs
```

### Comando principal

```bash
pnpm build:scaffold
```

- Cria/atualiza **component-api**, **component-props**, **playground-registry** e **páginas MDX** (EN e PT) para todos os componentes descobertos no webkit.
- **Não sobrescreve** páginas MDX já existentes (para preservar edições manuais). Para forçar a recriação das páginas, use `--force`.

### Opções úteis

| Comando | Descrição |
|--------|------------|
| `pnpm build:scaffold` | Gera tudo; pula MDX que já existem (EN). Sempre regera PT. |
| `pnpm build:scaffold --force` | Igual acima, mas **sobrescreve** as páginas MDX em EN (e continua regerando PT). |
| `pnpm build:scaffold --dry-run` | Só simula: descobre componentes e extrai API, **não grava arquivos**. |
| `pnpm build:scaffold --dry-run --verbose` ou `-v` | Dry-run com lista de componentes e arquivos que seriam criados/alterados. |
| `pnpm build:scaffold:dry` | Atalho para `--dry-run --verbose`. |

### No build completo

O build do ds-docs já chama o scaffold:

```bash
pnpm build
```

Isso executa, na ordem:

1. `pnpm build:search` — índice de busca  
2. `pnpm build:api` — extração de API (também usada pelo scaffold internamente)  
3. `pnpm build:scaffold` — geração de componentes (API, props, MDX, registry)  
4. `astro build` — build do site  

Ou seja: **não é necessário** rodar `build:scaffold` à mão antes de cada build, a menos que você queira pré-gerar ou testar com `--dry-run` / `--force`.

## O que é gerado

### 1. Component API (`src/generated/component-api/`)

- **Um JSON por componente**, com slug como nome do arquivo (ex.: `form-field-text.json`, `azion-system-status.json`).
- Conteúdo: **props** (name, type, default, required, description), **events**, **slots**, extraídos do código Vue do webkit.
- **Uso:** layout de página de componente (ex.: `ComponentPageLayout.astro`) e abas de documentação quando o frontmatter usa `apiFrom: "<slug>"`.

### 2. Component Props – Playground (`src/generated/component-props/`)

- **Um JSON por componente**, no formato **PropsDefinition** do Playground (controles: select, boolean, text, number, etc.).
- **Uso:** o componente `<Playground>` em cada página MDX recebe `props={componentProps}` importado de `@/generated/component-props/<slug>.json`.
- **Override:** se existir `src/generated/component-props-overrides/<slug>.json`, ele **substitui** o arquivo gerado em `component-props/` para aquele slug. Use para ajustar controles, defaults ou adicionar props apenas para o demo (ex.: `azion-system-status` com `demoStatus`).

### 3. Páginas de documentação (MDX)

- **EN:** `src/content/v1/en/components/<slug>.mdx`  
- **PT:** `src/content/v1/pt/components/<slug>.mdx`  

Cada página gerada contém:

- Frontmatter: `title`, `description`, `navLabel`, `type: component`, `status`, `component` (nome PascalCase), `category`, `apiFrom` (slug).
- Import do `Playground` e do JSON de props.
- Uso de `<Playground client:only="vue" component-name="..." props={...} />`.

**Comportamento:**

- **EN:** criada só se o arquivo não existir; com `--force`, é sempre sobrescrita.
- **PT:** sempre regerada a cada execução (espelho do conteúdo EN; traduções podem ser feitas depois nos arquivos PT).

### 4. Playground Registry (`src/generated/playground-registry.ts`)

Arquivo TypeScript que define:

- **webkitComponentLoaders:** mapa `slug → () => import('@aziontech/webkit/...')` para uso direto (ex.: WebkitPreview).
- **webkitComponentByName:** mapa `displayName (PascalCase) → dynamic import` para o registry do `Playground.vue`.
- **webkitRegistry:** array de metadados `{ slug, exportKey, displayName, category }`.

Apenas componentes **exportados** no `package.json` do webkit entram nos loaders; todos os descobertos entram no `webkitRegistry`.

### 5. Components registry (`src/generated/components-registry.ts`)

- **Não é escrito** pelo scaffold; é **derivado** em código do `webkitRegistry` (import de `playground-registry.ts`).
- Fornece a lista de componentes para ferramentas de doc (ex.: `getComponentByName`, busca). A listagem na UI vem da **content collection** (arquivos MDX), não deste registry.

## Fluxo interno do scaffold (resumido)

```
1. Verificar existência de packages/webkit/src/core e/ou src/components
2. discoverWebkitComponents(core) + discoverWebkitComponents(components)
   → lista de { slug, exportKey, category, vuePath, ... }
3. Ler package.json do webkit (exports) para saber quais entram no registry com import
4. extractWebkitCore(core) + extractWebkitCore(components)
   → gera component-api/<slug>.json para cada componente
5. Para cada API extraída:
   - Se existir component-props-overrides/<slug>.json → copiar para component-props/
   - Senão → buildPropsDefinition(props) → gravar component-props/<slug>.json
6. Para cada componente:
   - EN: escrever ou pular (ou sobrescrever com --force) src/content/v1/en/components/<slug>.mdx
   - PT: sempre escrever src/content/v1/pt/components/<slug>.mdx
7. buildPlaygroundRegistry(components, webkitExports) → playground-registry.ts
8. Resumo (created / skipped)
```

## Convenções de nomes

- **Slug:** kebab-case, espelhando a pasta do componente no webkit (ex.: `field-text` vira `form-field-text` quando está em `form/field-text/`).
- **Display name:** PascalCase usado no Playground e no frontmatter `component` (ex.: `FieldText`, `AzionSystemStatus`).
- **Export key:** nome do export no `package.json` do webkit (ex.: `field-text`, `azion-system-status`). O import é `@aziontech/webkit/<exportKey>`.

## Overrides de props do Playground

Para um componente cujas props geradas não são ideais para o demo (ou para adicionar props só de documentação):

1. Crie `src/generated/component-props-overrides/<slug>.json`.
2. Coloque o objeto **PropsDefinition** completo que você quer (o override **substitui** o arquivo gerado, não faz merge).
3. Na próxima execução de `pnpm build:scaffold`, esse JSON será copiado para `src/generated/component-props/<slug>.json`.

Exemplo: `component-props-overrides/azion-system-status.json` pode definir uma prop `demoStatus` (enum) para simular o status na doc sem chamar a API real.

## Quando rodar

- **Após adicionar componentes no webkit:** rode `pnpm build:scaffold` no ds-docs para criar as novas páginas e entradas no registry.
- **Após alterar props/API no webkit:** rode de novo para atualizar `component-api` e `component-props` (e, se quiser, as MDX com `--force`).
- **Para só ver o que mudaria:** use `pnpm build:scaffold:dry` ou `pnpm build:scaffold --dry-run -v`.
- **Para “resetar” as páginas EN ao template mínimo:** use `pnpm build:scaffold --force` (PT continua sendo espelho do EN).

## Scripts e arquivos relacionados

| Item | Descrição |
|------|------------|
| `scripts/scaffoldComponentDocs.ts` | Orquestra descoberta, extração, geração de props, MDX e registry. |
| `scripts/extractComponentApi.ts` | Extrai API (props, events, slots) dos Vue SFCs; exporta `discoverWebkitComponents` e `extractWebkitCore`. |
| `src/generated/playground-registry.ts` | Gerado; não editar à mão. |
| `src/generated/component-api/*.json` | Gerados pela extração. |
| `src/generated/component-props/*.json` | Gerados ou copiados de overrides. |
| `src/generated/component-props-overrides/*.json` | Manuais; um por slug quando quiser override. |
| `src/generated/components-registry.ts` | Derivado do `webkitRegistry`; ver comentários no arquivo. |

## Referências

- [Component Page Architecture](./component-page-architecture.md) — estrutura das páginas de componente (tabs, Overview/Usage/API).
- [Governance](./governance.md) — lint, links, API extraction e papel do `build:api` / `build:scaffold` no pipeline de documentação.
