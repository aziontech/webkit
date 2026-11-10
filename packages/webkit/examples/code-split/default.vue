<script setup>
  import CodeSplit from '@aziontech/webkit/code-split'

  const codeTabs = [
    {
      label: 'cache-settings.json',
      value: 'cache-settings',
      language: 'json',
      code: '{\n  "cache_settings": {\n    "name": "api-cache",\n    "browser_cache_settings": {\n      "ttl": 60\n    },\n    "cdn_cache_settings": {\n      "ttl": 30\n    },\n    "cache_key": {\n      "query_string": "whitelist",\n      "query_string_fields": ["user_id", "category"],\n      "cookie": "whitelist",\n      "cookie_names": ["session_id", "region"]\n    },\n    "methods": ["GET", "POST", "OPTIONS"],\n    "stale_cache": true\n  }\n}',
      fileName: 'cache-settings.json',
      fileIcon: 'ai ai-json'
    }
  ]

  const primaryAction = {
    label: 'Learn more',
    href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/',
    trailing: true
  }
</script>

<template>
  <CodeSplit
    title="From basic caching to advanced acceleration"
    description="Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content."
    :code-tabs="codeTabs"
    copy-aria-label="Copy the cache settings sample"
    :primary-action="primaryAction"
  />
</template>
