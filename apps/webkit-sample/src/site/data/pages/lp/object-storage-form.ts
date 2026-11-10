import { PRODUCT_STACK } from '@shared/ui/brand/strips.js'

import type { LandingPage } from '.'
import { campaignClosing } from './_shared/campaign-page'
import { HEROSPARK_STORAGE_PT_BR, quoteWall } from './_shared/lead-quotes'
import { pageSpecialistForm } from './_shared/pt-br-forms'
import { CLIENTS_ACTION } from './_shared/security-proof.js'

const DOCS = 'https://www.azion.com/pt-br/documentacao/'

const IMPORT = 'import'

const CODE = `${IMPORT} { setupStorage } from 'azion/storage';
${IMPORT} type { AzionBucket, AzionStorageResponse } from 'azion/storage';

const { data: bucket, error }: AzionStorageResponse<AzionBucket> =
  await setupStorage({
    name: 'app-assets',
    workloads_access: 'read_write'
  });

if (error || !bucket) {
  throw new Error(error?.message ?? 'Failed to setup storage');
}

await bucket.createObject({
  key: 'config.json',
  content: JSON.stringify({ theme: 'dark' }),
  params: { content_type: 'application/json' }
});

console.log(\`Object uploaded to \${bucket.name}\`);`

const FAQ = [
  {
    value: 'o-que-e',
    question: 'O que é Object Storage?',
    answer:
      'Azion Object Storage é armazenamento compatível com S3 para dados não estruturados. Recursos principais incluem: zero custos de egress entre serviços Azion, 99.9% de disponibilidade, bucket-como-origem para sites estáticos, suporte a multipart upload, e integração nativa com Functions. Armazene arquivos, mídia, logs e assets de aplicação com custos previsíveis.'
  },
  {
    value: 'bucket',
    question: 'O que é um bucket no Object Storage?',
    answer:
      'Um bucket é um container de nível superior usado para organizar objetos. Buckets também podem ser usados como origem para Applications, incluindo entrega de sites estáticos.'
  },
  {
    value: 'object-key',
    question: 'O que é uma object key e ela pode ser alterada?',
    answer:
      'Uma object key é o identificador único usado para recuperar um objeto dentro de um bucket. A key não pode ser alterada; fazer upload de um novo objeto usando a mesma key substitui o objeto existente.'
  },
  {
    value: 'prefixos',
    question: 'Como funcionam os prefixos se buckets não têm pastas?',
    answer:
      'Prefixos simulam hierarquia de pastas usando barras nas object keys. Isso ajuda você a organizar conteúdo (por exemplo, src/assets/images/...) e controlar como o conteúdo é servido ao usar um bucket como origem.'
  },
  {
    value: 'protocolo-s3',
    question: 'Como posso acessar o Object Storage usando o protocolo S3?',
    answer:
      'Crie uma credencial S3 para um bucket para obter uma access key e secret key, então configure suas ferramentas compatíveis com S3 para usar o endpoint do Object Storage da Azion. Permissões são controladas pelas capabilities definidas na credencial.'
  },
  {
    value: 'operacoes',
    question: 'Quais operações são suportadas via API e via compatibilidade S3?',
    answer:
      'Object Storage suporta operações principais para buckets e objetos como criar, listar, atualizar permissões, upload, download, copiar e deletar. Para objetos grandes e transferências, operações de multipart upload compatíveis com S3 também são suportadas.'
  },
  {
    value: 'limites',
    question: 'Quais são os limites padrão para Object Storage?',
    answer:
      'Limites padrão incluem até 100 buckets por conta e um limite padrão de ListObjects de até 1.000 objetos por requisição. Limites podem ser aumentados dependendo do seu plano.'
  },
  {
    value: 'origem',
    question: 'Posso usar Object Storage como origem para Applications?',
    answer:
      'Sim. Você pode configurar um bucket como origem para Applications e escolher se deseja servir conteúdo da raiz do bucket ou de um prefixo específico, o que é útil para sites estáticos e hospedagem de assets.'
  },
  {
    value: 'functions',
    question: 'Posso acessar Object Storage a partir de Functions?',
    answer:
      'Sim. Functions podem interagir com Object Storage através da Storage API, permitindo ler, gravar, deletar e listar objetos programaticamente.'
  },
  {
    value: 'leitura-gravacao',
    question: 'Como gerencio acesso de leitura-gravação com segurança?',
    answer:
      'Buckets podem ser configurados com diferentes permissões de acesso. Se você habilitar acesso de leitura-gravação, certifique-se de controlar quem pode gravar objetos—frequentemente mediando gravações através de Functions onde você pode aplicar autenticação e validação.'
  }
]

const link = (label: string, href: string) => ({ label, href, trailing: true, external: true })

const page: LandingPage = {
  lang: 'pt-BR',
  source: 'https://www.azion.com/pt-br/lp/object-storage-form/',
  sections: [
    {
      section: 'HeroForm',
      eyebrow: 'ARMAZENAR',
      title: 'Storage compatível com S3, em uma só plataforma',
      description:
        'Armazene dados, mídia e logs com compatibilidade S3. Use buckets como origem em Applications e integre com Functions sem custo de egress.',
      ...pageSpecialistForm('Fale com um especialista Azion'),
      carouselMarks: PRODUCT_STACK
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          icon: 'pi pi-dollar',
          title: 'Reduza custos de armazenamento',
          description:
            'Pague por GB armazenado por mês e escale conforme o uso, sem compromissos fixos de infraestrutura.'
        },
        {
          icon: 'pi pi-history',
          title: 'Garanta disponibilidade de dados',
          description:
            'Construa resiliência para aplicações e dados com uma arquitetura distribuída que reduz downtime e mantém acesso rápido e confiável.'
        },
        {
          icon: 'pi pi-check',
          title: 'Sem Vendor Lock In',
          description:
            'Integre com ferramentas, SDKs e pipelines existentes usando uma API compatível com S3, mantendo portabilidade entre serviços.'
        }
      ]
    },
    {
      section: 'ClientQuotes',
      ariaLabel: 'Histórias de clientes',
      quotes: quoteWall(HEROSPARK_STORAGE_PT_BR),
      actions: [CLIENTS_ACTION]
    },
    {
      section: 'MediaSplitStack',
      title: 'Object Storage rápido e confiável',
      bands: [
        {
          title: 'Migre objetos sem reescrever código',
          description:
            'Migre objetos de provedores S3 existentes sem reescrever sua aplicação. O Object Storage expõe uma API compatível com S3 para que seus clientes e scripts atuais continuem funcionando.',
          illustration: 'azion-to-aws',
          illustrationLabel:
            'Operações de armazenamento com protocolo duplo e funcionalidade em camadas.'
        },
        {
          title: 'Integre armazenamento, entrega e processamento',
          description:
            'Conecte dados diretamente a Applications e Functions sem custo de egress. Use buckets como origem para sites estáticos e assets e processe dados com Functions para validação e enriquecimento.',
          illustration: 'content-and-media-delivery',
          illustrationLabel:
            'Armazenamento com custo otimizado e integração de plataforma sem custos de egress.'
        }
      ]
    },
    {
      section: 'CodeSplit',
      title: 'Do armazenamento à entrega completa de aplicações',
      description:
        'Object Storage integra-se com Cache, Functions e Applications para fluxos completos de entrega de conteúdo.',
      files: [
        {
          label: 'object-storage.ts',
          value: 'object-storage',
          language: 'typescript',
          fileName: 'object-storage.ts',
          code: CODE
        }
      ],
      copyAriaLabel: 'Copiar o código',
      actions: [link('Saiba mais', `${DOCS}produtos/store/object-storage/`)]
    },
    {
      section: 'UseCases',
      title: 'Casos de uso',
      items: [
        {
          eyebrow: 'Armazenamento',
          icon: 'pi pi-file-arrow-up',
          title: 'Dados não estruturados em buckets',
          description:
            'Armazene logs, arquivos, datasets e uploads de usuários em buckets usando uma API compatível com S3. Escale sob demanda com acesso rápido e confiável.',
          action: link(
            'Ver exemplo',
            `${DOCS}produtos/guias/upload-e-download-de-objetos-do-bucket/`
          )
        },
        {
          eyebrow: 'Backup',
          icon: 'pi pi-credit-card',
          title: 'Backup e recuperação para arquivos críticos',
          description:
            'Organize backups por bucket e automatize upload e restauração via API. Use versionamento e multipart upload para proteger dados e acelerar recuperação.',
          action: link('Ver exemplo', `${DOCS}produtos/guias/criar-e-modificar-um-bucket/`)
        },
        {
          eyebrow: 'Deploy',
          icon: 'pi pi-cog',
          title: 'Hospedagem de sites estáticos com bucket como origem',
          description:
            'Hospede HTML, CSS, JavaScript e assets em um bucket como origem em Applications. Simplifique deploys com alta disponibilidade para sites e arquivos estáticos.',
          action: link('Ver exemplo', `${DOCS}produtos/store/storage/bucket-como-connector/`)
        },
        {
          eyebrow: 'Mídias',
          icon: 'pi pi-chart-line',
          title: 'Biblioteca de mídia e entrega de conteúdo',
          description:
            'Centralize imagens e vídeos no Object Storage e integre com Cache e Applications para entregar assets e downloads com performance e controle de custos.',
          action: link(
            'Ver exemplo',
            'https://azion.com/pt-br/documentacao/casos-de-uso/construir-e-executar-aplicacoes/criar-e-operar-sites-de-marketing/'
          )
        }
      ]
    },
    { section: 'FaqSection', title: 'Perguntas Frequentes', items: FAQ },
    campaignClosing('pt-BR')
  ]
}

export default page
