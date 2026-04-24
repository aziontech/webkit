# Contributing Skills

Guia para criacao e manutencao de skills em `skills/`.

## Objetivo

Garantir que todas as skills tenham formato consistente, regras claras e resultado auditavel.

## Regras obrigatorias

- Usar `skills/_template.md` como estrutura base.
- Definir entradas e saidas de forma objetiva.
- Declarar guardrails explicitos (o que a skill nunca deve fazer).
- Incluir criterio de conclusao verificavel (Definition of Done).
- Evitar acoplamento com arquivo unico; usar escopo por diretorio/glob.

## Processo recomendado

1. Criar a skill a partir do template.
2. Revisar se as secoes obrigatorias foram preenchidas.
3. Validar se a skill aponta para fontes de verdade (docs, guias, padroes do repo).
4. Incluir ao menos um exemplo de uso.
5. Atualizar `skills/README.md` com a descricao curta no catalogo.

## Checklist de revisao

- [ ] Nome e objetivo claros.
- [ ] Entradas e saidas bem definidas.
- [ ] Workflow sequencial sem ambiguidades.
- [ ] Regras de decisao e fallback documentadas.
- [ ] Guardrails cobrindo operacoes de risco.
- [ ] Definition of Done mensuravel.
- [ ] Exemplo de uso incluso.
