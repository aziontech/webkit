import { PRODUCT_DOCS } from './product-pages.js'

export const cliBand = ({ title, description, script = 'deploy' }) => ({
  section: 'CliTerminal',
  eyebrow: 'Azion CLI',
  title,
  description,
  script,
  actions: [{ label: 'Install the CLI', href: PRODUCT_DOCS, kind: 'outlined', trailing: true }]
})
