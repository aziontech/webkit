// Small shared helpers for the rules.

/** ESLint 9 exposes context.cwd; older versions have getCwd(). */
export function ctxCwd(context) {
  return (
    context.cwd || (typeof context.getCwd === 'function' ? context.getCwd() : null) || process.cwd()
  )
}

/** vue-eslint-parser hook, when the file was parsed as an SFC. */
export function templateBodyVisitorFactory(context) {
  const services = context.sourceCode?.parserServices || context.parserServices
  return services && typeof services.defineTemplateBodyVisitor === 'function'
    ? services.defineTemplateBodyVisitor.bind(services)
    : null
}
