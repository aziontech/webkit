import { PT_BR_FORM_MESSAGES } from './pt-br-forms'

/** The pt-BR form that gates content behind a name and an e-mail. */
export const gatedForm = (formTitle) => ({
  formLabel: formTitle,
  carouselMarks: [],
  country: 'BR',
  labels: { firstName: 'Nome', lastName: 'Sobrenome', email: 'E-mail', submit: 'Enviar' },
  messages: PT_BR_FORM_MESSAGES
})
