const DOMAIN = 'k7q2fmx4ze.map.azionedge.net'

const SESSION = `azion link --preset javascript --name auth-handler --auto
# Project successfully configured

azion deploy --auto
# Upload completed successfully!
# Your Application was deployed successfully
# Domain: https://${DOMAIN}

curl https://${DOMAIN}/
# Hello World`

export const SITE_SECTION = {
  _id: 'cli-terminal',
  props: {
    eyebrow: 'Azion CLI',
    title: 'Deploy your first function in two commands',
    description:
      'Link a project, deploy it, and curl the domain the CLI hands back. Builds run on your machine with --local, or on Azion.',
    session: SESSION,
    copyAriaLabel: 'Copy the deploy session',
    primaryAction: {
      label: 'Install the CLI',
      href: 'https://www.azion.com/en/documentation/products/azion-cli/overview/',
      trailing: true
    }
  }
}
