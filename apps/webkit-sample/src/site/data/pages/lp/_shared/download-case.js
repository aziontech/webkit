import { gatedForm } from './gated-form.js'

const LEARN_ICONS = ['pi pi-book', 'pi pi-bullseye', 'pi pi-sparkles', 'pi pi-user']

const LEARN_TITLES = [
  'O que você vai aprender',
  'Para quem é conteúdo',
  'Por que este conteúdo é importante',
  'Como aplicar na prática'
]

const FORM_TITLE = 'Preencha as informações para acessar o conteúdo'

export function downloadCasePage({ title, description, bandTitle, learn }) {
  return [
    {
      section: 'HeroForm',
      eyebrow: 'Case de Sucesso',
      title,
      description,
      ...gatedForm(FORM_TITLE)
    },
    {
      section: 'CapabilityGrid',
      title: bandTitle,
      columns: 4,
      items: learn.map((text, index) => ({
        icon: LEARN_ICONS[index],
        title: LEARN_TITLES[index],
        description: text
      }))
    },
    { section: 'ClosingCallToAction', kind: 'frame' }
  ]
}
