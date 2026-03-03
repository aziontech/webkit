/**
 * This file was automatically generated based on your preset configuration.
 *
 * For better type checking and IntelliSense:
 * 1. Install azion as dev dependency:
 *    npm install -D azion
 *
 * 2. Use defineConfig:
 *    import { defineConfig } from 'azion'
 *
 * 3. Replace the configuration with defineConfig:
 *    export default defineConfig({
 *      // Your configuration here
 *    })
 *
 * For more configuration options, visit:
 * https://github.com/aziontech/lib/tree/main/packages/config
 */

module.exports = {
  build: {
    preset: 'vue',
    polyfills: true
  },
  storage: [
    {
      name: 'icons-gallery',
      prefix: '1772549361146',
      dir: './.edge/assets',
      workloadsAccess: 'read_only'
    }
  ],
  connectors: [
    {
      name: 'icons-gallery',
      active: true,
      type: 'storage',
      attributes: {
        bucket: 'icons-gallery',
        prefix: '1772549361146'
      }
    }
  ],
  applications: [
    {
      name: 'icons-gallery',
      cache: [
        {
          name: 'icons-gallery',
          browser: {
            maxAgeSeconds: 7200
          },
          edge: {
            maxAgeSeconds: 7200
          }
        }
      ],
      rules: {
        request: [
          {
            name: 'Deliver Static Assets and Set Cache Policy',
            description:
              'Deliver static assets directly from storage and set cache policy',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument:
                    '\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|ttf|otf|woff|woff2|eot|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4|webm|mp3|wav|ogg|css|js|json|xml|html|txt|csv|zip|rar|7z|tar|gz|webmanifest|map|md|yaml|yml)$'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'icons-gallery'
                }
              },
              {
                type: 'set_cache_policy',
                attributes: {
                  value: 'icons-gallery'
                }
              },
              {
                type: 'deliver'
              }
            ]
          },
          {
            name: 'Redirect to index.html',
            description:
              'Handle all routes by rewriting to index.html for client-side routing',
            active: true,
            criteria: [
              [
                {
                  variable: '${uri}',
                  conditional: 'if',
                  operator: 'matches',
                  argument: '^\/'
                }
              ]
            ],
            behaviors: [
              {
                type: 'set_connector',
                attributes: {
                  value: 'icons-gallery'
                }
              },
              {
                type: 'rewrite_request',
                attributes: {
                  value: '/index.html'
                }
              }
            ]
          }
        ],
        response: []
      }
    }
  ],
  workloads: [
    {
      name: 'icons-gallery',
      active: true,
      infrastructure: 1,
      deployments: [
        {
          name: 'icons-gallery',
          current: true,
          active: true,
          strategy: {
            type: 'default',
            attributes: {
              application: 'icons-gallery'
            }
          }
        }
      ]
    }
  ]
}
