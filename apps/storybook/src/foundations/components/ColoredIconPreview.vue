<script>
import { h } from 'vue';

// Renders a trusted inline SVG string from @aziontech/icons/color-catalog.
// Colored brand icons keep their own palette, so they cannot be a recolorable
// font glyph. The size is applied by rewriting the SVG's own width/height
// (the viewBox handles scaling), and innerHTML inlines the markup without the
// template `v-html` directive (vue/no-v-html). The svg is a build-time package
// asset, never user input.
export default {
  name: 'ColoredIconPreview',
  props: {
    svg: { type: String, required: true },
    size: { type: Number, default: 24 },
  },
  computed: {
    sizedSvg() {
      return this.svg
        .replace(/\swidth="[^"]*"/, ` width="${this.size}"`)
        .replace(/\sheight="[^"]*"/, ` height="${this.size}"`);
    },
  },
  render() {
    return h('span', { class: 'inline-flex', innerHTML: this.sizedSvg });
  },
};
</script>
