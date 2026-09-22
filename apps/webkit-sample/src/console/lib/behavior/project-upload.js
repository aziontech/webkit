import { onBeforeUnmount, onMounted, ref } from 'vue'

// ── WHAT A DEPENDENCY NAMES: A BUILD PRESET ──
//
// The value on the right is a PRESET (../format/presets.js — the 25 the platform's
// builder accepts), not a loose label, so the drop resolves to the same vocabulary the
// application's Build tab and the preset picker speak. Anything else would hand the
// deploy form a stack name it cannot build with.
//
// ORDER IS THE WHOLE ALGORITHM, most specific first, because a real manifest matches
// several rows at once. An OpenNext project depends on `next`; a Nuxt project ships
// `vue` and (transitively, sometimes directly) `nitropack`; every Next project depends
// on `react`. First match wins, so the framework has to be listed above the library it
// is built on — otherwise a Next.js app deploys as React and loses its server routes.
//
// `typescript` is LAST on purpose: it is the answer only when nothing else spoke. It
// describes how the source is written, and every framework row above describes what the
// source is, which is the thing a build preset selects.
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

/** A name the deploy form can seed a project — and its repository — from. */
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

/**
 * The `tech` a project deploys as (see ../data/frameworks.js), or `''` when nothing says.
 *
 * Only the project ROOT is read. A `next.config.js` is a claim about the project when it
 * sits at the root and somebody else's business when it sits in `examples/blog/` — now
 * that the walk goes all the way down, a deep enough tree would otherwise let any fixture
 * name the whole project's stack.
 */
export const detectFramework = async ({ files = [], manifest = null }) => {
  if (manifest) {
    const dependencies = await readDependencies(manifest)
    const marker = MANIFEST_MARKERS.find(([dependency]) => dependencies.has(dependency))
    if (marker) return marker[1]
  }
  const lowered = topLevel(files).map((file) => file.name.toLowerCase())
  const marker = FILE_MARKERS.find(([file]) => lowered.some((name) => name.startsWith(file)))
  if (marker) return marker[1]

  // A manifest nothing above recognized still says one thing for certain: this project is
  // built, by npm, from JavaScript. `javascript` is the preset for exactly that. It is
  // tried AFTER the file markers rather than instead of them so a Vite vanilla app —
  // `package.json` beside an `index.html` — keeps resolving to `html`, which is the
  // preset that serves a folder; `javascript` bundles a handler module and would be the
  // wrong build for a page.
  //
  // The gain is not the guess, it is the FLOOR: a Node project used to resolve to `''`,
  // which made `picksRootFile` ask the reader which file answers `GET /` — a question
  // about a static folder, asked about a project that builds one. And the answer is not
  // final either way: the deploy form's preset picker opens on this and the reader
  // overrides it in one click.
  return manifest ? 'javascript' : ''
}

// ── WHAT A DROP LEAVES FOR THE READER TO ANSWER ──
//
// One question — what answers `GET /` — asked only when nothing else can answer it.
//
// Detecting a framework IS that answer, in both of the ways detection happens above. A
// build preset (`next`, `astro`, the other twenty-three) serves what the build writes, so
// no dropped file is the root. The `html` preset is subtler and lands in the same place:
// it is detected by FILE_MARKERS precisely BECAUSE the drop carries an `index.html`, so
// the file that would answer the question is the same file that made the question go
// away. Either way a framework means the root is already decided.
//
// What is left — no manifest we recognize, no `index.html` — is a drop nothing can speak
// for: a lone screenshot, a PDF, three pages none of which is an index. There the reader
// is the only one who knows, so they are asked, and only there.
//
// Both halves of the deploy screen need this — the form to know whether it can submit,
// the listing to know whether to draw the picker — so it is one predicate, here, rather
// than the same condition written twice on either side of a prop.

/** Whether this project needs the reader to name the file served at `/`. */
export const picksRootFile = ({ files = [], framework = '' }) =>
  topLevel(files).length > 0 && !framework

const ROOT_NAMES = ['index.html', 'index.htm']

/**
 * The file a static drop starts with as its root: `index.html` when it carries one, any
 * other HTML page when it does not, and otherwise the first file — which is the whole
 * answer for a drop of one.
 *
 * @param {{ name: string }[]} files
 * @returns {string}
 */
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

// HOW MANY FILES WE AGREE TO READ.
//
// The read is the whole project, recursively — the initializing screen says "setting up
// your deployment" over the files it is about to ship, and a listing of four top-level
// entries under that sentence would be a different project than the one being deployed.
//
// But a "vibe coded" folder is exactly the one most likely to have `node_modules` in it,
// and thirty thousand rows is a hung demo, not a listing. So the walk stops at a number
// a person could plausibly scroll, and says so (`truncated`) rather than quietly
// presenting a slice as the whole. Skipping `node_modules` by name would read better and
// would be a lie of a different kind — we would be deciding what the reader meant to
// deploy.
const MAX_FILES = 500

/**
 * One row of the manifest: where the file sits inside the project, and what it weighs.
 *
 * `path` is relative to the project ROOT, with the dropped folder's own name stripped —
 * `assets/hero.png`, not `my-project/assets/hero.png`. The folder's name is the project's
 * name and is already on screen twice; repeating it at the head of every row would cost
 * the width the interesting half of the path needs.
 */
const asEntry = (path, size) => ({ path, name: path.slice(path.lastIndexOf('/') + 1), size })

/** Shallowest first, then alphabetical — a tree read as a list. */
const sorted = (entries) =>
  [...entries].sort((a, b) => {
    const depth = a.path.split('/').length - b.path.split('/').length
    return depth || a.path.localeCompare(b.path)
  })

/** Files at the project root — the only root-file candidates, and what detection reads. */
export const topLevel = (files = []) => files.filter((file) => !file.path.includes('/'))

/** Depth-first walk of a dropped directory, collecting every file under it. */
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
    // The dropped folder's own name is the project's, so the walk starts INSIDE it: its
    // children are the project root, at prefix ''.
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

/** The ROOT `package.json`, resolved to a File so its dependencies can be read. */
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

  // A directory pick hands over every file already, each carrying its full path from the
  // picked folder down. Strip that folder's name for the same reason the walk starts
  // inside it.
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

/**
 * Drag a project onto the page, or choose one through the native file / folder pickers.
 * All three read the same facts out of it — its name, the framework it is built with, and
 * every file it is made of, by path — and hand them to `onProject`.
 *
 * The file list is shown back twice: once on the drop itself
 * (../../components/creation/ProjectInitializing.vue), so the reader can see they handed
 * over the folder they meant, and again on the deploy screen
 * (../../pages/marketplace/DeployTemplate.vue), which also picks the site's root out of
 * it. It cannot ride the URL like the name and the framework do, which is why
 * ../state/dropped-project.js exists.
 *
 * @param {(project: {
 *   name: string,
 *   framework: string,
 *   files: { path: string, name: string, size: number }[],
 *   truncated: boolean
 * }) => void} onProject what to do with the project once it is read.
 * @returns {{ dragging: import('vue').Ref<boolean>, pickFile: () => void, pickFolder: () => void }}
 */
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
