<script setup>
  // Developer band — Figma `Illustrations` node 365:114094.
  //
  // A 50/50 registration-framed panel: the pitch with four checked capabilities and
  // one action on the left, a code sample on the right. The design's four corner
  // `Node` instances are FrameBox's corner registration squares, so the frame comes
  // from the layout primitive rather than four hand-placed dots.
  //
  // Figma → ours, where the two disagree:
  //   • Its right half is a `CodeBlock` instance over a "Code Snippet Background".
  //     Per the design-to-code hint order a component instance resolves to the
  //     codebase component, so this is webkit's CodeBlock — carrying the CLI / AI
  //     Prompt pair DocsGetStarted's hero uses, not the design's `file name.js`
  //     placeholder. That pairing is also why line numbers are off here although the
  //     design shows them (01…21): a prompt is prose to read and paste, and numbering
  //     it invites copying the numbers with it.
  //   • The heading is Title Case in Figma. This page sets headings in sentence case,
  //     so it lands as sentence case here.
  //   • Its overline label is an unresolved component prop; `AI` is the page's own word
  //     for what the sample does.
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Overline from '@aziontech/webkit/overline'

  import { SectionModule } from './foundations/components/layout/index.js'

  // The capabilities the design lists, each with its check glyph.
  const capabilities = [
    'Compatibility with modern web frameworks',
    'APIs for automation and integration',
    'Infrastructure as code with Terraform',
    'Metrics and events via GraphQL API'
  ]

  // The two ways to hand this platform to a tool, the same pairing DocsGetStarted
  // uses in its hero: `AI Prompt` is pasted into an agent, `CLI` into a terminal.
  // Same job, two audiences, so they are two tabs of one CodeBlock rather than two
  // blocks — and the prompt leads, because that is the newer of the two paths.
  //
  // The prompt is hard-wrapped at ~64 columns for the same reason it is there:
  // CodeBlock scrolls long lines horizontally, which is right for code and wrong for
  // prose that gets read before it is copied.
  const AGENT_PROMPT = `Deploy this project to Azion and add an inference route.

1. Install the Azion CLI and link this project:
   curl -fsSL https://cli.azion.app/install.sh | bash
   azion link
2. Connect the Azion MCP server (https://mcp.azion.com) so you
   can search current Azion docs while you work.
3. Add a route that answers with a model response, using
   Azion.AI.run from the runtime.
4. Deploy it and report the URL it went live on.`

  const CLI_SNIPPET = `# Install the Azion CLI
curl -fsSL https://cli.azion.app/install.sh | bash

# Link this project, then put it into traffic
azion link
azion deploy`

  const codeTabs = [
    { label: 'AI Prompt', value: 'ai-prompt', language: 'markdown', code: AGENT_PROMPT },
    { label: 'CLI', value: 'cli', language: 'bash', code: CLI_SNIPPET }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <!-- `flush`: the section gaps above and below draw their own rules, so this
         frame shares the top one instead of adding a second line beside it. -->
    <FrameBox
      flush
      borders="y"
    >
      <div class="grid lg:grid-cols-2">
        <!-- The pitch. Its action sits on the panel floor; the copy takes the space
             above it, which is what keeps the two halves the same height. -->
        <div class="flex flex-col justify-between gap-[var(--spacing-xxl)] p-[var(--spacing-xl)]">
          <div class="flex flex-col gap-[var(--spacing-lg)]">
            <Overline
              prefix="//"
              show-cursor
              >AI</Overline
            >
            <h2 class="m-0 text-balance text-heading-xl text-[var(--text-default)]">
              From local dev to mission critical
            </h2>

            <ul class="flex flex-col gap-[var(--spacing-sm)]">
              <li
                v-for="capability in capabilities"
                :key="capability"
                class="flex items-center gap-[var(--spacing-xs)] text-body-md text-[var(--text-default)]"
              >
                <!-- `--success-contrast`, not `--success`: in this family the bare token
                     is the surface fill and the `-contrast` one is the readable
                     foreground, which is what a check drawn as text needs. -->
                <i
                  class="pi pi-check text-body-sm text-[var(--success-contrast)]"
                  aria-hidden="true"
                />
                {{ capability }}
              </li>
            </ul>
          </div>

          <div>
            <Button
              label="Learn more"
              kind="outlined"
              size="large"
              href="#"
            />
          </div>
        </div>

        <!-- The sample. The rule between the halves lives here; the frame owns the
             outer edges. -->
        <div
          class="flex items-center border-t border-[var(--border-muted)] p-[var(--spacing-xl)] bg-[var(--bg-surface)] lg:border-l lg:border-t-0"
        >
          <!-- Wrapped so the elevation is cast by a shell of the block's own shape:
               CodeBlock rounds to --shape-elements and clips its overflow, so the
               shadow goes on a wrapper at the same radius instead of being clipped
               away. `animate-lines` is CodeBlock's own staggered line entrance, which
               ships with its motion-reduce fallback. -->
          <div class="min-w-0 flex-1 rounded-[var(--shape-elements)] shadow-[var(--shadow-sm)]">
            <!-- Raised, not just `surface`: the block's own default is `--bg-surface`
                 (#0A0A0A), which sits 4% above the `--bg-canvas` (#000) this band is
                 painted on — a difference you cannot see. `--bg-surface-raised` (#141414)
                 is the token for a surface that has to read as one layer above its
                 field, which is exactly what the sample needs to look like a panel
                 rather than a hole in the page. -->
            <CodeBlock
              :tabs="codeTabs"
              default-value="ai-prompt"
              :show-line-numbers="false"
              animate-lines
              copy-aria-label="Copy setup prompt"
            />
          </div>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
