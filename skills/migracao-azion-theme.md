# Skill: migracao-azion-theme

## Metadata

- `name`: `migracao-azion-theme`
- `version`: `1.0.0`
- `owner`: `webkit-design-system`
- `status`: `active`
- `last_updated`: `2026-04-24`

## Purpose

Migrar estilos legados para `@aziontech/theme`, removendo HEX hardcoded e classes Tailwind nao semanticas quando aplicavel.

## Inputs

- Escopo de migracao em diretorio, glob ou conjunto de arquivos.
- Exemplo de escopos validos:
  - `packages/webkit/src/components/**`
  - `packages/webkit/src/core/**`
  - qualquer escopo informado pelo usuario
- Fonte de verdade obrigatoria:
  - `docs/MIGRACAO_AZION_THEME.md`

Importante: nao assumir arquivo especifico fixo.

## Outputs

- Diff com alteracoes aplicadas no escopo informado.
- Relatorio curto contendo:
  - resumo da migracao
  - tabela `antes -> depois` por tipo (`text`, `bg`, `border`)
  - lista de excecoes justificadas
  - pendencias de tokenizacao
  - checklist de validacao preenchido

## Workflow

1. Auditar o escopo:
   - localizar HEX hardcoded
   - localizar classes Tailwind legadas de cor

2. Classificar intencao visual de cada ocorrencia:
   - texto, fundo, borda
   - estado semantico (`primary`, `danger`, `success`, `warning`, `link`)
   - superficie/canvas

3. Aplicar substituicoes:
   - semantico primeiro
   - primitivo como fallback

4. Validar o resultado:
   - sem regressao de estados (`hover`, `focus`, `disabled`, `active`)
   - aderencia a light/dark mode
   - ausencia de novos HEX desnecessarios

5. Reportar resultados:
   - arquivos alterados
   - mapeamentos aplicados
   - pendencias e excecoes

## Rules

1. Prioridade de substituicao:
   1. token semantico (`text-default`, `text-muted`, `bg-surface`, `bg-primary`, `border-subtle`, etc.)
   2. token primitivo mais proximo (`orange-500`, `violet-300`, `slate-900`, etc.)
   3. se nao houver match adequado, registrar pendencia de tokenizacao

2. Mapeamento base (resumo):
   - `#fe601f` / `#f3652b` -> `primary` (ou `orange-500`)
   - `#d95522` / `#d94a03` -> `primary-hover` (ou `orange-600`)
   - `#ef4444` / `#dc2626` -> `danger` (ou `red-500`/`red-600`)
   - `#22c55e` / `#16a34a` -> `success` (ou `green-500`/`green-600`)
   - `#eab308` / `#ca8a04` -> `warning` (ou `yellow-500`/`yellow-600`)
   - `#13131a` -> `slate-950` (avaliar `bg-surface`/`bg-canvas`)
   - `#353040` -> `slate-900` (avaliar `border-subtle`)
   - `#b5b1f4` -> `violet-300`
   - `#8a84ec` -> `violet-500`

3. Preservar:
   - estrutura, eventos, props e logica existente
   - acessibilidade e comportamento interativo
   - consistencia com padrao dominante no projeto

## Guardrails

- Nao introduzir novos HEX hardcoded sem justificativa.
- Nao alterar comportamento funcional para resolver apenas estilo.
- Nao misturar padroes de nomenclatura no mesmo componente sem motivo claro.
- Nao assumir equivalencias semanticas sem validar intencao visual.

## Fallbacks

- Se nao houver token semantico equivalente, usar token primitivo mais proximo.
- Se nao houver primitivo adequado, manter valor atual temporariamente e registrar pendencia.
- Em casos de branding/ilustracao (ex.: SVGs de marca), excecao pode ser aceita com justificativa no relatorio.

## Definition of Done

- [ ] Nenhum novo HEX hardcoded foi introduzido no escopo alterado.
- [ ] Estados visuais e interativos foram preservados.
- [ ] Tokens semanticos foram priorizados sobre primitivos quando possivel.
- [ ] Todo fallback primitivo foi usado apenas quando necessario e documentado.
- [ ] Pendencias de tokenizacao foram registradas quando aplicavel.

## Example

Input:

- Escopo: `packages/webkit/src/components/**`

Output esperado:

- Arquivos migrados dentro do escopo com substituicao de HEX/classes legadas.
- Relatorio com `antes -> depois`, excecoes e checklist final.
