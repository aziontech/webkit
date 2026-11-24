<script setup lang="ts">
  import CodeScrollFragment from '../parts/code-scroll-fragment.vue'

  defineOptions({ name: 'ApplicationFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the code scrolls to its end while it is, and back after. */
    hovered?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const CODE = `async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  const response = await fetch(request)
  const headers = new Headers(response.headers)

  headers.set("Cache-Control", ttl(pathname))
  headers.set("Vary", "Accept-Encoding")

  return new Response(response.body, {
    status: response.status,
    headers
  })
}

const RULES = [
  ["/assets/", "max-age=31536000"],
  ["/api/", "max-age=60"],
  ["/", "max-age=3600"]
]

function ttl(pathname) {
  const [, value] = RULES.find(([prefix]) =>
    pathname.startsWith(prefix)
  )
  return value
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})`

  const CACHE_LINE = 6

  const FILE = {
    label: 'Code',
    value: 'code',
    language: 'javascript',
    fileName: 'JavaScript',
    fileIcon: 'az-color az-javascript',
    code: CODE,
    highlightedLine: CACHE_LINE
  }
</script>

<template>
  <CodeScrollFragment
    :file="FILE"
    copy-aria-label="Copy the function code"
    :active="active"
    :hovered="hovered"
  />
</template>
