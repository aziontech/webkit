export const SITE_SECTION = {
  _id: 'feature-tabs',
  props: {
    eyebrow: 'Observability',
    title: 'Inspect every run end-to-end',
    description:
      'Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it.',
    tabs: [
      {
        title: 'Trace',
        description:
          'The run as a waterfall: each step placed against the invocation it belongs to, nested where it nested.',
        illustration: 'live-debugging',
        illustrationLabel: 'A trace waterfall of one invocation'
      },
      {
        title: 'Logs',
        description:
          'Structured output on the same clock as the trace, filtered by level, searchable in place.',
        illustration: 'stay-in-control',
        illustrationLabel: 'Structured logs filtered by level'
      },
      {
        title: 'Request path',
        description:
          'The workload, application, function and connector it travelled, each captioned with the time spent there.',
        illustration: 'distributed-apis',
        illustrationLabel: 'The path a request took through the platform'
      }
    ],
    primaryAction: { label: 'Open an invocation', href: '/product-preview', trailing: true }
  }
}
