export const CAREERS_HOME_HERO = {
  eyebrow: 'Careers',
  title: "Let's build together",
  description: 'We build new things, keep them reliable, decide in the open, and move fast.',
  action: 'See roles'
}

export const CAREERS_WORK = {
  title: 'Work at Azion',
  description:
    "The Azion Way of Life pairs high performance with autonomy, and with room to be yourself and enjoy the work. You manage your own routine, answer for your results, and work with teammates across countries and cultures. There's no dress code: we care about the ideas, energy, and integrity you bring."
}

export const CAREERS_VISION = {
  eyebrow: 'Our vision',
  title: 'Building for the web should be simple',
  description:
    'We want teams to build, speed up, automate, and secure applications with less operational drag. The Azion Platform gives them one reliable place to do it, with clear building blocks and strong price-performance. They ship faster and keep full control of where workloads run: on Azion’s infrastructure, in the cloud, or on their own.'
}

export const CAREERS_PROCESS = {
  title: 'Hiring process',
  description: 'Every role goes through the same five stages, from the first request to the offer.',
  steps: [
    {
      title: 'Role request',
      description: 'A hiring manager requests a new role.'
    },
    {
      title: 'Scope and posting',
      description:
        'We define the role’s scope, write the job description, and post the opening on selected channels.'
    },
    {
      title: 'Recruiting and interviews',
      description:
        'We source and screen candidates, then schedule interviews and, when the role needs one, a technical assessment.'
    },
    {
      title: 'Calibration',
      description: 'Interviewers meet to compare feedback and choose the candidate.'
    },
    {
      title: 'Offer letter',
      description: 'We prepare the offer and send it to the chosen candidate.'
    }
  ]
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
