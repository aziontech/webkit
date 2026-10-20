import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { rememberDroppedProject } from '../state/dropped-project'

const MANIFEST_MARKERS = [
  ['@opennextjs/azion', 'opennextjs'],
  ['@opennextjs/aws', 'opennextjs'],
  ['open-next', 'opennextjs'],
  ['next', 'next'],
  ['nuxt', 'nuxt'],
  ['nitropack', 'nitro'],
  ['astro', 'astro'],
  ['@angular/core', 'angular'],
  ['gatsby', 'gatsby'],
  ['@docusaurus/core', 'docusaurus'],
  ['vitepress', 'vitepress'],
  ['vuepress', 'vuepress'],
  ['@builder.io/qwik', 'qwik'],
  ['@stencil/core', 'stencil'],
  ['@11ty/eleventy', 'eleventy'],
  ['hexo', 'hexo'],
  ['svelte', 'svelte'],
  ['preact', 'preact'],
  ['vue', 'vue'],
  ['react', 'react'],
  ['typescript', 'typescript']
]

const FILE_MARKERS = [
  ['next.config', 'next'],
  ['nuxt.config', 'nuxt'],
  ['astro.config', 'astro'],
  ['svelte.config', 'svelte'],
  ['angular.json', 'angular'],
  ['gatsby-config', 'gatsby'],
  ['docusaurus.config', 'docusaurus'],
  ['stencil.config', 'stencil'],
  ['hugo.toml', 'hugo'],
  ['_config.yml', 'jekyll'],
  ['cargo.toml', 'rustwasm'],
  ['index.html', 'html']
]

const MANIFEST = 'package.json'

export const projectName = (raw = '') =>
  raw
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 64) || 'my-project'

const readDependencies = async (manifest) => {
  try {
    const parsed = JSON.parse(await manifest.text())
    return new Set([
      ...Object.keys(parsed.dependencies ?? {}),
      ...Object.keys(parsed.devDependencies ?? {})
    ])
  } catch {
    return new Set()
  }
}

export const detectFramework = async ({ files = [], manifest = null }) => {
  if (manifest) {
    const dependencies = await readDependencies(manifest)
    const marker = MANIFEST_MARKERS.find(([dependency]) => dependencies.has(dependency))
    if (marker) return marker[1]
  }
  const lowered = topLevel(files).map((file) => file.name.toLowerCase())
  const marker = FILE_MARKERS.find(([file]) => lowered.some((name) => name.startsWith(file)))
  if (marker) return marker[1]

  return manifest ? 'javascript' : ''
}

export const picksRootFile = ({ files = [], framework = '' }) =>
  topLevel(files).length > 0 && !framework

const ROOT_NAMES = ['index.html', 'index.htm']

export const defaultRootFile = (files = []) => {
  const candidates = topLevel(files)
  return (
    candidates.find((file) => ROOT_NAMES.includes(file.name.toLowerCase()))?.name ??
    candidates.find((file) => /\.html?$/i.test(file.name))?.name ??
    candidates[0]?.name ??
    ''
  )
}

const readDirectory = (directory) =>
  new Promise((resolve) => {
    const reader = directory.createReader()
    const entries = []
    const readBatch = () =>
      reader.readEntries(
        (batch) => {
          if (!batch.length) {
            resolve(entries)
            return
          }
          entries.push(...batch)
          readBatch()
        },
        () => resolve(entries)
      )
    readBatch()
  })

const entryAsFile = (entry) => new Promise((resolve) => entry.file(resolve, () => resolve(null)))

const MAX_FILES = 500

const asEntry = (path, size) => ({ path, name: path.slice(path.lastIndexOf('/') + 1), size })

const sorted = (entries) =>
  [...entries].sort((a, b) => {
    const depth = a.path.split('/').length - b.path.split('/').length
    return depth || a.path.localeCompare(b.path)
  })

export const topLevel = (files = []) => files.filter((file) => !file.path.includes('/'))

const walk = async (entry, prefix, out) => {
  if (out.length >= MAX_FILES) return
  if (entry.isFile) {
    const file = await entryAsFile(entry)
    if (file) out.push(asEntry(`${prefix}${entry.name}`, file.size ?? 0))
    return
  }
  if (!entry.isDirectory) return
  for (const child of await readDirectory(entry)) {
    await walk(child, `${prefix}${entry.name}/`, out)
  }
}

const readDroppedProject = async (dataTransfer) => {
  const entries = Array.from(dataTransfer?.items ?? [])
    .map((item) => item.webkitGetAsEntry?.())
    .filter(Boolean)

  const directory = entries.find((entry) => entry.isDirectory)
  if (directory) {
    const collected = []
    for (const child of await readDirectory(directory)) await walk(child, '', collected)
    const manifest = collected.some((file) => file.path === MANIFEST)
      ? await rootManifestEntry(directory)
      : null
    return {
      name: directory.name,
      files: sorted(collected),
      truncated: collected.length >= MAX_FILES,
      manifest
    }
  }

  const files = Array.from(dataTransfer?.files ?? [])
  if (!files.length) return null
  return {
    name: files.length > 1 ? '' : files[0].name,
    files: sorted(files.slice(0, MAX_FILES).map((file) => asEntry(file.name, file.size ?? 0))),
    truncated: files.length > MAX_FILES,
    manifest: files.find((file) => file.name === MANIFEST) ?? null
  }
}

const rootManifestEntry = async (directory) => {
  const entry = (await readDirectory(directory)).find(
    (child) => child.isFile && child.name === MANIFEST
  )
  return entry ? entryAsFile(entry) : null
}

const readPickedProject = (fileList) => {
  const files = Array.from(fileList ?? [])
  if (!files.length) return null

  const rooted = files.find((file) => file.webkitRelativePath)
  if (!rooted) {
    return {
      name: files.length > 1 ? '' : files[0].name,
      files: sorted(files.slice(0, MAX_FILES).map((file) => asEntry(file.name, file.size ?? 0))),
      truncated: files.length > MAX_FILES,
      manifest: files.find((file) => file.name === MANIFEST) ?? null
    }
  }

  const root = rooted.webkitRelativePath.split('/')[0]
  const below = (file) => file.webkitRelativePath.slice(root.length + 1)
  return {
    name: root,
    files: sorted(files.slice(0, MAX_FILES).map((file) => asEntry(below(file), file.size ?? 0))),
    truncated: files.length > MAX_FILES,
    manifest: files.find((file) => file.webkitRelativePath === `${root}/${MANIFEST}`) ?? null
  }
}

const announce = async (project, onProject) => {
  if (!project) return
  onProject({
    name: projectName(project.name),
    framework: await detectFramework(project),
    files: project.files,
    truncated: project.truncated
  })
}

const openPicker = (directory, onProject) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.hidden = true
  if (directory) {
    input.webkitdirectory = true
    input.setAttribute('directory', '')
  }

  input.addEventListener(
    'change',
    () => {
      const project = readPickedProject(input.files)
      input.remove()
      announce(project, onProject)
    },
    { once: true }
  )
  input.addEventListener('cancel', () => input.remove(), { once: true })

  document.body.append(input)
  input.click()
}

export function useProjectUpload(onProject) {
  const dragging = ref(false)
  let depth = 0

  const carriesFiles = (event) => Array.from(event.dataTransfer?.types ?? []).includes('Files')

  const reset = () => {
    depth = 0
    dragging.value = false
  }

  const onDragEnter = (event) => {
    if (!carriesFiles(event)) return
    depth += 1
    dragging.value = true
  }

  const onDragOver = (event) => {
    if (!carriesFiles(event)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  }

  const onDragLeave = (event) => {
    if (!carriesFiles(event)) return
    depth = Math.max(0, depth - 1)
    if (!depth) dragging.value = false
  }

  const onDrop = async (event) => {
    if (!carriesFiles(event)) return
    event.preventDefault()
    reset()
    announce(await readDroppedProject(event.dataTransfer), onProject)
  }

  const LISTENERS = [
    ['dragenter', onDragEnter],
    ['dragover', onDragOver],
    ['dragleave', onDragLeave],
    ['drop', onDrop],
    ['dragend', reset]
  ]

  onMounted(() => {
    for (const [type, handler] of LISTENERS) window.addEventListener(type, handler)
  })

  onBeforeUnmount(() => {
    for (const [type, handler] of LISTENERS) window.removeEventListener(type, handler)
  })

  return {
    dragging,
    pickFile: () => openPicker(false, onProject),
    pickFolder: () => openPicker(true, onProject)
  }
}

const HANDOFF_MS = 1600

export function useProjectDrop() {
  const route = useRoute()
  const router = useRouter()

  const initializing = ref(null)
  let handoff = null

  const deployProject = ({ name, framework, files, truncated }) => {
    initializing.value = { files, truncated }
    handoff = setTimeout(() => {
      rememberDroppedProject({ name, files, truncated })
      router.push({
        path: '/deploy',
        query: { email: route.query.email || 'myemail@azion.com', upload: name, framework }
      })
    }, HANDOFF_MS)
  }

  onBeforeUnmount(() => clearTimeout(handoff))

  const { dragging, pickFile, pickFolder } = useProjectUpload(deployProject)

  return { dragging, initializing, pickFile, pickFolder }
}
