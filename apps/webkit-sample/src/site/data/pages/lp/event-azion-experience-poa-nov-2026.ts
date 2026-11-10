import type { LandingPage } from '.'
import { campaignClosing } from './_shared/campaign-page'
import { PT_BR_FORM_MESSAGES } from './_shared/pt-br-forms'

const ROLES = [
  'Administrator',
  'Advisor',
  'Analyst',
  'Architect',
  'Assistant',
  'Auditor',
  'Buyer',
  'CDO - Chief Data Officer',
  'CDO - Chief Digital Officer',
  'CEO – Chief Executive Officer',
  'CFO – Chief Financial Officer',
  'CHRO – Chief Human Resources Officer',
  'CIO - Chief Information Officer',
  'CISO - Chief Information Security Officer',
  'CMO – Chief Marketing Officer',
  'Consultant',
  'Controller',
  'COO – Chief Operating Officer',
  'Coordinator',
  'CPO - Chief Product Owner',
  'CRO - Chief Revenue Officer',
  'CTO - Chief Technology Officer',
  'CXO - Chief Experience officer',
  'Dean',
  'Designer',
  'Developer',
  'Director',
  'Engineer',
  'Expert',
  'Founder',
  'Head',
  'Manager',
  'Owner',
  'Partner',
  'President',
  'Secretary',
  'Specialist',
  'Superintendent',
  'Supervisor',
  'Vice President'
].map((role) => ({ value: role, label: role }))

const FORM_TITLE = 'Confirme sua participação'

const page: LandingPage = {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/event-azion-experience-poa-nov-2026/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Azion Experience',
      title: 'O churrasco gaúcho em sua máxima evolução.',
      description:
        'Um jantar fechado, com cortes selecionados e uma degustação guiada durante a noite. No meio da mesa, uma conversa entre pares: como empresas estão movendo proteção, detecção e visibilidade para mais perto da requisição, antes que o problema chegue ao backend, e o que isso muda na equação de performance, segurança e custo. Formato descontraído, sem apresentação, sem palco, só troca real.',
      highlights: [
        {
          icon: 'pi pi-map-marker',
          title: 'Data e local',
          description: '',
          lines: ['16 de Novembro de 2026 — das 18h00 às 22h00', 'El Topador']
        },
        {
          icon: 'pi pi-pencil',
          title: 'Garanta sua vaga preenchendo o formulário.',
          description: ''
        },
        {
          icon: 'pi pi-exclamation-triangle',
          title: 'Vagas limitadas.',
          description: 'Convite pessoal e intransferível. Participação mediante confirmação.'
        }
      ],
      formLabel: FORM_TITLE,
      fields: ['role', 'phone'],
      roles: ROLES,
      questions: [
        {
          name: 'restricao_alimentar',
          label:
            'Possui alguma alergia, intolerância ou restrição alimentar que nossa equipe deva considerar durante o evento? Se sim, qual?',
          multiline: true
        },
        { name: 'quem_convidou', label: 'Quem te convidou para o evento?' },
        { name: 'restricao_motora', label: 'Possui alguma restrição motora?' }
      ],
      country: 'BR',
      carouselMarks: [],
      carouselLabel: '',
      labels: {
        firstName: 'Nome:',
        lastName: 'Sobrenome:',
        email: 'E-mail:',
        phone: 'Telefone',
        role: 'Cargo:',
        rolePlaceholder: 'Selecione seu cargo',
        company: 'Empresa:',
        submit: 'Inscreva-se'
      },
      messages: PT_BR_FORM_MESSAGES
    },
    { ...campaignClosing('pt-BR'), gap: true }
  ]
}

export default page
