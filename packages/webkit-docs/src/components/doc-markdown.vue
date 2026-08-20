<script>
  import { h } from 'vue'

  import { useHeadingNav } from '../lib/heading-nav'
  import { renderInline as renderInlineText } from '../lib/inline'
  import { parseMdx } from '../lib/mdx'
  import DocAccordionGroup from './doc-accordion-group.vue'
  import DocAccordionItem from './doc-accordion-item.vue'
  import DocCallout from './doc-callout.vue'
  import DocCard from './doc-card.vue'
  import DocCardGroup from './doc-card-group.vue'
  import DocCodeGroup from './doc-code-group.vue'
  import DocFrame from './doc-frame.vue'
  import DocItem from './doc-item.vue'
  import DocItemGroup from './doc-item-group.vue'
  import DocStep from './doc-step.vue'
  import DocSteps from './doc-steps.vue'
  import DocTab from './doc-tab.vue'
  import DocTabs from './doc-tabs.vue'
  import DocTooltip from './doc-tooltip.vue'
  import DocUpdate from './doc-update.vue'

  /** MDX tag -> the component that renders it. */
  const COMPONENTS = {
    Note: [DocCallout, { kind: 'note' }],
    Info: [DocCallout, { kind: 'info' }],
    Tip: [DocCallout, { kind: 'tip' }],
    Check: [DocCallout, { kind: 'check' }],
    Highlight: [DocCallout, { kind: 'highlight' }],
    Warning: [DocCallout, { kind: 'warning' }],
    Danger: [DocCallout, { kind: 'danger' }],
    Steps: [DocSteps, {}],
    Step: [DocStep, {}],
    CardGroup: [DocCardGroup, {}],
    Columns: [DocCardGroup, {}],
    Card: [DocCard, {}],
    ItemGroup: [DocItemGroup, {}],
    Item: [DocItem, {}],
    AccordionGroup: [DocAccordionGroup, {}],
    Accordion: [DocAccordionItem, {}],
    Tabs: [DocTabs, {}],
    Tab: [DocTab, {}],
    // The map is what makes a tag renderable at all; the branch in `renderNode`
    // is what collapses this one's fences into a single tabbed block.
    CodeGroup: [DocCodeGroup, {}],
    Frame: [DocFrame, {}],
    Update: [DocUpdate, {}]
  }

  /*
   * Components whose body is a SENTENCE, not a document.
   *
   * A callout lays its copy out inside the Message's paragraph, and an item's
   * copy is the paragraph `ItemDescription` renders — so a child paragraph has
   * to become a span, or it nests a paragraph inside a paragraph, which the
   * browser closes early and drops the rest of the row with.
   */
  const INLINE_BODY_COMPONENTS = new Set([DocCallout, DocItem])

  /**
   * MDX tag -> the component that renders it INSIDE a sentence.
   *
   * Kept separate from `COMPONENTS` because these are reached from
   * `renderInline`, not from the block switch: they are part of a paragraph's
   * flow and never a block of their own.
   */
  const INLINE_COMPONENTS = {
    Tooltip: DocTooltip
  }

  /*
   * A markdown table IS a webkit Table — same surface, same rule, same cell
   * metrics — so a spec's table and a console's table are one component to the
   * reader. The webkit Table is a flex tree and this is real `<table>` markup,
   * so the tokens are carried over rather than the markup: the shell owns the
   * radius, the surface and the outer rule; the header row is `h-11` of
   * `text-label-sm` muted; a body row is `h-12` (a height on a table row acts
   * as a minimum, so a wrapping cell still grows) of `text-label-md` default;
   * and the row rule lives on the cells, dropped on the last row exactly as
   * TableBody drops it.
   *
   * `border-separate` + `border-spacing-0`, not `border-collapse`: a collapsed
   * table hoists cell borders onto the table box, where `overflow-hidden`
   * cannot clip them to the radius and the corners square off.
   */
  const TABLE_CLASS =
    'w-full border-separate border-spacing-0 overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-(--text-default)'
  const THEAD_ROW_CLASS = 'h-11'
  const TBODY_CLASS = '[&>tr:last-child>td]:border-b-0'
  const TH_CLASS =
    'border-b-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-start align-middle text-label-sm font-normal text-(--text-muted)'
  const TD_CLASS =
    'border-b-(length:--border-width-default) border-solid border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-start align-middle text-label-md text-(--text-default)'

  /*
   * A heading is an anchor: the whole text is the link to its own id, so a
   * reader can click the section they are reading and copy the URL to it.
   *
   * The affordance stays out of the way until it is wanted — the rule under the
   * text and the chain glyph after it appear on hover or keyboard focus, and
   * never occupy layout, so the heading's measure does not shift. `DocProse`
   * skips `[data-doc-anchor]` in its link rules, so the heading keeps its own
   * color and weight instead of turning into body-copy link blue.
   *
   * Plain inline flow (not `inline-flex`): a long heading has to wrap the way a
   * heading wraps, with the glyph trailing the last word.
   */
  const HEADING_CLASS = 'scroll-mt-(--spacing-lg)'
  const HEADING_ANCHOR_CLASS =
    'group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)'
  const HEADING_TEXT_CLASS =
    'underline-offset-4 decoration-(--border-strong) group-hover/anchor:underline'
  const HEADING_ICON_CLASS =
    'pi pi-link ml-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none'

  /**
   * Render inline markdown (code, links, bold, italic) and inline components.
   *
   * The rendering itself lives in `lib/inline` so a component PROP that holds
   * prose — a frame's caption — reaches the same elements a paragraph does.
   * This wrapper only supplies the inline components a page supports.
   *
   * @param {string} text - raw inline markdown.
   * @returns {unknown[]} the child vnodes.
   */
  function renderInline(text) {
    return renderInlineText(text, INLINE_COMPONENTS)
  }

  /**
   * Name one sample in a group.
   *
   * A fence inside a `<CodeGroup>` is labelled the way Mintlify labels it: an
   * explicit `title="…"`, else the bare word after the language (```bash npm),
   * else the language itself.
   *
   * @param {object} node - a parsed `code` node.
   * @returns {string} the tab label.
   */
  function sampleLabel(node) {
    if (node.meta.title) return String(node.meta.title)
    const bare = Object.keys(node.meta).find((key) => node.meta[key] === true)
    return bare || node.lang || 'Code'
  }

  /**
   * Render one parsed block node.
   *
   * @param {object} node - a node from `parseMdx`.
   * @param {number} key - the sibling index, used as the vnode key.
   * @param {boolean} inline - true inside a callout, where the surrounding
   *   element is a paragraph and block tags would be invalid.
   * @param {(event: MouseEvent, item: { id: string }) => void} nav - takes the
   *   reader to a heading; supplied by the page that owns the scroll container.
   * @returns {unknown} the vnode.
   */
  function renderNode(node, key, inline = false, nav = () => {}) {
    switch (node.type) {
      case 'heading': {
        const tag = `h${node.depth}`
        return h(tag, { key, id: node.id, 'data-doc-heading': node.depth, class: HEADING_CLASS }, [
          h(
            'a',
            {
              href: `#${node.id}`,
              'data-doc-anchor': '',
              class: HEADING_ANCHOR_CLASS,
              onClick: (event) => nav(event, { id: node.id })
            },
            [
              h('span', { class: HEADING_TEXT_CLASS }, renderInline(node.text)),
              h('i', { class: HEADING_ICON_CLASS, 'aria-hidden': 'true' })
            ]
          )
        ])
      }
      case 'paragraph':
        return inline
          ? // Inside a callout the copy is a run of sibling spans, and a callout has no
            // title above them — so the first one opens the box flush and only the
            // second sentence onward pays for the gap.
            h('span', { key, class: 'block pt-(--spacing-xs) first:pt-0' }, renderInline(node.text))
          : h('p', { key }, renderInline(node.text))
      case 'list': {
        const tag = node.ordered ? 'ol' : 'ul'
        return h(
          tag,
          { key },
          node.items.map((item, index) =>
            h('li', { key: index }, [
              ...renderInline(item.text),
              ...item.children.map((child, childIndex) => renderNode(child, childIndex, false, nav))
            ])
          )
        )
      }
      case 'code':
        return h(DocCodeGroup, {
          key,
          samples: [
            {
              label: node.meta.title || node.lang || 'Code',
              language: node.lang,
              fileName: node.meta.title,
              code: node.code
            }
          ],
          showLineNumbers: node.meta.lineNumbers === true
        })
      case 'table':
        return h('div', { key, 'data-doc-block': '', class: 'w-full overflow-x-auto' }, [
          h('table', { class: TABLE_CLASS }, [
            h('thead', [
              h(
                'tr',
                { class: THEAD_ROW_CLASS },
                node.head.map((cell, index) =>
                  h(
                    'th',
                    {
                      key: index,
                      scope: 'col',
                      class: TH_CLASS,
                      style: { textAlign: node.align[index] }
                    },
                    renderInline(cell)
                  )
                )
              )
            ]),
            h(
              'tbody',
              { class: TBODY_CLASS },
              node.rows.map((row, rowIndex) =>
                h(
                  'tr',
                  { key: rowIndex },
                  row.map((cell, index) =>
                    h(
                      'td',
                      { key: index, class: TD_CLASS, style: { textAlign: node.align[index] } },
                      renderInline(cell)
                    )
                  )
                )
              )
            )
          ])
        ])
      case 'blockquote':
        return h(
          'blockquote',
          { key },
          node.children.map((child, index) => renderNode(child, index, false, nav))
        )
      case 'divider':
        return h('hr', { key })
      case 'component': {
        const entry = COMPONENTS[node.name]
        if (!entry) return null
        const [component, presetProps] = entry
        // A CodeGroup owns its children's code: collapse them into one block.
        if (node.name === 'CodeGroup') {
          const samples = node.children
            .filter((child) => child.type === 'code')
            .map((child) => ({
              label: sampleLabel(child),
              language: child.lang,
              fileName: child.meta.title,
              code: child.code
            }))
          return h(DocCodeGroup, { key, samples })
        }
        const inlineBody = INLINE_BODY_COMPONENTS.has(component)
        const children = node.children.map((child, index) =>
          renderNode(child, index, inlineBody, nav)
        )
        return h(
          component,
          { key, ...presetProps, ...node.props },
          children.length ? { default: () => children } : undefined
        )
      }
      default:
        return null
    }
  }

  /**
   * Render a documentation page written in the MDX subset.
   *
   * Prose becomes plain semantic HTML — the surrounding `DocProse` gives it the
   * type scale and rhythm — and the component tags become the documentation
   * components, so one file carries both without the author switching modes.
   */
  export default {
    name: 'DocMarkdown',
    props: {
      /** The raw `.mdx` source. */
      source: { type: String, default: '' }
    },
    setup() {
      return { nav: useHeadingNav() }
    },
    computed: {
      parsed() {
        return parseMdx(this.source)
      }
    },
    render() {
      return h(
        'div',
        { 'data-testid': 'doc-markdown', class: 'w-full' },
        this.parsed.nodes.map((node, index) => renderNode(node, index, false, this.nav))
      )
    }
  }
</script>
