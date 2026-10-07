import { COMPLIANCE_CERTIFICATIONS, COMPLIANCE_PRIVACY_LINKS } from '../compliance.js'

export const COMPLIANCE_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-carousel',
    title: 'Certificações e conformidade da Azion',
    description:
      'A Azion adere a rigorosos padrões de segurança, disponibilidade e privacidade para que os clientes possam adotar nossos serviços com confiança.',
    actions: [
      {
        label: 'Contato',
        href: 'https://www.azion.com/pt-br/contato/',
        kind: 'secondary',
        external: true
      },
      {
        label: 'Ver Matriz de Responsabilidade',
        href: 'https://www.azion.com/pt-br/documentacao/responsabilidade-compartilhada/',
        kind: 'outlined',
        trailing: true,
        external: true
      }
    ]
  },
  {
    section: 'ComplianceBadges',
    eyebrow: '',
    title:
      'Segurança e Conformidade são responsabilidades compartilhadas entre a Azion e o cliente.',
    description:
      'Esse modelo compartilhado pode ajudar a aliviar o fardo operacional do cliente, pois a Azion opera, gerencia e controla os componentes desde o sistema operacional e camada de virtualização, incluindo atualizações e patches de segurança, até a segurança física das instalações onde o serviço opera.',
    certifications: COMPLIANCE_CERTIFICATIONS,
    more: null,
    ariaLabel: 'Certificações de conformidade'
  },
  {
    section: 'ResourceGrid',
    eyebrow: 'Privacidade de dados',
    title: 'Regulamentações para proteção de dados',
    description:
      'A Azion entende que a privacidade dos dados de nossos clientes e usuários finais é fundamental. Temos compromisso com a proteção de dados e nossos controles se baseiam em práticas robustas, alinhados às principais legislações internacionais, como a Lei Geral de Proteção de Dados (LGPD) e o Regulamento Geral de Proteção de Dados da União Europeia (GDPR). Não comercializamos dados pessoais e os utilizamos exclusivamente para a execução dos nossos serviços. Oferecemos aos usuários dos nossos produtos a capacidade de acessar, corrigir e excluir suas informações pessoais, aderindo ao princípio de que nossos clientes e usuários finais devem ter controle total sobre os dados de sua propriedade que transitam pela nossa rede. Convidamos você a explorar nossas Perguntas Frequentes sobre Privacidade de Dados ou consultar nossa política de privacidade detalhada.',
    items: COMPLIANCE_PRIVACY_LINKS.map((link) => ({
      title: link.label,
      description: '',
      href: link.href
    })),
    actions: []
  },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
