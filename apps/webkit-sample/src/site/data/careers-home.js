export const CAREERS_HOME_HERO = {
  eyebrow: 'Careers',
  title: "Let's build together",
  description:
    'Azion is driven by innovation, reliability, and the ability to make transparent, forward-looking decisions and execute them with agility. Our success depends on the success of our customers.',
  action: 'See roles'
}

export const CAREERS_WORK = {
  title: 'Work at Azion',
  description:
    "At Azion, culture is how we live and work every day. The Azion Way of Life is built on the belief that high performance goes hand in hand with autonomy, authenticity, and enjoyment. We trust people to manage their own routines with balance and accountability, focusing on outcomes. We collaborate across countries and cultures to build solutions for the world. And we value originality, bold ideas, and the courage to challenge convention. That's why there's no dress code: what matters is what each person brings to the table, their ideas, energy, and integrity."
}

// Served from public/careers; width and height are the files' own, so each slide reserves its box.
export const CAREERS_PHOTOS = [
  {
    src: '/careers/office-desks.jpg',
    alt: 'An open-plan office with a fern-lined shelf and a person working at a shared desk',
    width: 1066,
    height: 1600
  },
  {
    src: '/careers/office-lounge.jpg',
    alt: 'A lounge corridor with a sofa and two sling chairs along a wall of windows',
    width: 1600,
    height: 1066
  },
  {
    src: '/careers/team-talk.jpg',
    alt: 'A team member giving a talk in front of a screen while colleagues listen with laptops',
    width: 900,
    height: 1600
  },
  {
    src: '/careers/office-window-bar.jpg',
    alt: 'One person reading on a window bench while two colleagues talk at a window counter',
    width: 1066,
    height: 1600
  },
  {
    src: '/careers/office-shelves.jpg',
    alt: 'Shelves of ferns and collectible figures beside a glass-walled meeting room',
    width: 1600,
    height: 1066
  },
  {
    src: '/careers/office-private-room.jpg',
    alt: 'A wood-panelled meeting room with a person working on a laptop by the window',
    width: 1600,
    height: 1066
  }
]

export const CAREERS_ROLES = {
  title: 'Latest roles',
  previewCount: 6,
  columns: { role: 'Role', team: 'Team and location', type: 'Work type' },
  action: (total) => `See all ${total} roles`
}

export const CAREERS_JOIN = {
  title: 'Ready to join us?',
  description: 'Explore our open positions and find the right fit for you.',
  action: 'See all available jobs'
}

export const CAREERS_JOBS_PATH = '/site/careers/jobs'
