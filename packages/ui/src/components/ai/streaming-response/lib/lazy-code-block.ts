import { defineAsyncComponent } from 'vue'

import StreamingResponsePendingCode from '../parts/streaming-response-pending-code.vue'

export const LazyCodeBlock = defineAsyncComponent({
  loader: () => import('../../../code/code-block/code-block.vue'),
  loadingComponent: StreamingResponsePendingCode,
  delay: 0
})
