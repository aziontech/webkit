<script setup>
  // PART 2, TEMPLATE FLOW — WHICH STARTER. One band: the catalog as a scrolling list of
  // rows.
  //
  // WHY ROWS HERE AND CARDS IN THE CREATION CENTER. A card grid is for BROWSING —
  // thumbnails, two axes of filtering, a screen to roam — which is exactly what /create
  // and the Marketplace are for, and they keep it. This part is not browsing, it is
  // ANSWERING: the reader already decided to start from a template, and a row carries
  // the two things that decide which one (the mark and the sentence) at a third of the
  // height. Same catalog either way — ../../../lib/data/frameworks.js is the one list,
  // so a template added there appears in every surface that offers one.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import SuccessMark from '../../../components/page/SuccessMark.vue'
  import { useScrollFade } from '../../../lib/behavior/scroll-fade'
  import { FRAMEWORKS, templateSlugForTech } from '../../../lib/data/frameworks'
  import { AZION_TEMPLATES, getTemplate, PARTNER_TEMPLATES } from '../../../lib/data/templates.js'

  const props = defineProps({
    // The source already chosen, so coming BACK to this part shows the answer.
    source: { type: Object, default: null },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:source'])

  const search = ref('')

  // The catalog scrolls inside the card, so its last row would otherwise end on the
  // card's own bottom edge and read as the end of the catalog. Fading it says the list
  // continues — and it re-measures itself as the search narrows the rows, down to no
  // mask at all once what is left fits.
  //
  // A 32px band, not the page-level 64: a row here is 65px tall, so the wide band would
  // dissolve a WHOLE row — telling the reader there is more by taking one away. Half a
  // row peeking is the cue. It also keeps this from compounding with the page scroller's
  // own band where the card's bottom edge sits near it.
  const { scroller, fadeStyle } = useScrollFade({ max: 32 })

  // ONE ROW SHAPE FOR TWO CATALOGS. A framework row and an Azion row are the same object
  // to this list — mark, title, sentence, and the template they resolve to — so the
  // markup below is written once and the groups differ only in what they hold. The
  // FRAMEWORK is kept on the row because "Featured" is read off the framework catalog's
  // own order, not typed onto entries that would then drift from it.
  // THE VENDOR IS ON THE ROW BECAUSE IT DECIDES THE MARK. An Azion template wears the
  // Azion logo, not a product glyph — see the media tile below.
  const catalogRow = (template) => ({
    key: template.slug,
    title: template.title,
    description: template.description,
    icon: template.icon,
    vendor: template.vendor,
    template
  })

  const azionRows = AZION_TEMPLATES.map(catalogRow)
  const partnerRows = PARTNER_TEMPLATES.map(catalogRow)

  // The framework group is the tech catalog, so a template already listed above is
  // dropped from it — the same template twice in one list is two answers to one question,
  // and the reader cannot tell which one they picked afterwards.
  const listedAbove = new Set([...azionRows, ...partnerRows].map((row) => row.template.slug))

  const frameworkRows = FRAMEWORKS.map((framework, index) => ({
    key: framework.tech,
    title: framework.title,
    label: framework.label,
    description: framework.description,
    icon: framework.icon,
    featured: index < 3,
    template: getTemplate(templateSlugForTech(framework.tech))
  })).filter((row) => !listedAbove.has(row.template.slug))

  const matches = (row, q) =>
    [row.title, row.label ?? '', row.description].some((field) => field.toLowerCase().includes(q))

  // THE GROUPS, in reading order: who publishes it, then what it is built with.
  //
  // AZION first — the applications Azion ships, which is what most readers open this part
  // for and which nobody arrives at by thinking "I use Nuxt". PARTNERS next: the same kind
  // of thing under somebody else's mark, so the reader can tell whose code they are about
  // to clone. FRAMEWORKS last, the plain "start me a Nuxt project" list.
  //
  // The Azion group is a PUBLISHER group, not a flow: nine of its rows are cloned into the
  // reader's GitHub exactly like a framework starter, and only the traffic-shaped ones
  // (proxy, CDN optimization) skip the repository part. `requiresRepository` decides that,
  // per template — see ../../../lib/data/templates.js.
  //
  // A group with nothing left after the search is dropped whole — an empty heading is a
  // heading for nothing.
  const groups = computed(() => {
    const q = search.value.trim().toLowerCase()
    return [
      { id: 'azion', label: 'Azion', rows: azionRows },
      { id: 'partners', label: 'Partners', rows: partnerRows },
      { id: 'frameworks', label: 'Frameworks', rows: frameworkRows }
    ]
      .map((group) => ({
        ...group,
        rows: q ? group.rows.filter((row) => matches(row, q)) : group.rows
      }))
      .filter((group) => group.rows.length)
  })

  const resultCount = computed(() =>
    groups.value.reduce((total, group) => total + group.rows.length, 0)
  )

  const chosenSlug = computed(() => (props.source?.kind === 'template' ? props.source.slug : ''))

  // A row resolves to its CATALOG TEMPLATE — which is what carries the per-template
  // settings the Configure part then asks for (a Shopify token, a database URL, a proxy's
  // origin). Emitting the resolved template, not the row, is what keeps the next part
  // from having to look anything up.
  const choose = (row) => {
    const { template } = row
    emit('update:source', {
      kind: 'template',
      slug: template.slug,
      title: template.title,
      description: template.description,
      framework: template.framework,
      icon: row.icon,
      // Carried so the Configure part draws the SAME mark this row drew
      // (../CreateApplication.vue) — an Azion template must not become a glyph one
      // part later.
      vendor: template.vendor,
      repoOwner: template.repoOwner,
      repoPath: template.repoPath,
      defaultName: template.defaultRepoName,
      // The template says whether there is anything to build, and whether it lands in a
      // repository of the reader's own. A framework starter is CLONED into their GitHub
      // account and arrives WITH code, so the flow gains a repository part and the
      // Configure part asks how to build it; an Azion template is CONFIGURED — no clone,
      // no bundle — so it skips both (../../../lib/data/templates.js explains the split,
      // ../CreateApplication.vue drops the part).
      requiresRepository: template.requiresRepository !== false,
      requiresBuild: template.requiresBuild !== false,
      settings: template.settings
    })
  }
</script>

<template>
  <CardBox
    :padded="false"
    title="Choose a template"
  >
    <template #content>
      <div class="border-b border-(--border-default) p-(--spacing-md)">
        <InputText
          v-model="search"
          size="large"
          class="w-full"
          placeholder="Search templates"
          aria-label="Search templates"
          :disabled="disabled"
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>
      </div>

      <!-- The catalog scrolls inside the card, so the action bar stays reachable however
           far the list grows. Two GROUPS in one scroll box and not two cards: it is one
           question with one search over it, and a second card would put a second box
           between the reader and the row they are hunting for. -->
      <div
        ref="scroller"
        :style="fadeStyle"
        class="max-h-[26rem] overflow-y-auto overscroll-contain"
      >
        <template v-if="resultCount">
          <section
            v-for="group in groups"
            :key="group.id"
          >
            <!-- The group heading STICKS: the list is 26rem of rows, and a reader
                 scrolled into the frameworks has otherwise lost which catalog they are
                 reading. Opaque background, or the rows would show through it. -->
            <h3
              class="sticky top-0 z-1 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) text-label-sm text-(--text-muted)"
            >
              {{ group.label }}
            </h3>

            <Item.List>
              <Item
                v-for="row in group.rows"
                :key="row.key"
                as-child
                size="small"
              >
                <button
                  type="button"
                  class="w-full text-left"
                  :disabled="disabled"
                  :aria-pressed="row.template.slug === chosenSlug"
                  @click="choose(row)"
                >
                  <Item.Media>
                    <span
                      class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <!-- ── AN AZION TEMPLATE IS MARKED BY ITS VENDOR ──
                           A framework row is told apart by its mark (a Nuxt row from a
                           Next row), which is why it wears one. An Azion row is not: it
                           is first-party, and the fact the reader is placing when they
                           look at it is WHO SHIPS IT — the same thing the Marketplace
                           answers with this exact mark
                           (../../../components/marketplace/IntegrationCard.vue), so the
                           two surfaces name the same publisher the same way. The product
                           glyph it replaces said `edge-connectors` / `edge-storage`,
                           which is the sentence beside it in a picture.
                           `h-4` in a 32px tile is the 16px the glyph occupies, so the
                           row's optical weight does not change with the mark. -->
                      <AzionLogoMin
                        v-if="row.vendor === 'Azion'"
                        class="h-4 w-auto shrink-0"
                        aria-hidden="true"
                      />
                      <i
                        v-else
                        :class="row.icon"
                        class="text-[1rem] leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ row.title }}</Item.Title>
                    <Item.Description>{{ row.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Tag
                      v-if="row.featured"
                      label="Featured"
                      severity="primary"
                      size="small"
                    />
                    <!-- The chosen row says so, so a reader who comes BACK to this part
                         sees the answer they already gave. -->
                    <SuccessMark
                      v-if="row.template.slug === chosenSlug"
                      key="chosen"
                    />
                    <i
                      v-else
                      class="pi pi-chevron-right text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </Item.Actions>
                </button>
              </Item>
            </Item.List>
          </section>
        </template>

        <p
          v-else
          class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
        >
          No templates match “{{ search }}”.
        </p>
      </div>
    </template>
  </CardBox>
</template>
