import base from './vitest.config'

const browser = (process.env.BROWSER || 'firefox') as 'chromium' | 'firefox' | 'webkit'
base.test!.browser!.instances = [{ browser }]
export default base
