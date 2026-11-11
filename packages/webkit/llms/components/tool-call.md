# Tool Call

> One tool or command the agent invoked, shown in the conversation (AI Elements Tool, Cloudscape progressive steps): a row with the tool name in code font, an optional plain description, and a status (`Waiting`, `Running…`, `Completed`, `Failed`, `Denied`), with the call's input and output in a collapsible panel. It is the record of what the agent did; authorization before it runs is `ActionConfirmation`.

- Import: `import ToolCall from '@aziontech/webkit/tool-call'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [tool-call.json](https://github.com/aziontech/webkit/blob/main/.specs/tool-call.json)

## When to use

- An agent calls a tool, an MCP server, an API or a CLI command during a response, and the reader should see what ran and what came back.

## Do

- Name the tool exactly as it is (`list_workloads`) and describe it in plain words (`Listing your workloads`).
- Collapse details by default; open them on error so the reader sees why.
- Redact secrets from inputs and outputs.

## Don’t

- Asking the reader to allow a call → `action-confirmation` (then a `tool-call` records it).
- The model's reasoning → `reasoning`.
- A long-running job outside a chat → `progress` / `status-indicator` on the resource.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [action-confirmation](action-confirmation.md) — the authorization step before a sensitive call.
- [status-indicator](status-indicator.md) — the status the row shows.
- [code-block](code-block.md), `key-value-pairs` — what goes in the input and output slots.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `—` | true | The tool or command identifier, shown in code font (`list_workloads`). |
| `title` | `string` | `''` | false | What the call does in the reader's words (`Listing your workloads`). Empty shows only the name. |
| `state` | `'pending' \| 'running' \| 'success' \| 'error' \| 'denied'` | `'running'` | false | pending` waits for authorization, `running` is in flight, then `success`, `error` or `denied` (the reader refused it). |
| `open` | `boolean` | `undefined` | false | Controlled open state of the input and output details. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled; details start collapsed. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `boolean` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `input` | — | The parameters the tool is called with (`CodeBlock`, `KeyValuePairs`). |
| `output` | — | What the tool returned, or the error it failed with. |

## Sub-components

_None. Exports: `"./tool-call"`; type `ToolCallState`. Composed DS components: `status-indicator`._

## States

- `data-status` mirrors `state`; `data-state="open|closed"` only when a slot makes it expandable.
- Status mapping: `pending` neutral, `running` info with spinner, `success` success, `error` danger, `denied` warning.
- Without `input` / `output` the row is static (no button).

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the trigger.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles the details.
- ARIA: the trigger is a `button` with `aria-expanded` / `aria-controls`; the status is `StatusIndicator` (`role="status"`), so a change from Running to Completed is announced; Input and Output are `section`s labelled by their `h4`.
- Status is conveyed in text, never by color alone.

## Right-to-left

- Layout: logical utilities (`ms-auto` on the chevron, `text-start`).
- Icons: wrench and chevron-down are not mirrored.
- Keyboard: none.
- User data: the tool name is `dir="ltr"` code.

## Internationalization

| Key                | English source | Override prop |
| ------------------ | -------------- | ------------- |
| `toolCall.pending` | `Waiting`      | —             |
| `toolCall.running` | `Running`      | —             |
| `toolCall.success` | `Completed`    | —             |
| `toolCall.error`   | `Failed`       | —             |
| `toolCall.denied`  | `Denied`       | —             |
| `toolCall.input`   | `Input`        | —             |
| `toolCall.output`  | `Output`       | —             |

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: title and name truncate; the status stays visible.
- Touch: 40 px row.
- Reflow: code in details scrolls inside its block.

## Examples

### States

```vue
<script setup>
  import ToolCall from '@aziontech/webkit/tool-call'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="purge_urls"
      title="Purging one URL"
      state="pending"
    />
    <ToolCall
      name="list_workloads"
      title="Listing your workloads"
      state="running"
    />
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      state="success"
    />
    <ToolCall
      name="get_metrics"
      title="Reading the error rate"
      state="error"
    />
    <ToolCall
      name="delete_domain"
      title="Deleting www.example.com"
      state="denied"
    />
  </div>
</template>
```

### WithDetails

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'
  import ToolCall from '@aziontech/webkit/tool-call'

  const input = JSON.stringify({ workload: 'storefront' }, null, 2)
  const output = JSON.stringify({ cache_by_query_string: 'all', ttl: 3600 }, null, 2)
  const failure = JSON.stringify({ error: 'metrics_unavailable', retry_after: 30 }, null, 2)
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <ToolCall
      name="get_cache_settings"
      title="Reading the cache settings of storefront"
      state="success"
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
      state="error"
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
