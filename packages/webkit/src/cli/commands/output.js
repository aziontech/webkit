export const json = (value) => process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)

export const useColor = () =>
  !process.env.NO_COLOR && (Boolean(process.env.FORCE_COLOR) || Boolean(process.stdout.isTTY))

export const out = (text) => process.stdout.write(text)
export const err = (text) => process.stderr.write(text)
