import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'

import { LEARNING_SUBJECTS } from '../learning.js'

export const LEARNING_PAGE = [
  {
    section: 'Heroes',
    eyebrow: 'Resources',
    kind: 'title-band',
    titleLength: 'long',
    title: 'Learning Center',
    description: 'Practical knowledge to speed up, secure, and scale applications.',
    actions: [
      { label: 'See articles', href: '#subjects', kind: 'secondary' },
      { label: 'Talk to sales', href: '/site/contact/sales', kind: 'outlined', trailing: true }
    ],
    carouselLabel: 'Companies that run on Azion',
    carouselMarks: CLIENT_STRIP
  },
  {
    section: 'SubjectLibrary',
    anchor: 'subjects',
    subjects: LEARNING_SUBJECTS,
    closing: {
      eyebrow: 'Next step',
      title: 'Put what you learned to work.',
      titleMuted: 'On Azion.',
      description:
        'Deploy your first application in minutes, or talk to an expert about your architecture.',
      actions: [
        { label: 'Start for free', href: '/signup', kind: 'secondary' },
        { label: 'Talk to sales', href: '/site/contact/sales', kind: 'outlined', trailing: true }
      ]
    }
  },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
