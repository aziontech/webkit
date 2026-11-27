export const isComposableFile = (filename) =>
  typeof filename === 'string' &&
  /(^|[\\/])use-[^\\/]*\.(ts|js)$/.test(filename) &&
  !/\.(test|spec|stories|d)\.(ts|js)$/.test(filename)

export const isTsFile = (filename) => /\.ts$/.test(filename)

export function calleeName(node) {
  const callee = node.callee
  if (!callee) return null
  if (callee.type === 'Identifier') return callee.name
  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier'
  ) {
    return callee.property.name
  }
  return null
}
