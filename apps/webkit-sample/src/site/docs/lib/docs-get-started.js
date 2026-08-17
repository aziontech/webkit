// Headings of the Get Started page, in document order — the page's "On this page"
// rail and the page's own anchors read from this one list, so the rail can never
// list a section the page doesn't have.
//
// The first entry is the h1's own id (`overview`), which is what the published docs
// page does: the rail's first row takes you back to the top.
export const GET_STARTED_TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'deploy-your-first-application', label: 'Deploy your first application' },
  { id: 'find-your-path', label: 'Find your path' },
  { id: 'build-with-your-framework', label: 'Build with your framework' },
  { id: 'after-the-first-deploy', label: 'After the first deploy' }
]
