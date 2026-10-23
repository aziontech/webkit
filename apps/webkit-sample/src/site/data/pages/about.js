import frost from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
import frostReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
import g2 from '@aziontech/webkit/assets/g2-symbol-color.svg'
import gigaom from '@aziontech/webkit/assets/gigaom-extended-color.svg'
import gigaomReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'
import monashees from '@aziontech/webkit/assets/monashees-extended-mono.svg'
import monasheesReversed from '@aziontech/webkit/assets/monashees-extended-reversed.svg'
import qualcomm from '@aziontech/webkit/assets/qualcomm-extended-mono.svg'
import qualcommReversed from '@aziontech/webkit/assets/qualcomm-extended-reversed.svg'

import { COMPANY_CLOSING } from '../product-pages.js'

const ABOUT_PHOTOS = [
  {
    src: '/about/office-lounge-tv.jpg',
    alt: 'A lounge with wooden bleachers, two people watching football on a wall screen and a dartboard on a pillar',
    width: 1600,
    height: 1066
  },
  {
    src: '/about/office-booth.jpg',
    alt: 'Two people working at a booth table under a pendant lamp, orange chevrons on the wall behind them',
    width: 1066,
    height: 1600
  },
  {
    src: '/about/office-team.jpg',
    alt: 'Seven teammates smiling on wooden steps in front of the Azion logo',
    width: 1600,
    height: 900
  },
  {
    src: '/about/office-bleachers.jpg',
    alt: 'People talking on wooden bleachers beneath a wall of white neon chevrons',
    width: 1600,
    height: 1066
  },
  {
    src: '/about/office-open-office.jpg',
    alt: 'An open-plan office with white desks and a person working at a window counter',
    width: 1600,
    height: 1066
  },
  {
    src: '/about/office-meeting-room.jpg',
    alt: 'A shelf of figurines and ferns beside a glass-walled meeting room',
    width: 1600,
    height: 1066
  },
  {
    src: '/about/office-window-bar.jpg',
    alt: 'One person reading on a window bench while two others sit at a counter by the windows',
    width: 1066,
    height: 1600
  }
]

const FIRMS = {
  g2: { name: 'G2', logo: g2, logoLight: g2 },
  gigaom: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
  frost: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost }
}

export const ABOUT_PAGE = [
  {
    section: 'Heroes',
    eyebrow: 'About',
    kind: 'title-band',
    titleLength: 'short',
    title: 'Build, secure, and scale applications everywhere',
    description:
      'The Azion Platform runs your code, data, and security on a distributed architecture, with instant deploys and cold-start-free scale.',
    actions: [
      { label: 'Join our team', href: '/site/careers', kind: 'secondary' },
      { label: 'Talk to a specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ]
  },
  {
    section: 'PhotoMarquee',
    gap: false,
    title: 'Builders, not spectators',
    description:
      'We make every application fast and reliable. Deploy your projects instantly on the most reliable global infrastructure, leverage enterprise-grade security, and scale from zero to peak without cold starts. Our culture is built on ownership, high performance, and continuous evolution. We look for people who lead by example, challenge the status quo, and move fast regardless of the size of the problem. At Azion, every delivery is a new starting point.',
    descriptionWidth: 'wide',
    photos: ABOUT_PHOTOS,
    ariaLabel: 'Azion offices',
    duration: 60
  },
  {
    section: 'RecognitionMarquee',
    title: 'Recognized as a market leader',
    items: [
      {
        text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solutions.',
        name: 'G2 Winter 2026 Reports',
        jobTitle: '',
        firm: FIRMS.g2
      },
      {
        text: 'Named a Leader, and the only vendor whose capabilities meet every key criterion in the report.',
        name: 'GigaOm Radar for Edge Platforms',
        jobTitle: '',
        firm: FIRMS.gigaom
      },
      {
        text: "Awarded in the Edge Serverless Computing category and recognized for consistently exceeding its customers' performance expectations.",
        name: '2023 North American New Product Innovation Award',
        jobTitle: '',
        firm: FIRMS.frost
      }
    ]
  },
  {
    section: 'InvestorMarks',
    eyebrow: 'Investors',
    title: 'Backed by visionary investors',
    items: [
      {
        name: 'monashees+',
        logo: monasheesReversed,
        logoLight: monashees,
        href: 'https://www.monashees.com'
      },
      {
        name: 'Qualcomm Ventures',
        logo: qualcommReversed,
        logoLight: qualcomm,
        href: 'https://www.qualcommventures.com'
      }
    ]
  },
  COMPANY_CLOSING
]
