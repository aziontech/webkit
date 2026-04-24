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
