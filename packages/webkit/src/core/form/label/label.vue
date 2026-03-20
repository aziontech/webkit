<script setup>
  import { ref, onMounted } from 'vue'

  defineOptions({ name: 'label-block' })

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  })

  const requiredSpanRef = ref(null)

  onMounted(() => {
    if (!props.isRequired || !requiredSpanRef.value) return
    const el = requiredSpanRef.value
    const style = window.getComputedStyle(el)
    const rootFont = window.getComputedStyle(document.documentElement).fontSize
    // #region agent log
    fetch('http://127.0.0.1:7933/ingest/fe0f761d-e03e-4624-9eb0-7efddd50468d', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '769250' }, body: JSON.stringify({ sessionId: '769250', location: 'label.vue:onMounted', message: 'Required span computed style', data: { color: style.color, fontSize: style.fontSize, rootFontSize: rootFont, hasTextColorSecondary: el.classList.contains('text-color-secondary') }, timestamp: Date.now(), hypothesisId: 'H1' }) }).catch(() => {})
    // #endregion
  })
</script>

<template>
  <label
    v-bind="$attrs"
    class="text-color text-base font-medium leading-5 flex gap-1 align-items-center"
  >
    {{ props.label }}
    <div
      v-if="props.isRequired"
      class="text-sm text-orange-500 flex gap-1"
    >
      *
      <!-- #region agent log -->
      <span
        ref="requiredSpanRef"
        class="text-[0.625rem] text-color-secondary"
      >(Required)</span>
      <!-- #endregion -->
    </div>
  </label>
</template>
