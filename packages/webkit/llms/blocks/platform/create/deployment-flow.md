# DeploymentFlow (`platform/create/deployment-flow`)

> The deploy flow card a create flow streams while it deploys: a Card titled Deployment whose header carries the run status, a StatusIndicator while it runs and the Phased or Complete ToggleGroup once it has failed, opening on a cloning splash and then streaming the DeploymentLogs block with its controls moved up to that header: a Logs row with the step count, the pipeline as an Accordion of steps, each with its status glyph, its time and its own LogView, over a flush Progress. A create flow that provisions rather than deploys titles it Provisioning, with a Creating status and a Provisioning splash; the standalone logs block is the DeploymentLogs template. The live stream is shown here as one story per state, with the steps and log lines of the template deploy pipeline. Built from Card, StatusIndicator, ToggleGroup, Accordion, LogView, Spinner, Tag and Progress.

- Surface: product
- Source: `blocks/platform/create/deployment-flow/deployment-flow.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/deployment-flow")`
- Components: [Accordion](../../../components/accordion.md), [Card](../../../components/card.md), [LogView](../../../components/log-view.md), `LogViewContent`, [Progress](../../../components/progress.md), [Spinner](../../../components/spinner.md), [StatusIndicator](../../../components/status-indicator.md), [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-ui-states`, `webkit-errors`

## Asked as

deployment progress; build logs; deploy logs; creation progress; deployment status; build pipeline; deploy failed; progresso do deploy; logs de build; status da implantação; deploy flow; streaming deploy logs; fluxo de deploy

The card a create flow hands its column to once the user has pressed Deploy. The user waits here for the first deploy of what they just made: they need to know that it started, what it is doing now, how far it has gone and, if it stops, which step failed and why. The card opens on a cloning splash, then streams the pipeline steps with their logs, and either hands over to the success screen or stays open on the failure.

## When to use

- A create flow (a template deploy, an import from Git, a provision wizard) starts a build or a provisioning run the user should watch before the resource is usable.
- The run is long enough to need progress, and short enough that the user stays on the page for it.
- A failed run must keep the user in the flow, with the failing step open on its output.

## When not to use

- The logs of a deployment that already exists, read from its detail page: use `platform/detail/deployment-logs`.
- A run of half a minute or more the user is expected to leave and come back to: use `platform/states/async-submit`, which reports the status where the user returns.
- A dropped folder being uploaded before anything is built: use the Initializing overlay in `platform/states/project-intake`.
- The outcome once the run has finished: hand the column to `platform/create/deploy-success`; do not keep the finished card as the last screen.

## Building blocks

### A. Deployment card — `Card` (required)

`Card :padded="false"` at the full width of the flow's column. The header names the run in one word, Deployment, or Provisioning when the flow provisions rather than deploys. The content opens on the cloning splash: the source and the destination glyphs, then one line naming the repository and the scope it is cloned into. Once the first step starts, the content becomes the pipeline: a Logs row with the step count, one `Accordion` item per step with its status glyph, its time and its own `LogView`, and a flush `Progress` on the bottom edge while the run goes. Only the step in flight is open; finished steps collapse.

### B. Run status — `StatusIndicator` (required)

Sits in the card header, opposite the title. While the run goes it is a loading `StatusIndicator` with `severity="info"` and a progressive label, Building or Creating. When the run settles, the outcome moves to a `Tag` in the Logs row (Completed or Failed) and, after a failure, the header swaps the indicator for the Phased or Complete `ToggleGroup` so the user can read the logs step by step or as one console.

## Do

- Open on the cloning splash the moment Deploy is pressed, so the column never goes blank between the form and the first log line.
- Keep one step open at a time: the one running, or the one that failed.
- Show each step's time once it ends, and the step count in the Logs row while it runs.
- On failure, open the failing step on its error output and mark the steps behind it Skipped.
- Retire the progress bar when the run settles, then hand over to `platform/create/deploy-success` a beat after the last line prints.

## Don't

- Don't show a bare spinner with no words; the status label says what is happening.
- Don't put the run status in a toast; it belongs in the card header.
- Don't auto-advance to the success screen after a failure, or hide the logs that explain it.
- Don't expand every finished step; a long log pushes the step in flight out of view.
- Don't add a Cancel or a second action to the card; the flow around it owns navigation.

## Copy

- **Card title:** one noun naming the run, e.g. "Deployment" or "Provisioning".
- **Run status:** the progressive form of the verb with `…` only while in progress, e.g. "Building…" in prose, "Building" as an indicator label.
- **Splash line:** fragments naming source and destination, e.g. "Cloning acme/web-app to acme".
- **Outcome tag:** one or two words stating the result, e.g. "Completed", "Failed".
- **Pending steps:** say they have not started, e.g. "Waiting to start…".
- **Errors:** the log output says what failed; the step title names the step in sentence case, e.g. "Routing rules".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no exclamation marks.

## Accessibility

- The status label is text, not only a colour or a spinner; screen readers hear Building, then the outcome.
- The progress bar has an accessible name, e.g. "Deployment progress", and the logs region an `aria-label`.
- Decorative glyphs in the splash and in step rows carry `aria-hidden="true"`; the status of each step is also given in words.
- Step headers are keyboard-operable accordion triggers; opening a step does not move focus.
- New log lines do not steal focus or announce one by one; the step change and the outcome are what is announced.

## States

- Initial: Deploy was just pressed; the cloning splash with a Building indicator, before the first step starts.
- Running: two steps done with their times, the current step spinning and open on its lines, the step count shown and the progress bar on the bottom edge.
- Finished: every step checked and collapsed, a Completed tag, the progress bar retired, just before the success screen.
- Failed: the failing step open on its error output with a Failed tag, the later steps Skipped, and the Phased or Complete switch in the header.

## Related

- `platform/detail/deployment-logs` — the same logs as a standalone block on a deployment's detail page.
- `platform/create/deploy-success` — the screen the column hands over to once the run finishes.
- `platform/create/deploy-template` — the template flow that streams this card after Deploy.
- `platform/create/provision-wizard` — a create flow that titles the card Provisioning.
- `platform/states/async-submit` — a long run the user leaves and comes back to.
- `Card` — the container; see `skills/webkit-ui-states` for loading, progress and failure rendering.

## Variants

- `Initial` — primary (the code below)
- `Running` — Mid-stream: two steps checked with their times, Install dependencies spinning and open on the lines printed so far, the step count in the Logs row and the progress bar on the bottom edge.
- `Finished` — The last line has printed: every step checked and collapsed, a Completed Tag in the Logs row and the progress bar retired, a beat before the flow hands over to its success screen.
- `Failed` — The routing rules were rejected: that step is open on its error output with a Failed Tag, the steps behind it read Skipped, and the header swaps the status for the Phased or Complete switch.

Each variant is the same screen in another state: `get_pattern("platform/create/deployment-flow", { variant })`, or the file under `blocks/platform/create/deployment-flow/variants/`.

## Code (`Initial`)

```vue
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <Card
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
      <StatusIndicator
        loading
        severity="info"
        label="Building"
      />
    </template>

    <template #content>
      <div
        class="flex min-h-(--size-96) flex-col items-center justify-center gap-(--spacing-xl) p-(--spacing-lg)"
      >
        <div
          class="w-(--size-64) overflow-hidden rounded-(--shape-card) border border-(--primary) bg-(--bg-surface)"
        >
          <div class="flex items-center gap-(--spacing-xxs) border-b border-(--border-default)">
            <span class="size-2 rounded-full bg-(--danger)" />
            <span class="size-2 rounded-full bg-(--warning)" />
            <span class="size-2 rounded-full bg-(--success)" />
          </div>
          <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
            <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
            <div class="flex items-center justify-center gap-(--spacing-lg) py-(--spacing-sm)">
              <span
                class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
              >
                <i
                  class="ai ai-github text-body-lg"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-selected) bg-(--bg-canvas) text-(--primary)"
              >
                <i
                  class="pi pi-server text-body-lg"
                  aria-hidden="true"
                />
              </span>
            </div>
            <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
          </div>
        </div>

        <div
          class="flex max-w-(--container-lg) flex-wrap items-center justify-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
        >
          <span>Cloning</span>
          <span
            class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
          >
            <i
              class="ai ai-github text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            acme/web-app
          </span>
          <span class="text-(--text-muted)">to</span>
          <span
            class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
          >
            <i
              class="ai ai-github text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            acme
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>
```
