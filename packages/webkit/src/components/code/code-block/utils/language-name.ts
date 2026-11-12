const LANGUAGE_NAMES: Record<string, string> = {
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Shell',
  console: 'Shell',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  javascript: 'JavaScript',
  js: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  jsx: 'JSX',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  vue: 'Vue',
  json: 'JSON',
  jsonc: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  ini: 'INI',
  env: 'Env',
  dotenv: 'Env',
  html: 'HTML',
  xml: 'XML',
  css: 'CSS',
  scss: 'SCSS',
  hcl: 'HCL',
  terraform: 'Terraform',
  tf: 'Terraform',
  graphql: 'GraphQL',
  gql: 'GraphQL',
  markdown: 'Markdown',
  md: 'Markdown',
  python: 'Python',
  py: 'Python',
  go: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  java: 'Java',
  ruby: 'Ruby',
  rb: 'Ruby',
  php: 'PHP',
  sql: 'SQL',
  http: 'HTTP',
  diff: 'Diff',
  dockerfile: 'Dockerfile',
  docker: 'Dockerfile',
  text: 'Text',
  txt: 'Text',
  plaintext: 'Text',
  plain: 'Text'
}

export const SHELL_LANGUAGES: readonly string[] = ['bash', 'sh', 'shell', 'zsh', 'console']

export const isShellLanguage = (language?: string): boolean =>
  SHELL_LANGUAGES.includes((language ?? '').trim().toLowerCase())

export const languageName = (language?: string): string => {
  const key = (language ?? '').trim().toLowerCase()
  if (!key) return 'Text'
  return (
    LANGUAGE_NAMES[key] ??
    (key.length <= 4 ? key.toUpperCase() : key[0].toUpperCase() + key.slice(1))
  )
}

export const SHELL_PROMPT = /^\$ /

export const stripShellPrompts = (code: string, language?: string): string => {
  if (!isShellLanguage(language)) return code
  const lines = code.split('\n')
  if (!lines.some((line) => SHELL_PROMPT.test(line))) return code
  const kept: string[] = []
  let continues = false
  for (const line of lines) {
    if (SHELL_PROMPT.test(line)) {
      kept.push(line.replace(SHELL_PROMPT, ''))
      continues = /\\$/.test(line)
    } else if (continues) {
      kept.push(line)
      continues = /\\$/.test(line)
    }
  }
  return kept.join('\n')
}
