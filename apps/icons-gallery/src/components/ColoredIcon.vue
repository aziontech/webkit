<script>
  import { h } from 'vue'

  // Renders a trusted inline SVG string from @aziontech/icons/color-catalog.
  // Colored brand icons keep their own palette, so they cannot be a recolorable
  // font glyph. A render function with innerHTML inlines the markup without the
  // template `v-html` directive (vue/no-v-html). The svg is a build-time package
  // asset, never user input.
  export default {
    name: 'ColoredIcon',
    props: {
      svg: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      }
    },
    render() {
      return h('span', {
        class: 'inline-flex [&>svg]:w-full [&>svg]:h-full',
        style: { width: `${this.size}px`, height: `${this.size}px` },
        innerHTML: this.svg
      })
    }
  }
</script>
