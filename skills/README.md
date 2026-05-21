# Skills

Colecao de skills operacionais para acelerar tarefas recorrentes no monorepo.

## Quando usar

- Quando uma tarefa for repetitiva e exigir as mesmas decisoes de implementacao.
- Quando for importante padronizar formato de saida, checklist e criterio de conclusao.
- Quando houver risco de divergencia entre PRs para o mesmo tipo de mudanca.

## Convencoes

- Cada skill deve viver em um arquivo unico em `skills/*.md`.
- Cada skill deve seguir o formato padrao descrito em `skills/_template.md`.
- Toda nova skill ou atualizacao deve seguir `skills/CONTRIBUTING.md`.
- Skills devem ser orientadas por escopo (diretorio/glob), nunca por arquivo fixo.

## Catalogo

- `migracao-azion-theme`: migra estilos legados (Tailwind padrao + HEX hardcoded) para tokens do `@aziontech/theme`, com foco em semantica, consistencia visual e suporte a light/dark mode.
- `component-create`: cria componentes em `packages/webkit/src/components/webkit/<category>/<name>/` (TypeScript tipado com JSDoc, Composition Pattern so quando faz sentido conforme shadcn-vue) seguindo `Design.md` (typography via classes geradas, tokens semanticos) e os canonicos (button/icon-button/card-pricing). Inclui `data-testid` BEM-style, slots tipados, v-model + estados controlados/nao-controlados, story Storybook completa (argTypes/args/parameters/actions/a11y/decorators + play function), padroes shadcn-vue (`asChild`, `data-state`, `VariantProps`, `cn`) e Figma Code Connect.

## Roteamento de intencao -> skill

Tabela para agentes/AI decidirem qual skill aplicar ao detectar a intencao do usuario. Antes de escrever qualquer arquivo, verifique se o pedido cai em uma das linhas abaixo e invoque a skill correspondente automaticamente (sem esperar mencao explicita).

| Quando o pedido envolve...                                                                                                                                                                                                                                                                  | Caminho do(s) arquivo(s)                                                                                     | Skill a invocar        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------- |
| Criar/modificar componente UI ou story (verbos `criar`/`crie`/`gerar`/`adicionar`/`novo` + substantivo UI como `botao`/`dialog`/`drawer`/`tooltip`/`tabs`/`card`/`input`/`dropdown`/...) OU edicao de qualquer `.vue` em `packages/webkit/src/components/webkit/**` OU link Figma no pedido | `packages/webkit/src/components/webkit/<category>/<name>/` + `apps/storybook/src/stories/webkit/<category>/` | `component-create`     |
| Migrar HEX hardcoded ou classes Tailwind legadas para tokens do `@aziontech/theme` em codigo existente                                                                                                                                                                                      | qualquer escopo informado (`packages/webkit/src/**`)                                                         | `migracao-azion-theme` |

**Regra geral:** ao detectar a intencao, o agente sinaliza ao usuario qual skill vai aplicar antes de tocar em arquivos. Se a intencao for ambigua, perguntar antes de criar.
