import { gatedForm } from './gated-form.js'
import { learnGrid } from './learn-grid.js'

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
    learnGrid(
      learn.map((text, index) => ({ title: LEARN_TITLES[index], description: text })),
      { title: bandTitle }
    ),
    { section: 'ClosingCallToAction', kind: 'frame' }
  ]
}
