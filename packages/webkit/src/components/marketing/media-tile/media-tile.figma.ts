// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=6784-16296
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/marketing/media-tile/media-tile.vue
// component=MediaTile
import figma from 'figma'

const instance = figma.selectedInstance

const kind = instance.getEnum('kind', {
  frame: 'frame',
  plain: 'plain'
})
const padded = instance.getEnum('padded', {
  true: true,
  false: false
})
const fluid = instance.getEnum('fluid', {
  true: true,
  false: false
})
const media = instance.getSlot('media')
const captionLayer = instance.findText('Caption text')
const caption = captionLayer.type === 'TEXT' ? captionLayer.textContent.trim() : ''
const leadEnd = caption.indexOf('. ')
const title = leadEnd > -1 ? caption.slice(0, leadEnd + 1) : caption
const description = leadEnd > -1 ? caption.slice(leadEnd + 2) : ''

export default {
  example: figma.code`<MediaTile
  title="${title}"${
    description
      ? figma.code`
  description="${description}"`
      : ''
  }${
    kind === 'plain'
      ? figma.code`
  kind="plain"`
      : ''
  }${
    padded === false
      ? figma.code`
  :padded="false"`
      : ''
  }${
    fluid
      ? figma.code`
  fluid`
      : ''
  }
>${
    media
      ? figma.code`
  <template #media>
    ${media}
  </template>`
      : ''
  }
</MediaTile>`,
  imports: ["import MediaTile from '@aziontech/webkit/media-tile'"],
  id: 'media-tile',
  metadata: { nestable: false }
}
