// Asset modules. A bundler resolves an `.svg` import to the emitted file's URL; TypeScript
// needs telling, since there is no type beside an image. Declared in a `.ts` rather than a
// `.d.ts` because `.d.ts` is a gitignored build artifact here and tsconfig excludes it.
declare module '*.svg' {
  const url: string
  export default url
}
