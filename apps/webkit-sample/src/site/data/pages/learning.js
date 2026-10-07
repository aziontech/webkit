import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { LEARNING_SUBJECTS } from '../learning.js'

export const LEARNING_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    title: 'Learning Center',
    description: 'Practical knowledge to speed up, secure, and scale applications.',
    actions: [
      { label: 'See articles', href: '#subjects', kind: 'secondary' },
      { label: 'Talk to a Specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Trusted by mission-critical workloads',
    carouselMarks: CLIENT_STRIP
  },
  {
    section: 'PlatformDirectory',
    anchor: 'subjects',
    title: 'Subjects',
    groups: LEARNING_SUBJECTS.map((subject) => ({
      label: subject.title,
      items: subject.articles.map((article) => ({
        icon: 'pi pi-book',
        title: article.label,
        description: '',
        href: article.href
      }))
    }))
  },
  {
    section: 'ClosingCallToAction',
    kind: 'split',
    eyebrow: 'Next step',
    title: 'Put what you learned to work.',
    titleMuted: 'On Azion.',
    description:
      'Deploy your first application in minutes, or talk to our team about your architecture.',
    actions: [{ label: 'Start Free', href: '/signup', kind: 'secondary' }],
    aside: { label: 'Talk to our team', href: '/site/contact' }
  }
]
