# Tool Call

> One tool or command the agent invoked, shown in the conversation (AI Elements Tool, Cloudscape progressive steps): a row with the tool name in code font, an optional plain description, and a status (`Waiting`, `Preparing…`, `Running…`, `Completed`, `Failed`, `Canceled`, `Denied`), with the call's input and output in a collapsible panel. It is the record of what the agent did; authorization before it runs is `ToolApproval`.

- Import: `import ToolCall from '@aziontech/ui/tool-call'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [tool-call.json](tool-call.json)

## When to use

- An agent calls a tool, an MCP server, an API or a CLI command during a response, and the reader should see what ran and what came back.

## Do

- Name the tool exactly as it is (`list_workloads`) and describe it in plain words (`Listing your workloads`).
- Collapse details by default; open them on error so the reader sees why.
- Redact secrets from inputs and outputs.
- Map an SDK's states: arguments arriving → `streaming`; executing → `running`; awaiting approval → `pending`; result → `success`; failure → `error`; stopped by the reader (outcome cancelled) → `canceled`; approval refused (outcome denied) → `denied`.

## Don’t

- Asking the reader to allow a call → `tool-approval` (then a `tool-call` records it).
- The model's reasoning → `reasoning`.
- A long-running job outside a chat → `progress` / `status-indicator` on the resource.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tool-approval](tool-approval.md) — the authorization step before a sensitive call.
- [status-indicator](status-indicator.md) — the status the row shows.
- [code-block](code-block.md), `key-value-list` — what goes in the input and output slots.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `—` | true | The tool or command identifier, shown in code font (`list_workloads`). |
| `title` | `string` | `''` | false | What the call does in the reader's words (`Listing your workloads`). Empty shows only the name. |
| `status` | `'pending' \| 'streaming' \| 'running' \| 'success' \| 'error' \| 'canceled' \| 'denied'` | `'running'` | false | `pending` waits for authorization, `streaming` receives its arguments, `running` is in flight, then `success`, `error`, `canceled` (stopped before it finished) or `denied` (the reader refused it). |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled; details start collapsed. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `input` | — | The parameters the tool is called with (`CodeBlock`, `KeyValueList`). |
| `output` | — | What the tool returned, or the error it failed with. |

## Sub-components

_None. Exports: `"./tool-call"`; type `ToolCallStatus`. Composed DS components: `status-indicator`._

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                     |
| -------------- | --------- | ----------- | ------------- | ----------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Details expanded or collapsed. Unbound, the state is local and starts from `defaultOpen`. |

## States

- `data-status` mirrors `status`; `data-state="open|closed"` only when a slot makes it expandable.
- Status mapping: `pending` neutral, `streaming` neutral with spinner (`Preparing…`), `running` info with spinner (`Running…`), `success` success, `error` danger, `canceled` neutral, `denied` warning. Every status is distinct in text, never by color or spinner alone.
- Without `input` / `output` the row is static (no button).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the trigger.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles the details.
- ARIA: the trigger is a `button` with `aria-expanded` / `aria-controls`; the status is a `StatusIndicator` inside a `role="status"` region the ToolCall owns (StatusIndicator itself is not live), so a change from Preparing to Running to Completed (or Canceled) is announced; Input and Output are `section`s labelled by their `h4`.
- Status is conveyed in text, never by color alone.

## Right-to-left

- Layout: logical utilities (`ms-auto` on the chevron, `text-start`).
- Icons: wrench and chevron-down are not mirrored.
- Keyboard: none.
- User data: the tool name is `dir="ltr"` code.

## Internationalization

| Key                  | English source | Override prop |
| -------------------- | -------------- | ------------- |
| `toolCall.pending`   | `Waiting`      | —             |
| `toolCall.streaming` | `Preparing`    | —             |
| `toolCall.running`   | `Running`      | —             |
| `toolCall.success`   | `Completed`    | —             |
| `toolCall.error`     | `Failed`       | —             |
| `toolCall.canceled`  | `Canceled`     | —             |
| `toolCall.denied`    | `Denied`       | —             |
| `toolCall.input`     | `Input`        | —             |
| `toolCall.output`    | `Output`       | —             |

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: when the row has less than 12rem for the title beside the status, the status drops to its own line under the title, so the title keeps the row's width. The title wraps to two lines before it clamps, and the tool name drops to its own line under it when the row has no room for both, breaking anywhere instead of truncating, so the whole name always shows; the status stays visible.
- Touch: 40 px row.
- Reflow: code in details scrolls inside its block.

## Examples

### Default

```vue
<script setup>
  import ToolCall from '@aziontech/ui/tool-call'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="purge_urls"
      title="Purging one URL"
      status="pending"
    />
    <ToolCall
      name="create_cache_rule"
      title="Creating a cache rule for images"
      status="streaming"
    />
    <ToolCall
      name="list_workloads"
      title="Listing your workloads"
      status="running"
    />
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      status="success"
    />
    <ToolCall
      name="get_metrics"
      title="Reading the error rate"
      status="error"
    />
    <ToolCall
      name="list_certificates"
      title="Listing your certificates"
      status="canceled"
    />
    <ToolCall
      name="delete_domain"
      title="Deleting www.example.com"
      status="denied"
    />
  </div>
</template>
```

### WithDetails

```vue
<script setup>
  import CodeBlock from '@aziontech/ui/code-block'
  import ToolCall from '@aziontech/ui/tool-call'

  const input = JSON.stringify({ workload: 'storefront' }, null, 2)
  const output = JSON.stringify({ cache_by_query_string: 'all', ttl: 3600 }, null, 2)
  const failure = JSON.stringify({ error: 'metrics_unavailable', retry_after: 30 }, null, 2)
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      status="success"
    >
      <template #input>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'input', code: input, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
      <template #output>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'output', code: output, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
    <ToolCall
      name="get_metrics"
      title="Reading the error rate"
      status="error"
      default-open
    >
      <template #output>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'error', code: failure, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
  </div>
</template>
```
