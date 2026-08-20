/**
 * The COMPLEMENTARY groups of the "On this page" rail — everything in that rail
 * that is not a heading of the page being read.
 *
 * They live here, beside the navigation tree, because they are site chrome: the
 * repository and the community are the same on all 275 pages, so a page must not
 * have to restate them to get them. The one per-page part is the edit link, which
 * is why this is a function of the page's source path rather than a constant.
 *
 * `DocOnThisPage` renders them flush at the rail's left edge, under their own
 * overlines, so they read as peers of the outline instead of sections of it —
 * "Join us on Discord" is not part of the page anyone is reading.
 */

/** Where the documentation's markdown lives. */
const REPOSITORY = 'https://github.com/aziontech/azion-docs'

/**
 * Build the rail's complementary groups for one page.
 *
 * @param {string} sourcePath - the page's markdown, relative to the repository
 *   root, e.g. `src/content/docs/en/pages/start/first-deploy.mdx`.
 * @returns {{ label: string, links: { label: string, href: string, icon: string }[] }[]}
 */
export function docsRailGroups(sourcePath) {
  return [
    {
      label: 'GitHub',
      links: [
        { label: 'Azion Docs', href: REPOSITORY, icon: 'pi pi-github' },
        {
          label: 'Contribute to this page',
          href: `${REPOSITORY}/edit/dev/${sourcePath}`,
          icon: 'pi pi-pencil'
        }
      ]
    },
    {
      label: 'Community',
      links: [
        { label: 'Join us on Discord', href: 'https://discord.gg/azion', icon: 'pi pi-discord' },
        {
          label: 'Read our blog posts',
          href: 'https://www.azion.com/en/blog/',
          icon: 'pi pi-comment'
        },
        { label: 'Follow us on X', href: 'https://x.com/aziontech', icon: 'ai ai-x' }
      ]
    }
  ]
}
