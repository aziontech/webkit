<script setup>
  // HOW YOU UPDATE AN APPLICATION THAT HAS NO REPOSITORY.
  //
  // A git-backed application answers "how do I ship a change?" by itself — you push, and
  // Azion ships it. An application created without one (`source: 'cli'`, see
  // ../../lib/data/applications.js) has no such answer, and the console used to give it
  // none: the create said "connect your code to it whenever it exists" and then never
  // said how. This card is that answer, and it is the whole of it — install, authenticate,
  // link, deploy, sync.
  //
  // It is mounted TWICE, deliberately:
  //
  //   the wizard's success screen   the handoff, at the moment the application is made
  //   the application's own page    permanently, for every `cli` application
  //
  // Once is not enough: a reader who reloads, or who comes back tomorrow, has lost the
  // success screen and still has the same question.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'

  const props = defineProps({
    /** The application the commands link against, shown in the `azion link` step. */
    name: { type: String, default: '' },
    /** Where the Documentation button goes. */
    documentationHref: {
      type: String,
      default: 'https://www.azion.com/en/documentation/products/azion-cli/overview/'
    }
  })

  const BULLETS = [
    'Link a local project to an Azion application',
    'Build and deploy from the terminal you already have open',
    'Keep azion.json in sync with what Console shows'
  ]

  // The link step names the application when we know which one, so the reader can paste
  // the line rather than translate it. Without a name it stays the bare command, which is
  // what `azion link` does when it prompts for one.
  const linkCommand = props.name ? `azion link --name ${props.name}` : 'azion link'

  const installTabs = [
    {
      label: 'Install and link',
      value: 'install',
      fileName: 'Install and link',
      language: 'bash',
      code: `# 1. Install the Azion CLI
curl -fsSL https://cli.azion.app/install.sh | bash

# 2. Authenticate with your Azion account
azion login

# 3. Link the local project to an Azion application
${linkCommand}`
    }
  ]

  const deployTabs = [
    {
      label: 'Deploy and sync',
      value: 'deploy',
      language: 'bash',
      code: `# Build with your framework preset and ship it to the edge
azion deploy

# Reconcile azion.json with the resources Console shows
azion sync`
    }
  ]
</script>

<template>
  <FrameBox marks="all">
    <!-- A CONTAINER QUERY, not a viewport one. This card is mounted at two very different
         widths — full-bleed on the create's success screen, and inside the Build tab's form
         measure (~1024px) — and the viewport is the same 1440 in both. The design's two
         columns are 600px each; below ~1280 of CARD width they cannot both hold a terminal
         line, so the card stacks and gives the code the full width instead of scrolling a
         `curl` line inside a 414px box. -->
    <CardBox
      :padded="false"
      class="@container"
    >
      <template #content>
        <div
          class="grid items-start gap-(--spacing-lg) p-(--spacing-lg) @7xl:grid-cols-2 @7xl:gap-(--spacing-xxl) @7xl:p-(--spacing-xl)"
        >
          <div class="flex min-w-0 flex-col items-start gap-(--spacing-md)">
            <h2 class="text-heading-lg text-(--text-default)">Get started</h2>
            <ul
              class="flex list-disc flex-col gap-(--spacing-xxs) pl-(--spacing-md) text-body-md text-(--text-muted)"
            >
              <li
                v-for="bullet in BULLETS"
                :key="bullet"
              >
                {{ bullet }}
              </li>
            </ul>
            <Button
              kind="secondary"
              size="large"
              label="Documentation"
              :href="documentationHref"
              target="_blank"
              rel="noreferrer"
            />
          </div>

          <CodeBlock
            :tabs="installTabs"
            copy-aria-label="Copy the install and link commands"
            class="min-w-0"
          />
        </div>

        <div
          class="grid items-start gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-lg) @7xl:grid-cols-2 @7xl:gap-(--spacing-xxl) @7xl:px-(--spacing-xl) @7xl:py-(--spacing-lg)"
        >
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <p class="text-heading-sm text-(--text-default)">Deploy and sync with Console</p>
            <p class="text-body-md text-(--text-muted)">
              Ship the build, then reconcile your local config
            </p>
          </div>

          <CodeBlock
            :tabs="deployTabs"
            copy-aria-label="Copy the deploy and sync commands"
            class="min-w-0"
          />
        </div>
      </template>
    </CardBox>
  </FrameBox>
</template>
