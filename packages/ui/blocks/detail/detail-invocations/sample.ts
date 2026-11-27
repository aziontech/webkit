import type { InvocationsFunction, InvocationsInvocation } from './detail-invocations.vue'

export const sampleFunction: InvocationsFunction = {
  id: '40122',
  name: 'image-resizer',
  runtime: 'JavaScript',
  service: 'storefront-prod',
  serviceAddress: 'storefront.example.com',
  resource: 'storefront',
  rule: 'Optimize images',
  phase: 'Request',
  origin: 'origin-assets',
  originHost: 'assets.example.com'
}

export const sampleInvocations: InvocationsInvocation[] = [
  {
    id: 'inv_8f2c1a9d',
    status: 'Completed',
    startedAt: new Date(Date.UTC(2026, 10, 12, 14, 2, 11)),
    completedAt: new Date(Date.UTC(2026, 10, 12, 14, 2, 11)),
    duration: 412,
    location: 'San Francisco, US',
    trigger: 'GET https://images.example.com/hero-4k.jpg?format=avif',
    outcome: '200 OK, served from the transform, then written to cache.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started: GET /hero-4k.jpg?format=avif' },
      { at: 4, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
      { at: 16, level: 'info', message: 'Cache miss, fetching assets.example.com' },
      { at: 61, level: 'debug', message: 'TLS 1.3 established, cipher TLS_AES_128_GCM_SHA256' },
      { at: 202, level: 'info', message: 'Origin answered 200, image/jpeg, 2.4 MB' },
      { at: 256, level: 'debug', message: 'Decoded 3840x2160, re-encoding to avif q80' },
      { at: 348, level: 'info', message: 'Encoded 412 KB, 83% smaller' },
      { at: 386, level: 'info', message: 'Cached for 86400 s' },
      { at: 412, level: 'info', message: 'Invocation completed with 200' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-resizer',
        service: 'Function',
        icon: 'az az-functions',
        start: 0,
        duration: 412
      },
      {
        id: 'parse',
        parentId: 'root',
        name: 'parse-request',
        service: 'Compute',
        icon: 'az az-code',
        start: 4,
        duration: 12
      },
      {
        id: 'origin',
        parentId: 'root',
        name: 'fetch-origin',
        service: 'Network',
        icon: 'az az-send',
        start: 16,
        duration: 186
      },
      {
        id: 'dns',
        parentId: 'origin',
        name: 'dns-lookup',
        service: 'Network',
        icon: 'az az-send',
        start: 16,
        duration: 14
      },
      {
        id: 'tls',
        parentId: 'origin',
        name: 'tls-handshake',
        service: 'Security',
        icon: 'az az-lock',
        start: 30,
        duration: 31
      },
      {
        id: 'response',
        parentId: 'origin',
        name: 'origin-response',
        service: 'Network',
        icon: 'az az-send',
        start: 61,
        duration: 141
      },
      {
        id: 'decode',
        parentId: 'root',
        name: 'decode',
        service: 'Compute',
        icon: 'az az-code',
        start: 202,
        duration: 54
      },
      {
        id: 'transform',
        parentId: 'root',
        name: 'transform',
        service: 'Compute',
        icon: 'az az-code',
        start: 256,
        duration: 92
      },
      {
        id: 'cache',
        parentId: 'root',
        name: 'put-cache',
        service: 'Storage',
        icon: 'az az-object-storage',
        start: 348,
        duration: 38
      }
    ]
  },
  {
    id: 'inv_7d41be02',
    status: 'Failed',
    startedAt: new Date(Date.UTC(2026, 10, 12, 13, 50, 27)),
    completedAt: new Date(Date.UTC(2026, 10, 12, 13, 50, 28)),
    duration: 1240,
    location: 'Chicago, US',
    trigger: 'GET https://images.example.com/gallery-12.jpg?format=webp',
    outcome: '502, the origin did not answer within the 1 s budget.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started: GET /gallery-12.jpg?format=webp' },
      { at: 4, level: 'debug', message: 'args { defaultFormat: "webp", quality: 80 }' },
      { at: 15, level: 'info', message: 'Cache miss, fetching assets.example.com' },
      { at: 61, level: 'debug', message: 'TLS 1.3 established, waiting on response headers' },
      { at: 1061, level: 'warn', message: 'Origin silent for 1000 ms, read budget exhausted' },
      { at: 1216, level: 'error', message: 'ConnectionTimeout: read timed out after 1000 ms' },
      { at: 1240, level: 'error', message: 'Invocation failed with 502' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-resizer',
        service: 'Function',
        icon: 'az az-functions',
        start: 0,
        duration: 1240,
        status: 'error'
      },
      {
        id: 'parse',
        parentId: 'root',
        name: 'parse-request',
        service: 'Compute',
        icon: 'az az-code',
        start: 4,
        duration: 11
      },
      {
        id: 'origin',
        parentId: 'root',
        name: 'fetch-origin',
        service: 'Network',
        icon: 'az az-send',
        start: 15,
        duration: 1201,
        status: 'error'
      },
      {
        id: 'dns',
        parentId: 'origin',
        name: 'dns-lookup',
        service: 'Network',
        icon: 'az az-send',
        start: 15,
        duration: 12
      },
      {
        id: 'tls',
        parentId: 'origin',
        name: 'tls-handshake',
        service: 'Security',
        icon: 'az az-lock',
        start: 27,
        duration: 34
      },
      {
        id: 'response',
        parentId: 'origin',
        name: 'origin-response',
        service: 'Network',
        icon: 'az az-send',
        start: 61,
        duration: 1155,
        status: 'error',
        message: 'Read timed out after 1000 ms.'
      }
    ]
  },
  {
    id: 'inv_6a90c3f7',
    status: 'Running',
    startedAt: new Date(Date.UTC(2026, 10, 12, 14, 2, 40)),
    completedAt: null,
    duration: 168,
    location: 'San Francisco, US',
    trigger: 'GET https://images.example.com/product-88.jpg?format=avif',
    outcome: 'Still running, the origin has not answered yet.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started: GET /product-88.jpg?format=avif' },
      { at: 3, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
      { at: 13, level: 'info', message: 'Cache miss, fetching assets.example.com' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-resizer',
        service: 'Function',
        icon: 'az az-functions',
        start: 0,
        duration: 168,
        status: 'running'
      },
      {
        id: 'parse',
        parentId: 'root',
        name: 'parse-request',
        service: 'Compute',
        icon: 'az az-code',
        start: 3,
        duration: 10
      },
      {
        id: 'origin',
        parentId: 'root',
        name: 'fetch-origin',
        service: 'Network',
        icon: 'az az-send',
        start: 13,
        duration: 155,
        status: 'running'
      }
    ]
  }
]
