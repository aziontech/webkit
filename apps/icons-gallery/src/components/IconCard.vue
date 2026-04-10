<script setup>
  import { ref } from 'vue'

  // SVGs são importados lazily via Vite glob (substitui o require() do webpack)
  const svgModules = import.meta.glob(
    '../../node_modules/@aziontech/icons/src/svg-raw/**/*.svg',
    { query: '?raw', import: 'default', eager: false }
  )

  // Props
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    keywords: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    downloadFormat: {
      type: String,
      required: true
    }
  })

  // Data
  const showCheckIcon = ref(false)
  const showImageCheckIcon = ref(false)
  const mySlot = ref(null)

  // Extrai pixels de "20px" → 20
  function getPixelSize(sizeClass) {
    if (typeof sizeClass === 'string' && sizeClass.endsWith('px')) {
      return parseInt(sizeClass.replace('px', ''), 10)
    }
    return sizeClass
  }

  // Carrega o SVG raw do ícone pelo nome (ex: "ai-ai-pillar" ou "pi-address-book")
  async function loadSvg(iconName) {
    const targetFile = `/${iconName}.svg`
    const key = Object.keys(svgModules).find((k) => k.endsWith(targetFile))
    if (!key) throw new Error(`SVG not found: ${iconName}`)
    return await svgModules[key]()
  }

  // Aplica cor e dimensão ao SVG (substitui currentColor e redimensiona)
  function applyColorAndSize(svg, color, size) {
    const dimension = getPixelSize(size)
    svg = svg.replace(/fill="currentColor"/g, `fill="${color}"`)

    // Os SVGs não têm viewBox: captura o width/height original e cria um,
    // caso contrário os paths ficam em coordenadas 14×14 e não escalam.
    if (!svg.includes('viewBox')) {
      const origW = (svg.match(/width="([^"]*)"/) || [])[1] || '14'
      const origH = (svg.match(/height="([^"]*)"/) || [])[1] || '14'
      svg = svg.replace('<svg', `<svg viewBox="0 0 ${origW} ${origH}"`)
    }

    svg = svg.replace(/\s*(width|height)="[^"]*"/g, '')
    svg = svg.replace('<svg', `<svg width="${dimension}" height="${dimension}"`)
    return svg
  }

  // Renderiza SVG em canvas e retorna o blob PNG
  function svgToPngBlob(svgString, dimension) {
    return new Promise((resolve, reject) => {
      // xmlns é obrigatório para o browser renderizar SVG via img.src/blob URL
      if (!svgString.includes('xmlns=')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }

      const canvas = document.createElement('canvas')
      canvas.width = dimension
      canvas.height = dimension
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, dimension, dimension)
        canvas.toBlob((blob) => resolve(blob), 'image/png')
        URL.revokeObjectURL(img.src)
      }
      img.onerror = (e) => {
        URL.revokeObjectURL(img.src)
        reject(new Error(`Failed to load SVG as image: ${e}`))
      }
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
      img.src = URL.createObjectURL(svgBlob)
    })
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  async function downloadIcon() {
    if (props.downloadFormat === 'svg') {
      downloadSVG()
    } else {
      downloadPNG()
    }
  }

  async function downloadSVG() {
    try {
      let svg = await loadSvg(props.name)
      svg = applyColorAndSize(svg, props.color, props.size)
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${props.name.toLowerCase()}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download SVG:', error)
    }
  }

  async function downloadPNG() {
    try {
      let svg = await loadSvg(props.name)
      const dimension = getPixelSize(props.size)
      svg = applyColorAndSize(svg, props.color, props.size)
      const blob = await svgToPngBlob(svg, dimension)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${props.name.toLowerCase()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download PNG:', error)
    }
  }

  async function copyCode() {
    try {
      await copyToClipboard(`<i class="${props.icon}"></i>`)
      showCheckIcon.value = true
      setTimeout(() => {
        showCheckIcon.value = false
      }, 1200)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  async function copyImage() {
    if (props.downloadFormat === 'svg') {
      copySVG()
    } else {
      copyPNG()
    }
  }

  async function copySVG() {
    try {
      let svg = await loadSvg(props.name)
      svg = applyColorAndSize(svg, props.color, props.size)
      await copyToClipboard(svg)
      showImageCheckIcon.value = true
      setTimeout(() => {
        showImageCheckIcon.value = false
      }, 1200)
    } catch (error) {
      console.error('Failed to copy SVG:', error)
    }
  }

  async function copyPNG() {
    try {
      let svg = await loadSvg(props.name)
      const dimension = getPixelSize(props.size)
      svg = applyColorAndSize(svg, props.color, props.size)
      const blob = await svgToPngBlob(svg, dimension)
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      } else {
        const reader = new FileReader()
        reader.onloadend = () => copyToClipboard(reader.result)
        reader.readAsDataURL(blob)
      }
      showImageCheckIcon.value = true
      setTimeout(() => {
        showImageCheckIcon.value = false
      }, 1200)
    } catch (error) {
      console.error('Failed to copy PNG:', error)
    }
  }
</script>
<template>
  <li
    class="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white/60 dark:bg-neutral-800/60 group md:gradient-mask-bl-70"
  >
    <div class="relative min-h-40">
      <p
        class="absolute z-10 top-4 left-4 text-neutral-500 dark:text-neutral-400 text-ellipsis max-w-20 text-xs"
      >
        {{ name }}
      </p>
      <span class="hidden">{{ keywords }}</span>
      <a
        class="absolute inset-0 flex items-center justify-center"
        id="svg"
        ref="mySlot"
      >
        <slot></slot>
      </a>
      <div
        class="absolute bottom-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <button
          title="Copy code"
          @click="copyCode"
          class="rounded-none rounded-tl-md border-none bg-transparent h-10 w-10 text-xs"
        >
          <i
            v-if="!showCheckIcon"
            class="pi pi-code"
          ></i>
          <i
            v-if="showCheckIcon"
            class="pi pi-check text-green-500 dark:text-green-400"
          ></i>
        </button>
        <button
          :title="'Copy Image ' + downloadFormat.toUpperCase()"
          @click="copyImage"
          class="rounded-none border-none bg-transparent h-10 w-10 text-xs"
        >
          <i
            v-if="!showImageCheckIcon"
            class="pi pi-copy"
          ></i>
          <i
            v-if="showImageCheckIcon"
            class="pi pi-check text-green-500 dark:text-green-400"
          ></i>
        </button>
        <button
          :title="'Download ' + downloadFormat.toUpperCase()"
          @click="downloadIcon"
          class="rounded-none border-none bg-transparent h-10 w-10 text-xs"
        >
          <i class="pi pi-download"></i>
        </button>
      </div>
    </div>
  </li>
</template>
