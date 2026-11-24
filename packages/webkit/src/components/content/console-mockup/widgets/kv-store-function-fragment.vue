<script setup lang="ts">
  import CodeScrollFragment from '../parts/code-scroll-fragment.vue'

  defineOptions({ name: 'KvStoreFunctionFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the code scrolls to its end while it is, and back after. */
    hovered?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const CODE = `import { createClient } from 'azion/kv';
import type { KVClient } from 'azion/kv';

const client: KVClient = await createClient({
  namespace: 'app-state'
})
  .on('error', (err) => console.error('KV error:', err))
  .connect();

// Store a session with TTL
await client.set(
  'session:user-123',
  JSON.stringify({ userId: 'user-123', role: 'admin' }),
  { expiration: { type: 'EX', value: 3600 } }
);

// Retrieve the session
const session = await client.get('session:user-123');
console.log(session);

// Increment a counter
await client.incr('api:calls:today', 1);`

  const SET_LINE = 11

  const FILE = {
    label: 'Code',
    value: 'code',
    language: 'typescript',
    fileName: 'kv-store.ts',
    fileIcon: 'az-color az-typescript',
    code: CODE,
    highlightedLine: SET_LINE
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
