// GDPR — https://resend.com/security/gdpr, translated per .claude/skills/site-design-translate.
// The source is a flat article: an H1 + one line, then 16 question/answer sections with no
// grouping heading of their own (unlike the Pricing FAQ, which sits under one shared
// "Frequently Asked Questions" title — see ../components/AzionPricing.vue). Every question here
// is already its own heading, so the page's own shape IS an FAQ list; `Accordion` (this design
// system's existing pattern for exactly this content shape) is reused rather than 16 separate
// framed modules.
//
// ── THE REBRAND (explicit, user-confirmed 2026-09-25) ──
// Every "Resend" in the source becomes "Azion" — including in sentences describing Resend's own
// infrastructure and sub-processors (Vanta, Anthropic, RunPod, US-only storage, the DPA section
// numbers). These become UNVERIFIED claims about Azion once rebranded: this file does not assert
// they are true of Azion's real practices. This is a design-system PATTERN page (apps/webkit-
// sample), not azion.com production copy — the choice to keep every fact verbatim under the new
// name, rather than adapting or omitting the Resend-specific operational claims, was presented to
// and made by the requester after being flagged.
//
// ── LINKS THAT COULD NOT BE CARRIED OVER VERBATIM ──
// The source links every legal-document mention (DPA, Documents, subprocessors list, cookie
// policy, Terms, Privacy Policy, Technical and Organizational Measures, individual DPA sections)
// to a real Resend page. None of those pages exist in this sample app, and inventing routes for
// them would be a worse departure than dropping the anchor — so these render as plain text
// (`href: ''` below). Three kinds of link DO carry over:
//   1. Genuine third-party resources, unrelated to either company (Vanta, GDPR Article 28,
//      the EU-U.S. Data Privacy Framework listing) — kept as real external links.
//   2. Mentions with a real counterpart already routed in this app — "Pricing" → /site/pricing,
//      "contact us" → /site/contact, "Security"/"SOC 2 Type II" → /site/compliance (this app's
//      own certifications/trust page).
//   3. Each question's own deep link (the source hangs `#slug` off every heading) — reproduced as
//      the `id` on each `Accordion.Item`, not as a separate visible link element (this page
//      language has no "copy anchor" icon convention to invent one for).

const t = (text) => ({ text })
const l = (text, href, external = false) => ({ text, href, external })

/** The "Ask AI to explain" utility band. Same 4 tools, query text points at this page instead
 *  of Resend's. Generic `pi-sparkles` glyph on all four — none of the four tools has a mark in
 *  the shared brand registry, so no brand logo is substituted (see migration.md). */
const ASK_AI_URL = 'https://www.azion.com/en/gdpr'
const askAiQuery = (text) => encodeURIComponent(text)
const ASK_AI_SUMMARY = "Summarize in plain language the key security practices described in Azion's GDPR at " + ASK_AI_URL

export const ASK_AI_LINKS = [
  { label: 'ChatGPT', href: `https://chatgpt.com/?q=${askAiQuery(ASK_AI_SUMMARY)}` },
  { label: 'Claude', href: `https://claude.ai/new?q=${askAiQuery(ASK_AI_SUMMARY)}` },
  { label: 'Gemini', href: `https://www.google.com/search?udm=50&aep=11&q=${askAiQuery(ASK_AI_SUMMARY)}` },
  { label: 'Perplexity', href: `https://www.perplexity.ai/search?q=${askAiQuery(ASK_AI_SUMMARY)}` }
]

/** The 16 question/answer sections, source order preserved. `body` is a list of `p` and `ul`
 *  blocks, in the order the source renders them; both carry `segments` arrays (`ul.items` is an
 *  array of per-`li` segment arrays) so a single template can render every inline link. */
export const GDPR_FAQ = [
  {
    id: 'what-is-gdpr',
    question: 'What is GDPR?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            "The General Data Protection Regulation (GDPR) is a data privacy law implemented by the European Union. It went into effect on May 25, 2018, and is considered one of the world's leading data privacy legislations."
          )
        ]
      },
      {
        type: 'p',
        segments: [t('The goal of GDPR is to honor the privacy of persons residing in the EU, by protecting their:')]
      },
      {
        type: 'ul',
        items: [
          [t('Right to be informed')],
          [t('Right of access')],
          [t('Right to rectification')],
          [t('Right to erasure')],
          [t('Right to restriction of processing')],
          [t('Right to data portability')],
          [t('Right to object')],
          [t('Right to avoid automated decision-making')]
        ]
      }
    ]
  },
  {
    id: 'why-is-gdpr-necessary',
    question: 'Why is GDPR necessary?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'A majority of the businesses using Azion either reside in the EU or have customers there. We are honoring our responsibility to comply with the rights of the recipients living in the EU.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t(
            "GDPR compliance is not only an obligation for Azion, but also for many of the businesses using Azion. Azion's compliance allows even more businesses to build their operations on top of Azion's infrastructure without compromises to privacy or compliance."
          )
        ]
      }
    ]
  },
  {
    id: 'who-audited-azion',
    question: 'Who audited Azion?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'Unlike SOC 2 or ISO 27001, GDPR is not a best practice standard but rather a law. Because of this, most companies self-audit to align their operations and technology with the GDPR controls. Azion followed this approach.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t('Azion also uses '),
          l('Vanta', 'https://vanta.com', true),
          t(' to monitor all GDPR controls and organize evidence for compliance.')
        ]
      }
    ]
  },
  {
    id: 'how-do-i-get-a-signed-dpa',
    question: 'How do I get a signed DPA?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'A GDPR Article 28 Data Processing Addendum is in force for every Azion account. It is pre-signed by Azion and fully executed once you sign up, so there is no separate counter-signature step.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t('You can download the signed copy from the '),
          l('Documents', ''),
          t(' page (login required). The unsigned reference version is our public '),
          l('DPA', ''),
          t('.')
        ]
      }
    ]
  },
  {
    id: 'where-is-azion-data-stored',
    question: 'Where is Azion data stored?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'Azion stores customer data in the United States, including message content, delivery logs, webhook payloads, and account records.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t(
            'The region you select when adding a sending domain (for example, eu-west-1) controls where email is routed and sent from. It does not control where data is stored, and there is no setting today that moves stored data to the EU. See '
          ),
          l('Choosing a Region', ''),
          t(' for sending-region details.')
        ]
      },
      {
        type: 'p',
        segments: [
          t('Transfers to the United States are covered by the Standard Contractual Clauses in our '),
          l('DPA', ''),
          t(' and by our participation in the '),
          l('EU-U.S. Data Privacy Framework', 'https://www.dataprivacyframework.gov/list', true),
          t(' (including the UK Extension).')
        ]
      }
    ]
  },
  {
    id: 'how-are-eu-uk-and-swiss-transfers-handled',
    question: 'How are EU, UK, and Swiss transfers handled?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            "Azion's primary processing operations take place in the United States, and transferring customer data there is necessary to provide the Services. See "
          ),
          l('Section 6 of the DPA', ''),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [
          t(
            'Transfers out of the EEA are made under the EU Standard Contractual Clauses, which are incorporated into the DPA. Module Two applies when you are a controller and Azion is your processor. Module Three applies when you are a processor and Azion is your sub-processor. UK transfers use the UK Addendum. Swiss transfers use the EU SCCs with the modifications described in the DPA.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t('The EU-U.S. Data Privacy Framework (and the UK Extension) is an additional transfer mechanism, described in '),
          l('Section 11 of the DPA', ''),
          t('. The SCCs stand on their own and are not conditioned on DPF certification status. View our listing on the '),
          l('Data Privacy Framework website', 'https://www.dataprivacyframework.gov/list', true),
          t('.')
        ]
      }
    ]
  },
  {
    id: 'how-long-is-data-retained',
    question: 'How long is data retained?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'While your account is active, email and log data is retained for 30 days on Free, Pro, and Scale plans. Enterprise plans include '
          ),
          l('flexible data retention', '/site/pricing'),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [
          t(
            'When you terminate your use of the Services, remaining customer data is deleted within 90 days of account termination, as described in Exhibit A of the DPA.'
          )
        ]
      },
      {
        type: 'p',
        segments: [t('Backups persist for 7 days. See '), l('Security', '/site/compliance'), t(' for backup and encryption details.')]
      },
      {
        type: 'p',
        segments: [
          t('If you need a specific message removed before the retention window ends, '),
          l('contact us', '/site/contact'),
          t('.')
        ]
      }
    ]
  },
  {
    id: 'who-are-the-sub-processors-and-how-much-notice-is-given-for-changes',
    question: 'Who are the sub-processors, and how much notice is given for changes?',
    body: [
      {
        type: 'p',
        segments: [t('The current list is on our '), l('subprocessors', ''), t(' page.')]
      },
      {
        type: 'p',
        segments: [
          t(
            "We give at least 14 days' written notice before adding or replacing a sub-processor, so you can object before the change takes effect. If you reasonably object and we cannot provide a commercially reasonable alternative, you may discontinue the affected Service. Azion remains liable for sub-processor performance. See "
          ),
          l('Section 4 of the DPA', ''),
          t('.')
        ]
      }
    ]
  },
  {
    id: 'do-ai-subprocessors-receive-my-email-content',
    question: 'Do AI subprocessors receive my email content?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'Anthropic receives content only when you use the AI Editor, or content you choose to share with the in-app AI Support Agent. Normal sending through the Emails API is not sent to Anthropic.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t('RunPod processes a small sample of emails for trust and safety, on dedicated infrastructure that Azion operates.')
        ]
      },
      {
        type: 'p',
        segments: [
          t('Neither Azion nor these subprocessors use customer content to train or fine-tune models. Both are listed on our '),
          l('subprocessors', ''),
          t(' page.')
        ]
      }
    ]
  },
  {
    id: 'what-if-there-is-a-personal-data-breach',
    question: 'What if there is a personal data breach?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'If a personal data breach occurs, Azion will inform you without undue delay and cooperate so you can meet any obligation to notify a supervisory authority or affected data subjects. See '
          ),
          l('Section 8 of the DPA', ''),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [t('To report a security issue or ask about an incident, '), l('contact us', '/site/contact'), t('.')]
      }
    ]
  },
  {
    id: 'how-are-data-subject-requests-handled',
    question: 'How are data subject requests handled?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'For Customer Data processed through the Service, you are responsible for responding to data subject requests. If Azion receives a request about your data, we will direct the person to you and, where you cannot respond without our help, assist you in accordance with '
          ),
          l('Section 7 of the DPA', ''),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [
          t('For account, billing, and service usage data, Azion is an independent controller. That processing is described in our '),
          l('Privacy Policy', ''),
          t('. See '),
          l('Section 9 of the DPA', ''),
          t('.')
        ]
      }
    ]
  },
  {
    id: 'what-measures-are-taken-to-protect-pii',
    question: 'What measures are taken to protect PII?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'Azion encrypts data at rest (AES-256) and in transit (TLS 1.3 or higher). We run annual third-party penetration tests; the Letter of Attestation is on the Documents page. Azion is also '
          ),
          l('SOC 2 Type II', '/site/compliance'),
          t(' compliant.')
        ]
      },
      {
        type: 'p',
        segments: [t('See the DPA for the full list of '), l('Technical and Organizational Measures', ''), t('.')]
      }
    ]
  },
  {
    id: 'how-does-azion-meet-the-obligations-of-a-processor',
    question: 'How does Azion meet the obligations of a processor?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'Azion spent over 12 months making the necessary changes to comply with GDPR to properly honor our obligations as a processor according to '
          ),
          l('Article 28 of GDPR', 'https://gdpr-info.eu/art-28-gdpr/', true),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [
          t(
            'With regard to Customer Data, Azion is a processor and you may act as a controller or a processor. Azion is an independent controller only for account, billing, and usage data, as described in the Privacy Policy.'
          )
        ]
      },
      {
        type: 'p',
        segments: [
          t(
            'For California Consumer Privacy Act (CCPA) purposes, Azion is a service provider and does not sell personal information provided by customers. See '
          ),
          l('Section 2.5 of the DPA', ''),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [
          t('These changes also include updates to our '),
          l('Terms', ''),
          t(' and Privacy Policy to adequately incorporate all of these documents together.')
        ]
      }
    ]
  },
  {
    id: 'is-azion-hipaa-or-iso-27001-certified',
    question: 'Is Azion HIPAA or ISO 27001 certified?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'No. Azion is not HIPAA compliant and cannot sign a Business Associate Agreement. Azion holds SOC 2 Type II, not an ISO 27001 certificate. You can download the SOC 2 report and DPA from the Documents page.'
          )
        ]
      }
    ]
  },
  {
    id: 'how-can-i-access-gdpr-resources',
    question: 'How can I access GDPR resources?',
    body: [
      {
        type: 'ul',
        items: [
          [t('View our DPA (or '), l('download', ''), t(' the signed copy)')],
          [t('View our subprocessors')],
          [t('View our '), l('cookie policy', '')],
          [t('Download the DPA, SOC 2 report, and penetration test Letter of Attestation from Documents')],
          [t('View our '), l('Data Privacy Framework listing', 'https://www.dataprivacyframework.gov/list', true)]
        ]
      }
    ]
  },
  {
    id: 'can-you-answer-a-questionnaire',
    question: 'Can you answer a questionnaire?',
    body: [
      {
        type: 'p',
        segments: [
          t(
            'Most questionnaire items are answered on this page, the DPA, the subprocessors list, and the Security overview. If you still need a questionnaire filled, please '
          ),
          l('contact us', '/site/contact'),
          t('.')
        ]
      },
      {
        type: 'p',
        segments: [t('Please note that requesting changes to our DPA or other legal documents requires an Enterprise Plan.')]
      }
    ]
  }
]
