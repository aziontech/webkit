import { markRaw } from 'vue'

import SqlDatabaseQueryFragment from '../../ui/mockup/widgets/SqlDatabaseQueryFragment.vue'
import SqlDatabaseRowFragment from '../../ui/mockup/widgets/SqlDatabaseRowFragment.vue'
import SqlDatabaseTableFragment from '../../ui/mockup/widgets/SqlDatabaseTableFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'ai ai-edge-sql',
    title: 'Data in your apps',
    description:
      'Build applications that store and access structured data natively, without external databases.'
  },
  {
    icon: 'pi pi-bolt',
    title: 'Fast global reads',
    description:
      'Serve data to users worldwide with quick response times from distributed replicas.'
  },
  {
    icon: 'pi pi-microchip-ai',
    title: 'RAG without complexity',
    description: 'Build AI applications with embeddings and relational data in a single database.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-microchip-ai',
    title: 'Retrieval-Augmented Generation (RAG)',
    description:
      'Build RAG applications with built-in vector search and AI Inference integration. Query embeddings and relational data together without a separate vector database.',
    href: '/site/solutions/ai'
  },
  {
    icon: 'pi pi-lock',
    title: 'Authentication and sessions',
    description:
      'Store sessions, tokens, and authentication metadata in a distributed SQL layer. Validate credentials from replicas closer to users.',
    href: '/site/solutions/security'
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Global replication for SaaS',
    description:
      'Serve shared datasets from distributed read replicas. SaaS applications stay consistent for users across regions.',
    href: '/site/solutions/technology'
  },
  {
    icon: 'pi pi-shopping-cart',
    title: 'E-commerce product catalogs',
    description:
      'Query inventory and product data from replicas near customers. Keep catalog experiences responsive during traffic spikes.',
    href: '/site/solutions/retail'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is SQL Database?',
    answer:
      'Azion SQL Database is a serverless, distributed SQL solution on a global network. It supports SQLite-compatible queries, ACID compliance on the primary instance, read replicas, built-in vector search, and native Functions integration. Use it to build RAG applications, authentication systems, and data-driven APIs without managing separate services.'
  },
  {
    value: 'replication',
    question: 'How does SQL Database replicate data?',
    answer:
      'SQL Database uses a Main/Replicas architecture. Writes go to the main instance and propagate to read replicas across the global network. This keeps read-heavy workloads closer to users while maintaining ACID guarantees on the primary.'
  },
  {
    value: 'write-replicas',
    question: 'Can I write to replicas?',
    answer:
      'No. Replicas are read-only. Writing data is only possible on the main instance, either via the REST API or via Functions. This architecture ensures ACID compliance while distributing reads globally.'
  },
  {
    value: 'consistency',
    question: 'Are replicas immediately consistent with the main instance?',
    answer:
      'No. Replicas update with propagation time and eventually sync with the main instance. This model supports distributed reads for workloads that do not require immediate global consistency.'
  },
  {
    value: 'functions',
    question: 'How do I query SQL Database from Functions?',
    answer:
      'Functions can connect to a read replica and execute SQL queries or commands. This lets application logic make request-time decisions using data stored on Azion Web Platform.'
  },
  {
    value: 'api',
    question: 'Can I manage databases with an API?',
    answer:
      "Yes. Create, list, query, and delete databases using the SQL Database REST API. Database creation may take a few minutes before it's ready to use. Automate database provisioning programmatically."
  },
  {
    value: 'delete',
    question: 'What happens if I delete a database?',
    answer:
      'Deleting a database is permanent and cannot be undone. After deletion, you can no longer read from or write to that database.'
  },
  {
    value: 'limits',
    question: 'What are the default limits for SQL Database?',
    answer:
      'Default limits include up to 100 columns per table and a maximum SQL query duration of 30 seconds. Database count and storage limits depend on your service plan.'
  },
  {
    value: 'vector-search',
    question: 'What is Vector Search in SQL Database?',
    answer:
      'Vector Search enables semantic search using vector embeddings stored directly in SQL Database. Supports cosine distance calculations and indexing for approximate nearest neighbor queries—no separate vector database required.'
  },
  {
    value: 'vector-dimensions',
    question: 'Is there a limit on vector dimensions?',
    answer:
      "Yes. Vector operations support up to 65,536 dimensions, sufficient for most embedding models including OpenAI's text-embedding-3-large (3072 dimensions) and similar models."
  }
]

export const SQL_DATABASE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'SQL Database',
    title: 'Serverless distributed SQL with built-in vector search',
    description:
      'Store and query relational data and embeddings from global replicas for AI-powered applications.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every table, query and row in one database',
    description:
      'The schema, the queries that read it and the rows your functions serve live in the same database, written on the primary and read from replicas.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-edge-sql',
        title: 'Tables you define column by column',
        description:
          'Create SQLite-compatible tables with names, types, defaults and a primary key, from the console or from your application workflow.',
        scene: { component: markRaw(SqlDatabaseTableFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-code',
        title: 'Queries you run and read back',
        description:
          'Run the same statements your code sends with execute and query, and read the rows the database returns.',
        scene: { component: markRaw(SqlDatabaseQueryFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-functions',
        title: 'Rows your functions read',
        description:
          'Insert rows on the main instance, then connect SQL Database with Functions to read them from a replica at request time.',
        scene: { component: markRaw(SqlDatabaseRowFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Distributed SQL for resilient global reads',
        description:
          'The primary instance handles writes while distributed replicas serve read-heavy workloads closer to users, helping applications stay responsive and available.',
        href: PRODUCT_DOCS,
        illustration: 'global-network',
        illustrationLabel: 'A world map of points with the locations that serve reads highlighted',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Combine relational data and vector search',
        description:
          'SQL Database stores structured records and embeddings together, so teams can build RAG applications without adding a separate vector database.',
        href: '/site/products/ai-inference',
        illustration: 'combine-data-and-vector-search',
        illustrationLabel: 'Stored records and embeddings connected to an AI model on Azion',
        actions: [{ label: 'AI Inference', href: '/site/products/ai-inference' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'See how to use',
    description:
      'Put SQL Database behind any application and serve relational data and embeddings from replicas on Azion’s distributed infrastructure, with writes on the main instance. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('herospark') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]
