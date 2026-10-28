// Field labels as the pt-BR landing pages' forms print them, colon included.

export const EMPLOYEE_COUNTS = ['1-200', '201-1000', '1000+'].map((count) => ({
  value: count,
  label: count
}))

export const PT_BR_FORM_MESSAGES = {
  required: 'Preencha este campo obrigatório.',
  invalidEmail: 'Digite um endereço de e-mail válido.',
  success: 'Mensagem enviada.',
  error: 'Não foi possível enviar a mensagem.',
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente'
}

const SPECIALIST_LABELS = {
  firstName: 'Nome:',
  lastName: 'Sobrenome:',
  email: 'E-mail:',
  role: 'Número de Funcionários',
  rolePlaceholder: 'Selecione',
  company: 'Empresa:',
  phone: 'Telefone',
  message: 'Mensagem',
  submit: 'Fale com um especialista'
}

/** The "talk to a specialist" form the pt-BR product landing pages open on. */
export const specialistForm = (formTitle: string) => ({
  formTitle,
  formLabel: formTitle,
  roles: EMPLOYEE_COUNTS,
  country: 'BR',
  labels: SPECIALIST_LABELS,
  messages: PT_BR_FORM_MESSAGES
})

export const SIGNUP = 'https://console.azion.com/signup/'
