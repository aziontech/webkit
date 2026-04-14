<script>
  // Using hex escape sequences for angle brackets to avoid Vue template parser issues
  // \x3C = < (less than), \x3E = > (greater than), \x2F = / (slash)
  const ANGLE_OPEN = '\x3C'
  const ANGLE_CLOSE = '\x3E'
  const SLASH = '\x2F'

  export default {
    props: {
      showCursor: {
        type: Boolean,
        default: false
      },
      prefix: {
        type: String,
        default: '',
        validator: (value) =>
          ['', '//', ANGLE_OPEN + ANGLE_CLOSE, ANGLE_OPEN + SLASH + ANGLE_CLOSE].includes(value)
      }
    }
  }
</script>

<template>
  <div
    class="flex items-center gap-1 relative w-fit pl-1 bg-gray-900"
    :class="!showCursor ? 'pr-1' : 'pr-0'"
  >
    <span
      v-if="prefix"
      class="font-proto-mono text-default font-medium leading-1 tracking-tightest whitespace-nowrap text-overline-md"
    >
      {{ prefix }}
    </span>
    <span
      class="font-proto-mono text-brand-primary-400 font-medium leading-1 tracking-tightest whitespace-nowrap uppercase text-overline-md"
    >
      <slot />
    </span>
    <span
      v-if="showCursor"
      class="w-1 h-5 shrink-0 relative bg-brand-accent-400 animate-blink"
    />
  </div>
</template>
