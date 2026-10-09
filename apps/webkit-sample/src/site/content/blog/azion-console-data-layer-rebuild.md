As the Azion Console grew, we started noticing a recurring pattern in navigation behavior: skeletons reappearing during screen transitions, lists being reloaded unnecessarily, and data disappearing after refresh.

At first, this looked like a performance problem, but the API was already fast. The real issue was different: the Console wasn’t preserving enough context between interactions and kept reconstructing state that was already available.

In this post, we share how we rebuilt the Console data layer, the technical decisions, edge cases, and patterns that proved useful beyond our own implementation.

## The original pattern

The Azion Console manages applications, security policies, serverless functions, storage, databases, certificates, and other distributed infrastructure resources. It’s used by teams, often across multiple tabs and concurrent sessions.

Like many SPAs that evolve over time, the original data layer followed a simple pattern:

```javascript
export const listEdgeNodes = async (params) => {
  const response = await AxiosHttpClientAdapter.request({
    url: `/api/v3/edge_nodes?${qs(params)}`,
    method: 'GET'
  })
  return response.data.results.map(adapt)
}
```

Each view fetched its own data during mount. For a while, this worked. The problem appeared as the Console grew: more resources meant more screen transitions, more concurrent states, and more situations where different parts of the interface depended on the same data.

The symptoms:

- Every navigation triggered new requests, even for data fetched seconds before
- Edit pages re-fetched data already visible in the previous screen
- Different components requested the same resource in parallel
- Mutations required manual refetch orchestration
- Tabs open simultaneously started to diverge

The bottleneck wasn’t request speed. It was coordinating cache behavior across the application. This coordination problem required a structural solution, not just local optimizations.

## Centralized service architecture

The first instinct would be to replace fetch calls with TanStack Query hooks. That would solve deduplication and local cache. But the core problem would remain: each view would still define its own data loading, invalidation, and synchronization rules independently.

As long as this behavior remained fragmented, consistency would be accidental, not structural.

The solution was to introduce a BaseService abstraction responsible for centralizing this contract:

```
export class BaseService {
  http = httpService
  queryClient = queryClient
  queryKeys = queryKeys

  useQuery(queryKey, queryFn, options = {}) { /* ... */ }
  useMutation(mutationFn, options = {}) { /* ... */ }
  async usePrefetchQuery(queryKey, queryFn, options = {}) { /* ... */ }

  getFromCache({ queryKey, id }) {
    // Returns synchronously from in-memory cache
  }
}
```

Every domain service extends this base. Views stopped deciding how to fetch and update data, consuming services instead. Cache, invalidation, persistence, and synchronization evolved from local decisions into shared capabilities.

With services centralized, the problem shifted from “how to fetch data” to “how to invalidate consistently.”

## Hierarchical query keys

The first architectural decision was query key structure. Before the migration, they were ad-hoc strings. After, they became a centralized hierarchical structure:

```
export const queryKeys = {
  application: {
    all: ['application'],
    detail: (id) => [...queryKeys.application.all, id],
    list: (params) => [
      ...queryKeys.application.all,
      'list',
      normalizeParams(params)
    ]
  }
}
```

This hierarchy enables predictable bulk invalidation: invalidating queryKeys.application.all automatically invalidates lists, details, and nested resources without tracking individual query shapes. This property became essential once we implemented SSE-driven invalidation and cross-tab synchronization.

### Parameter identity problem

An early problem appeared: cache misses caused by parameters that represented the same query but generated different keys. These two calls needed to produce the same cache key:

```
useQuery(queryKeys.application.list({}))
useQuery(queryKeys.application.list({ fields: [] }))
```

Without normalization, they made separate requests. The fix:

```
const normalizeParams = (params) => {
  if (!params || typeof params !== 'object') return params
  const normalized = { ...params }
  for (const key of Object.keys(normalized)) {
    if (Array.isArray(normalized[key]) && normalized[key].length === 0) {
      delete normalized[key]
    }
  }
  return normalized
}
```

When equivalent queries generate different keys, cache consistency breaks — regardless of any sophistication built on top.

## Cache hydration in list-to-edit flows

Parameter normalization solved cache misses, but didn’t address a more visible problem for users: transitioning from list to edit always started from zero. Even when the previous view had just fetched that exact item, the application ignored available data in memory and waited for a new request.

The solution was synchronous cache hydration:

```
<script setup>
const cachedEdgeNode =
  edgeNodeService.getEdgeNodeFromCache(edgeNodeId.value)

if (cachedEdgeNode?.name) {
  edgeNode.value = cachedEdgeNode
}
</script>
```

The edit page renders immediately with cache data. The full detail request still runs in parallel for additional fields not included in list responses, but the interface isn’t blocked by it. Titles appear instantly, breadcrumbs populate, the form is already available.

It’s a technique applicable to any SPA with list-to-detail patterns. In many cases, the data already exists in memory — the application simply isn’t wired to reuse it.

## Persistence beyond the session

In-memory cache resolved navigation redundancy, but data still disappeared after refresh. For a tool used in infrastructure operations, that means losing context and reconstructing state that had already been loaded.

We added persistence via IndexedDB using idb-keyval. The choice over localStorage was due to quota limits and because synchronous operations become a problem as volume grows.

Since persisted data included resource names and account metadata, we encrypted the cache at rest with AES-GCM via Web Crypto API:

```
async function generateKey() {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // extractable: false — inaccessible to application JS
    ['encrypt', 'decrypt']
  )
}
```

The extractable: false parameter is intentional: the key cannot be read by application JavaScript, only used through the browser’s cryptographic interface.

To reduce pressure on IndexedDB, writes are batched in small time windows. The trade-off is accepting the possibility of losing the last delta if the tab is closed immediately after a mutation — acceptable because persistence works as an optimization layer, not as source of truth.

## Cross-tab synchronization

Without synchronization, a mutation in one tab leaves others with stale state. The first layer used TanStack Query’s broadcastQueryClient plugin:

```
broadcastQueryClient({
  queryClient,
  broadcastChannel: 'app-azion-sync'
})
```

This propagates mutations and invalidations between tabs, but only covers local changes within the current browser session. For external infrastructure events or changes made by other users, we added a persistent SSE connection receiving backend activity:

```
{
  "type": "activity",
  "data": {
    "activity_type": "updated",
    "resource": { "type": "application", "id": "42" }
  }
}
```

These events are translated into invalidations with refetchType: ‘none’ — the query is marked stale and revalidated the next time it’s observed, not immediately. Without this behavior, large deployments could trigger request storms across open sessions.

### Primary tab election

Multiple SSE connections across simultaneous tabs became wasteful. The solution was a primary tab election system via BroadcastChannel: only one tab maintains the active SSE connection. If that tab closes, another is elected automatically. The primary tab receives events and propagates invalidations via broadcast to secondary tabs.

## Invalidation edge cases

With synchronization layers in place, edge cases emerged in scenarios we hadn’t initially anticipated. Fetching data proved relatively straightforward. Maintaining coherence across mutations, persistence, multiple tabs, reconnections, and account switching was significantly harder.

During account switch, a broadcast notification was emitted before cache cleanup completed. Secondary tabs received the new context while still holding cache from the previous account, causing inconsistent behavior.

During logout, calling queryClient.clear() before canceling active queries allowed in-flight requests to repopulate newly cleared caches. The fix required strict teardown order:

```
cancelQueries → invalidateQueries → removeQueries → clear
```

The most recurrent failure class involved mutations updating one UI section while another continued rendering stale data because not all child query keys had been invalidated. Over time, invalidation logic evolved into its own layer with explicit maps for resource relationships and mutations.

## Trade-offs accepted

| Trade-off | Mitigation |
|---|---|
| Larger bundle size | Tree-shaking and scoped abstractions |
| Possibility of stale state | SSE invalidation and explicit mutation sync |
| Increased invalidation complexity | Centralized query contracts and invalidation mapping |
| IndexedDB availability | Graceful fallback |
| Multi-tab coordination complexity | Broadcast debugging tooling and controlled ownership |

One specific decision: disabling automatic refetch on window focus (refetchOnWindowFocus: false). In many applications this pattern makes sense, but in the Console it created unexpected loading states, interrupted forms mid-edit, and generated race conditions. We prioritized continuity over aggressive freshness — a choice that only works reliably because SSE-driven and mutation-driven invalidation provide a separate update guarantee.

## Patterns that proved replicable

Hierarchical query keys — If you have nested resources, structure query keys as a tree. This enables bulk invalidation without tracking queries individually.

Synchronous cache hydration — In list-to-detail flows, list data frequently contains enough fields to render the edit screen immediately. getFromCache synchronous + detail request in parallel is high impact with almost zero code.

Explicit teardown order — queryClient.clear() doesn’t cancel in-flight queries. Without explicit order (cancelQueries → invalidateQueries → removeQueries → clear), in-flight requests repopulate newly cleared cache.

Primary tab election for SSE — Multiple SSE connections across tabs is wasteful. An election system via BroadcastChannel ensures only one tab maintains the active connection.

Parameter normalization — Cache misses caused by <span data-cms-snippet-type=“inline” data-cms-snippet-id=“dbc3f44f-ee06-4038-aebf-a25d70910885” data-cms-snippet-data=“eyJ0ZW1wbGF0ZSI6IlxcIiwiX2hpZGRlbiI6dHJ1ZSwiX3NuaXBwZXRfdHlwZSI6Il9jY19tZHhfdW5rbm93bl90ZW1wbGF0ZSIsIl9tZXRhIjp7InRlbXBsYXRlIjp7Im9yaWdpbmFsRGF0YSI6W3siX3R5cGUiOiJ0ZXh0IiwidGV4dCI6IlxcIn1dfX19”> vs <span data-cms-snippet-type=“inline” data-cms-snippet-id=“34f2ad0e-67be-467b-b510-4cd138f93d64” data-cms-snippet-data=“eyJ0ZW1wbGF0ZSI6IiBmaWVsZHM6IFxcW1xcXSBcXCIsIl9oaWRkZW4iOnRydWUsIl9zbmlwcGV0X3R5cGUiOiJfY2NfbWR4X3Vua25vd25fdGVtcGxhdGUiLCJfbWV0YSI6eyJ0ZW1wbGF0ZSI6eyJvcmlnaW5hbERhdGEiOlt7Il90eXBlIjoidGV4dCIsInRleHQiOiIgZmllbGRzOiBcXFtcXF0gXFwifV19fX0=”> are easy to overlook and hard to debug. Normalizing parameters before building query keys avoids an entire class of inconsistencies.

## Resulting architecture

```
Vue components
     │
     ▼
Domain services (ApplicationService, EdgeFunctionService, ...)
     │
     ▼
TanStack Query (cache + request deduplication)
     │
     ├── IndexedDB persistence (encrypted via Web Crypto API)
     ├── BroadcastChannel synchronization
     └── SSE-driven invalidation
              │
              └── Infrastructure activity events
```

## Conclusion

The data layer rebuild followed a direction contrary to what the initial problem suggested. When symptoms were “skeletons appearing” and “repeated requests,” the obvious solution seemed to be “make fewer requests.” In practice, what solved it was treating cache invalidation as architecture, not as side effect.

Hierarchical query keys, centralized services, encrypted persistence, cross-tab synchronization, and SSE primary election aren’t isolated features. They form a system where data loaded once remains available until something externally verifiable determines it needs updating.

For developers building SPAs with multiple views depending on the same resources, the core lesson is: the problem is rarely request latency. It’s state coherence. And state coherence is solved with invalidation architecture, not with ad-hoc fetch optimizations.

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [idb-keyval](https://github.com/jakearchibald/idb-keyval)
