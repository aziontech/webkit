export function ctxCwd(context) {
  return (
    context.cwd || (typeof context.getCwd === 'function' ? context.getCwd() : null) || process.cwd()
  )
}

export function templateBodyVisitorFactory(context) {
  const services = context.sourceCode?.parserServices || context.parserServices
  return services && typeof services.defineTemplateBodyVisitor === 'function'
    ? services.defineTemplateBodyVisitor.bind(services)
    : null
}
