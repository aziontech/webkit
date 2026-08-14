import type * as Monaco from 'monaco-editor'
import { language as javascriptLanguage } from 'monaco-editor/languages/definitions/javascript/javascript'
import { language as typescriptLanguage } from 'monaco-editor/languages/definitions/typescript/typescript'

/**
 * Monaco tokenizes JS/TS with a Monarch grammar — regexes, not a parser — and that
 * grammar has **no scope for a function call**. Every `router.get(...)`, `json(...)`,
 * `handle(...)` comes out as a plain `identifier`, so `--code-sintax-function` (the
 * primary orange) was never painted at all, while the CodeMirror editor next door gets
 * it from Lezer's `tags.function(variableName)`.
 *
 * The two editors have to read the same, so the grammar is extended here with the two
 * distinctions Lezer makes and Monarch does not:
 *
 * - a call — an identifier immediately followed by `(` — is `function`;
 * - a boolean / null literal is `constant`, not a keyword (Lezer's `tags.bool`,
 *   `tags.null`, which this project's CodeMirror theme paints with the type token).
 *
 * Capitalised names are deliberately left to Monarch's own `[A-Z]\w*` rule, so
 * `new Router()` keeps the type color exactly as CodeMirror renders it.
 */

/**
 * Keywords that can be followed by `(` and are still keywords — `if (`, `for (`,
 * `return (`, `typeof (`. Everything else followed by `(` is a call. Note this is
 * deliberately narrower than Monarch's own `keywords` list: `get`, `set` and
 * `constructor` live there too, and in a call position they are methods, which is what
 * Lezer reports and what this list therefore has to let through.
 */
const CONTROL_KEYWORDS = [
  // `async (r) => …` and `export default (x) => …` both put a keyword directly before
  // a paren, which the call rule would otherwise read as an invocation.
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

/**
 * A member call — `promise.catch(...)`, `event.respondWith(...)`. Matched ahead of the
 * bare-call rule and with no keyword check at all: after a dot, a name is a method even
 * when it collides with a keyword, which is what makes `.catch(` a call while
 * `catch (err)` stays a keyword. The dot is emitted as its own token so it keeps the
 * punctuation color.
 */
const MEMBER_CALL_RULE = [/(\.)(\s*)([a-zA-Z_$][\w$]*)(?=\s*\()/, ['delimiter', '', 'function']]

/** A bare call — `addEventListener(...)`. Same shape as Monarch's identifier rule. */
const CALL_RULE = [
  /#?[a-z_$][\w$]*(?=\s*\()/,
  { cases: { '@controlKeywords': 'keyword', '@default': 'function' } }
]

/** Boolean / null literals, which Monarch would otherwise fold into `keyword`. */
const LITERAL_RULE = [/\b(?:true|false|null|undefined)\b/, 'constant']

/**
 * `CACHE_TTL`, `REGIONS` — a CONSTANT_CASE name is a value, never a type, but Monarch's
 * blanket "starts with a capital → type" rule paints it like a class. Two characters
 * minimum so a bare generic `T` is untouched, and the lookahead makes `HTTPServer` fail
 * the match and fall through to the type rule where it belongs.
 */
const CONSTANT_CASE_RULE = [/[A-Z][A-Z0-9_$]+(?![\w$])/, 'identifier']

type MonarchLanguage = Monaco.languages.IMonarchLanguage & {
  tokenizer: Record<string, unknown[]>
}

/**
 * Returns a copy of a Monarch grammar with the two rules prepended to its `common`
 * state. The source grammar is a shared module object — it is never mutated.
 */
function withAzionRules(base: MonarchLanguage): MonarchLanguage {
  return {
    ...base,
    controlKeywords: CONTROL_KEYWORDS,
    tokenizer: {
      ...base.tokenizer,
      // Ahead of Monarch's identifier rule, which would otherwise claim both.
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

/**
 * Registers the extended grammars.
 *
 * Timing matters: Monaco registers these languages with a lazy *factory*, and its
 * registry only consults that factory when no provider is registered directly. Calling
 * this at module load — before any model exists — means the direct registration is
 * already in place and the built-in factory never runs, so nothing can overwrite it
 * later. Registering after an editor mounts would work too, but only by replacing a
 * grammar that had already tokenized once.
 */
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
