// THE POSTING'S OWN PAGE — its description, its application form, and the band it closes on.
//
// Source: https://www.azion.com/en/careers/job/?id=07f7d281-aaac-465b-bf69-a66d43e3e704
// (Senior Platform Engineer), read on 2026-09-25 with the page RENDERED, not fetched: the
// description is an island that hydrates from an ATS endpoint, so the static HTML carries none of
// it and `curl` returns a page with one band on it. Every string below is that render's, verbatim.
//
// ── ONE BODY, 23 POSTINGS ──
//
// The source builds this page per posting from a live query. We read ONE of them. The header the
// page draws — title, department, location, arrangement, contract — is per-posting and comes from
// `careers.js`, so it is accurate for all 23; the DESCRIPTION below is the one we read, and every
// posting in this sample therefore opens on it. That is a property of the snapshot, stated here so
// nobody reads the sample as a feed. The same disclosure `careers.js` carries about its own list.
//
// ── THE COPY IS PORTUGUESE, AND STAYS ──
//
// The source writes this posting's body in Portuguese inside an otherwise English page. Translating
// it would be exactly the "improve the copy" move the translation rule forbids, so it is here as the
// source renders it. The chrome around it — the form's labels, the page's own controls — is ours,
// and follows the microcopy standard (see the component).

/** A section of the description: a heading, then its own paragraphs and lists, in source order. */
export const CAREERS_JOB_SECTIONS = [
  {
    title: 'Sobre a Azion',
    blocks: [
      {
        kind: 'text',
        text: 'Somos uma empresa global de tecnologia especializada em aplicações e segurança digital. Nossa plataforma ajuda empresas a operar com mais agilidade, reduzindo o tempo de resposta e aumentando a confiabilidade de seus sistemas.'
      },
      {
        kind: 'text',
        text: 'Na Azion, nosso propósito é simplificar a construção de aplicações e transformar o futuro com tecnologia de ponta. Aqui, você terá a chance de se desenvolver em um ambiente inovador, ao lado de um time de alta performance, atuando em desafios reais e criando soluções que fazem a diferença.'
      }
    ]
  },
  {
    title: 'Sobre o Cargo',
    blocks: [
      {
        kind: 'text',
        text: 'Como Senior Platform Quality Engineer na Azion, você fará parte do time responsável por transformar qualidade em uma capacidade nativa da plataforma de engenharia, atuando na construção de automações, ferramentas internas e padrões que eliminem dependências manuais no ciclo de desenvolvimento. Este não é um papel de QA tradicional. Procuramos alguém com forte mentalidade de engenharia, automação e plataforma, capaz de atuar na implementação de processos Shift-Left e Quality Engineering, utilizando CI/CD, testes automatizados, Infrastructure as Code e IA Generativa para acelerar entregas com segurança e confiabilidade.'
      },
      {
        kind: 'text',
        text: 'Você trabalhará em parceria com times de desenvolvimento, plataforma e infraestrutura para criar ferramentas de autoatendimento, pipelines padronizados, automações de release e mecanismos automatizados de garantia de qualidade em uma plataforma distribuída globalmente. A Azion possui uma cultura AI-first: o uso de ferramentas de IA é mandatório no dia a dia, incluindo AI coders, automações baseadas em LLMs e agentes de produtividade para desenvolvimento, debugging, documentação e aceleração operacional.'
      }
    ]
  },
  {
    title: 'Principais Desafios',
    blocks: [
      {
        kind: 'list',
        items: [
          'Construir e evoluir pipelines de CI/CD padronizados para testes, validação e releases automatizados;',
          'Implementar práticas de Shift-Left e Quality Engineering em conjunto com os times de desenvolvimento;',
          'Desenvolver frameworks e ferramentas internas de automação de qualidade e testes;',
          'Criar mecanismos de self-service via Internal Developer Platform (IDP), utilizando ferramentas como Backstage e Coder;',
          'Automatizar testes funcionais, integração, end-to-end e não-funcionais;',
          'Implementar validações automatizadas de qualidade, conformidade e segurança utilizando Policy-as-Code;',
          'Atuar na automação de releases e governança de deploys em ambientes complexos;',
          'Evoluir processos de observabilidade e métricas de qualidade de software;',
          'Guiar desenvolvedores na adoção de boas práticas de testes e automação;',
          'Utilizar IA Generativa para acelerar desenvolvimento de testes, automações, documentação e produtividade operacional;',
          'Colaborar com times de plataforma, desenvolvimento e infraestrutura para criar workflows escaláveis e resilientes.'
        ]
      }
    ]
  },
  {
    title: 'Requisitos Mínimos',
    blocks: [
      {
        kind: 'list',
        items: [
          'Experiência com automação de testes e Quality Engineering;',
          'Experiência sólida com CI/CD e automação de pipelines;',
          'Experiência prática com GitOps e ferramentas como ArgoCD;',
          'Conhecimento em GitHub Actions, AWX, GitLab CI ou ferramentas similares;',
          'Experiência com frameworks de testes automatizados como Cypress, Playwright, Vitest ou similares;',
          'Capacidade de desenvolver ferramentas e automações utilizando JavaScript/TypeScript, Python ou Go;',
          'Conhecimento de Linux, containers e Docker;',
          'Vivência com troubleshooting de ambientes distribuídos e workflows de entrega contínua;',
          'Uso ativo de ferramentas de IA para desenvolvimento, automação e produtividade;',
          'Mentalidade orientada a plataforma, automação e melhoria contínua.'
        ]
      }
    ]
  },
  {
    title: 'Qualificações Desejáveis',
    blocks: [
      {
        kind: 'list',
        items: [
          'Experiência com testes não-funcionais e performance testing utilizando K6;',
          'Conhecimento em Contract Testing (Pact);',
          'Experiência com Internal Developer Platforms (Backstage, Coder);',
          'Vivência com Policy-as-Code e Open Policy Agent (OPA);',
          'Conhecimento em Infrastructure as Code (Terraform, Pulumi);',
          'Experiência com Kubernetes e ambientes híbridos;',
          'Conhecimento em ferramentas de segurança de aplicações (SAST, DAST, IAST);',
          'Experiência com observabilidade e métricas de qualidade;',
          'Uso avançado de IA: AI agents, automação via APIs de LLMs, prompting avançado e integração de IA em workflows de engenharia.'
        ]
      }
    ]
  },
  {
    title: 'Benefícios & Azion Way of Life',
    blocks: [
      {
        kind: 'list',
        items: [
          'Modelo de contratação CLT;',
          'Plano de saúde e odontológico;',
          'VR e VA flexível (Cartão Flash), inclusive em período de férias;',
          'Vale-transporte sem desconto em folha;',
          'Hackathons anuais internos;',
          'Auxílio mobilidade (valor adicional para deslocamento);',
          'Freestyle (incentivo para customização da estação de trabalho);',
          'Stock options (conforme política);',
          'Birthday day off;',
          'TotalPass;',
          'Horário de trabalho flexível (flexível mesmo);',
          'Programa Nômade para trabalhar de onde quiser por até 30 dias no ano (conforme política);',
          'Programa de Intercâmbio internacional anual.'
        ]
      }
    ]
  },
  {
    title: 'Modelo FlexWork',
    blocks: [
      {
        kind: 'text',
        text: 'Oferecemos um modelo de FlexWork que prioriza o aculturamento e a colaboração. Nos primeiros três meses, você trabalhará on-site no escritório local, uma etapa essencial para construir relacionamentos sólidos e uma conexão genuína com nossos valores e objetivos. Acreditamos que essa imersão inicial não só fortalece a equipe, mas também impulsiona a criatividade e a inovação.'
      },
      {
        kind: 'text',
        text: 'Após esse período, você terá a possibilidade de aplicar para o modelo híbrido, trabalhando presencialmente pelo menos três vezes por semana. Essa abordagem equilibra a interação presencial e a autonomia, criando um ambiente de trabalho dinâmico e produtivo.'
      },
      {
        kind: 'text',
        text: 'Na Azion, todas as candidaturas são bem-vindas, independentemente de gênero, orientação sexual, idade, gravidez, deficiência, etnia, cor, país de origem ou religião. Acreditamos que um ambiente inclusivo contribui para o nosso sucesso e que o respeito está presente em todas as nossas relações.'
      },
      {
        kind: 'text',
        text: 'Venha fazer parte da nossa equipe! Estamos ansiosos para conhecê-lo e trilhar juntos um caminho de sucesso na tecnologia!'
      }
    ]
  }
]

/**
 * The application form the source renders under the description. Its LABELS are ours: the source
 * writes `Name:`, `Email Address:`, `State/Province:` — a trailing colon on a label and title case
 * are both banned by the microcopy standard, and a form's labels are interface chrome we own rather
 * than the posting's editorial copy. The FIELDS, their order, their input types and the resume's
 * accepted formats are the source's, read off its own controls.
 *
 * `kind` is the webkit control each one composes; `helper` is its guidance line, which for the
 * resume is the source's own format note (it lived inside that label, where the standard says a
 * constraint does not belong).
 */
export const CAREERS_JOB_FORM = {
  title: 'Do you want to work, teach and learn at Azion?',
  description: 'Fill the form to apply for this position.',
  submit: 'Submit application',
  fields: [
    { key: 'name', label: 'Name', kind: 'text', required: true, autocomplete: 'name' },
    {
      key: 'email',
      label: 'Email address',
      kind: 'email',
      required: true,
      autocomplete: 'email',
      helper: 'We answer every application at this address.'
    },
    { key: 'phone', label: 'Contact number', kind: 'phone', required: true },
    {
      key: 'resume',
      label: 'Resume',
      kind: 'file',
      required: true,
      accept: 'application/pdf,.docx,.doc',
      helper: '.pdf, .docx, .doc (limit 5MB)'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn profile URL',
      kind: 'url',
      required: false,
      helper: 'Optional.'
    },
    { key: 'salary', label: 'Desired salary', kind: 'text', required: false, helper: 'Optional.' },
    {
      key: 'country',
      label: 'Country',
      kind: 'text',
      required: true,
      autocomplete: 'country-name'
    },
    {
      key: 'state',
      label: 'State or province',
      kind: 'text',
      required: true,
      autocomplete: 'address-level1'
    },
    { key: 'city', label: 'City', kind: 'text', required: true, autocomplete: 'address-level2' }
  ]
}

/** What the source says under the form, and the one way out of the page it offers. */
export const CAREERS_JOB_CLOSING = {
  title: 'Not a match?',
  description: 'Keep looking for other positions. Why not in different areas too?',
  action: 'See all jobs'
}

/** What the reader is told once the application is in. Ours: the source posts to its own ATS. */
export const CAREERS_JOB_SENT = {
  title: 'Application sent.',
  description: 'We received your application and will answer at the address you gave us.'
}
