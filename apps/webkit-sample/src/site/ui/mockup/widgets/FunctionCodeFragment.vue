<script setup lang="ts">
  import CodeBlock from '@aziontech/webkit/code-block'
  import { ref } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'FunctionCodeFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true })

  const CODE = `async function handleRequest(request, args) {
  const { pathname } = new URL(request.url)
  if (args.allow.includes(pathname)) {
    return fetch(request)
  }

  const token = request.headers.get(args.header)
  if (!token) {
    return new Response(args.message, {
      status: args.status
    })
  }
  return fetch(request)
}

addEventListener("fetch", (event) =>
  event.respondWith(
    handleRequest(event.request, event.args)
  )
)`

  const ARGS = `{
  "header": "authorization",
  "status": 401,
  "message": "Unauthorized",
  "allow": [
    "/",
    "/health",
    "/status",
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/assets/logo.svg",
    "/assets/app.css"
  ]
}`

  const FILES = [
    { label: 'Code', value: 'code', language: 'javascript', code: CODE, highlightedLine: 7 },
    { label: 'Args', value: 'args', language: 'javascript', code: ARGS }
  ]

  const tab = ref('code')
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    :chrome="false"
    :active="active"
    interactive
    :width="500"
    :mobile-width="480"
  >
    <div class="h-full py-(--spacing-xs)">
      <MockupPart :order="0">
        <div
          class="overflow-hidden rounded-(--shape-elements) [border:var(--illustration-rim-width)_solid_transparent] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)]"
        >
          <CodeBlock
            v-model:value="tab"
            :tabs="FILES"
            :border="false"
            show-line-numbers
            copy-aria-label="Copy the function code"
          />
        </div>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
