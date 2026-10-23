export const CAREERS_HOME_HERO = {
  eyebrow: 'Careers',
  title: "Let's build together",
  description:
    'Join the team that builds and runs the Azion Platform. We value ownership, transparent decisions, and moving fast.',
  action: 'See roles'
}

export const CAREERS_WORK = {
  title: 'Work at Azion',
  description:
    "The Azion Way of Life pairs high performance with autonomy, authenticity, and enjoyment. You manage your own routine and answer for outcomes, working with teammates across countries and cultures. There's no dress code: what counts is the ideas, energy, and integrity you bring."
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

export const CAREERS_JOBS_PATH = '/site/careers/jobs'
