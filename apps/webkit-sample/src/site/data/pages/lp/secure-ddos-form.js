import gdprBadge from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
import lgpdBadge from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
import pciDssBadge from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
import socBadge from '@aziontech/webkit/assets/soc-symbol-color.svg'
import { CLIENT_STRIP_RADWARE } from '@shared/ui/brand/strips.js'

import { campaignClosing } from './_shared/campaign-page'
import { GPA_ENTERPRISE_PT_BR, quoteWall } from './_shared/lead-quotes'
import { pageSpecialistForm } from './_shared/pt-br-forms'
import { CLIENTS_ACTION, SECURITY_PRIMITIVES } from './_shared/security-proof.js'

const EXPERT = 'Fale com um especialista'
const CONTACT = 'https://www.azion.com/pt-br/contato/'

const FAQ = [
  {
    value: 'firewall',
    question: 'Contra o que o Firewall da Azion protege?',
    answer:
      'O Firewall da Azion ajuda a proteger aplicações e API contra ataques web comuns como SQL injection, XSS, CSRF, inclusão remota de arquivos e abuso de protocolo. Ele combina proteções WAF gerenciadas com regras personalizadas e rate limiting para reduzir risco antes que o tráfego alcance sua infraestrutura.'
  },
  {
    value: 'network-shield',
    question: 'Como o Network Shield protege minha origem?',
    answer:
      'O Network Shield ajuda a manter sua origem privada e mais difícil de ser acessada diretamente da internet pública. Você pode restringir acesso com URLs assinadas, IP allowlisting, conectividade em backbone privado e monitoramento de origem para reduzir exposição e melhorar a resiliência.'
  },
  {
    value: 'firewall-vs-network-shield',
    question: 'Qual é a diferença entre Firewall e Network Shield?',
    answer:
      'Firewall é o recurso de segurança unificado da Azion para proteger workloads em sua infraestrutura distribuída globalmente. Ele combina módulos como Web Application Firewall, Bot Manager, Network Shield e Functions. Network Shield é um desses módulos, focado em políticas programáveis de camada de rede para controlar quem pode acessar suas aplicações e de onde.'
  },
  {
    value: 'custom-logic',
    question: 'Posso criar lógica de segurança personalizada?',
    answer:
      'Sim. Você pode construir proteções personalizadas com Firewall Rules Engine e Functions usando atributos de requisição como headers, cookies, query strings, URI, IP, ASN e geolocalização. Isso permite bloquear, limitar taxa, retornar respostas personalizadas ou executar JavaScript em toda a rede distribuída.'
  },
  {
    value: 'api-gateway',
    question: 'Como o API Gateway melhora a segurança de API?',
    answer:
      'O API Gateway cria um ponto de entrada centralizado para tráfego de API, tornando mais fácil aplicar autenticação, roteamento, rate limiting e controles de requisição com consistência. Ele ajuda equipes de segurança e desenvolvedores a aplicar políticas em um único ponto enquanto melhora a visibilidade entre serviços.'
  },
  {
    value: 'ai-threat-detection',
    question: 'Como funciona a detecção e remoção de ameaças com AI?',
    answer:
      'A Azion pode usar modelos de AI para analisar ativos digitais, detectar phishing, abuso e conteúdo malicioso e automatizar classificação e fluxos de resposta. Isso ajuda equipes de segurança a identificar ameaças mais rápido e coordenar ações de remoção em ambientes distribuídos.'
  },
  {
    value: 'certifications',
    question: 'Quais certificações a Azion fornece?',
    answer:
      'A Azion fornece certificações como SOC 2 Type 2 e PCI DSS para apoiar clientes com requisitos de segurança, governança e conformidade. Essas certificações ajudam a demonstrar controles operacionais para proteger aplicações, API e ativos digitais.'
  }
]

export default {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/secure-ddos-form/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'Segurança',
      title: 'Proteção DDoS que detecta e mitiga ataques em menos de 3 segundos',
      description:
        'Segurança automatizada nas camadas 3, 4, 6 e 7 com SLA de 100% de disponibilidade. Largura de banda ilimitada de proteção.',
      ...pageSpecialistForm(EXPERT),
      carouselMarks: CLIENT_STRIP_RADWARE
    },
    {
      section: 'MediaSplitBand',
      gap: false,
      title: 'Detecte ameaças antes de alcançarem sua aplicação',
      illustration: 'detect-and-classify',
      illustrationLabel: 'Ilustração',
      actions: [
        { label: 'Comece grátis', href: 'https://console.azion.com/signup', kind: 'primary' },
        { label: EXPERT, href: CONTACT, kind: 'secondary' }
      ]
    },
    {
      section: 'CapabilityGrid',
      gap: false,
      items: [
        {
          icon: 'pi pi-cog',
          title: 'Segurança AI Native',
          description: 'Detecte bots e ataques automaticamente antes de atingirem sua aplicação'
        },
        {
          icon: 'pi pi-globe',
          title: 'Cobertura global',
          description: 'Proteja e distribua seu tráfego em mais de 100 localizações'
        },
        {
          icon: 'pi pi-bolt',
          title: 'Conformidade enterprise',
          description: 'Certificada nativamente para SOC 2 Type 2 / SOC 3, PCI e outras.'
        }
      ]
    },
    {
      section: 'MediaSplitStack',
      eyebrow: 'Seguro por padrão',
      title: 'A plataforma de segurança para aplicações modernas',
      bands: [
        {
          title: 'Proteção contra DDoS',
          description:
            'Mitigação adaptativa de DDoS. Proteção de DNS nativa contra DDoS, spoofing, poisoning e hijacking.',
          illustration: 'dns-protection',
          illustrationLabel: 'Proteção nativa contra DDoS'
        },
        {
          title: 'Firewall',
          description:
            'WAF gerenciado. Defesa de nível enterprise contra ameaças zero-day e vulnerabilidades emergentes com inteligência de ameaças compartilhada.',
          illustration: 'enable-owasp-protection-with-customizable-rules',
          illustrationLabel: 'Firewall'
        },
        {
          title: 'Gestão de bots',
          description:
            'Use AI para se proteger de bots maliciosos. Classifique bots com inteligência artificial. Bloqueie scrapers, credential stuffing e DDoS automaticamente. Controle seu tráfego.',
          illustration: 'detect-and-classify',
          illustrationLabel: 'Gestão de bots'
        },
        {
          title: 'Proteção de rede',
          description:
            'Proteja antes de alcançar sua aplicação. Restrinja o acesso à origem para tráfego confiável e reduza a exposição direta.',
          illustration: 'network-lists-rules-engine',
          illustrationLabel: 'Proteção de rede'
        },
        {
          title: 'Certificados',
          description:
            'Simplifique o gerenciamento de certificados. Traga seu próprio certificado ou emita automaticamente um novo certificado grátis.',
          illustration: 'certificates',
          illustrationLabel: 'Gerenciamento de certificados'
        }
      ]
    },
    {
      section: 'ComplianceBadges',
      eyebrow: 'A gente cobre isso para você',
      title: 'Conforme suas necessidades atuais e futuras',
      description: '',
      ariaLabel: 'Certificações',
      certifications: [
        { label: 'SOC 2 Type 2', badge: socBadge, alt: 'Selo AICPA SOC 2 Type 2' },
        { label: 'SOC 3', badge: socBadge, alt: 'Selo AICPA SOC 3' },
        { label: 'PCI DSS', badge: pciDssBadge, alt: 'Selo PCI DSS' },
        { label: 'GDPR', badge: gdprBadge, alt: 'GDPR' },
        { label: 'LGPD', badge: lgpdBadge, alt: 'Selo LGPD' }
      ],
      more: null
    },
    {
      section: 'ClientQuotes',
      eyebrow: 'Confiada por enterprises',
      title: 'Testada em campo nos maiores bancos e E-commerces',
      ariaLabel: 'Histórias de clientes',
      quotes: quoteWall(GPA_ENTERPRISE_PT_BR),
      actions: [CLIENTS_ACTION]
    },
    {
      section: 'PlatformDirectory',
      title: 'Todos os primitives de segurança que você precisa',
      groups: SECURITY_PRIMITIVES
    },
    { section: 'FaqSection', title: 'Perguntas frequentes', items: FAQ },
    campaignClosing('pt-BR')
  ]
}
