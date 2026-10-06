import type * as Monaco from 'monaco-editor'
import { language as javascriptLanguage } from 'monaco-editor/languages/definitions/javascript/javascript'
import { language as typescriptLanguage } from 'monaco-editor/languages/definitions/typescript/typescript'

const CONTROL_KEYWORDS = [
  'async',
  'default',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'continue',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'of',
  'return',
  'super',
  'switch',
  'throw',
  'try',
  'typeof',
  'void',
  'while',
  'with',
  'yield'
]

const MEMBER_CALL_RULE = [/(\.)(\s*)([a-zA-Z_$][\w$]*)(?=\s*\()/, ['delimiter', '', 'function']]

const CALL_RULE = [
  /#?[a-z_$][\w$]*(?=\s*\()/,
  { cases: { '@controlKeywords': 'keyword', '@default': 'function' } }
]

const LITERAL_RULE = [/\b(?:true|false|null|undefined)\b/, 'constant']

const CONSTANT_CASE_RULE = [/[A-Z][A-Z0-9_$]+(?![\w$])/, 'identifier']

type MonarchLanguage = Monaco.languages.IMonarchLanguage & {
  tokenizer: Record<string, unknown[]>
}

function withAzionRules(base: MonarchLanguage): MonarchLanguage {
  return {
    ...base,
    controlKeywords: CONTROL_KEYWORDS,
    tokenizer: {
      ...base.tokenizer,
      common: [
        MEMBER_CALL_RULE,
        CALL_RULE,
        LITERAL_RULE,
        CONSTANT_CASE_RULE,
        ...base.tokenizer['common']
      ]
    }
  } as MonarchLanguage
}

export function applyAzionSyntax(monaco: typeof Monaco): void {
  monaco.languages.setMonarchTokensProvider(
    'javascript',
    withAzionRules(javascriptLanguage as MonarchLanguage)
  )
  monaco.languages.setMonarchTokensProvider(
    'typescript',
    withAzionRules(typescriptLanguage as MonarchLanguage)
  )
}
