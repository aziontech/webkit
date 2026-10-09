<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { onBeforeUnmount, ref } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteFooterColumn, SiteSocial } from './types'

  defineOptions({ name: 'SiteFooter' })

  export type SiteFooterKind = 'content' | 'site'

  interface Props {
    /** Placement: `site` closes a framed marketing page, `content` runs full bleed in a zone. */
    kind?: SiteFooterKind
    /** Destination of the brand mark. */
    home?: string
    /** The link columns. */
    columns: SiteFooterColumn[]
    /** The social profiles, one icon button each. */
    socials?: SiteSocial[]
    /** The status line beside the language select. */
    status?: string
    /** The language options; each value is the label the reader sees. */
    languages?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'site',
    home: '/site',
    socials: () => [],
    status: '',
    languages: () => []
  })

  const { follow } = useSiteLink()

  const language = ref(props.languages[0] ?? '')

  const wideQuery = globalThis.matchMedia?.('(min-width: 1024px)')
  const brandLeadsSocialRow = ref(wideQuery?.matches ?? true)
  const onWideQueryChange = (event: globalThis.MediaQueryListEvent) => {
    brandLeadsSocialRow.value = event.matches
  }
  wideQuery?.addEventListener('change', onWideQueryChange)
  onBeforeUnmount(() => wideQuery?.removeEventListener('change', onWideQueryChange))

  const BRAND_LINK_CLASS =
    'inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
</script>

<template>
  <div class="w-full border-t border-(--border-default)">
    <Footer
      :kind="kind"
      aria-label="Footer"
    >
      <Footer.Column
        v-for="column in columns"
        :key="column.title"
        :title="column.title"
      >
        <Footer.Link
          v-for="link in column.links"
          :key="link.label"
          :href="link.href"
          @click="follow($event, link.href)"
        >
          {{ link.label }}
        </Footer.Link>
      </Footer.Column>

      <template #social>
        <a
          v-if="brandLeadsSocialRow"
          :href="home"
          aria-label="Azion home"
          :class="BRAND_LINK_CLASS"
          class="mr-(--spacing-xs)"
          @click="follow($event, home)"
        >
          <Brand size="small" />
        </a>

        <IconButton
          v-for="social in socials"
          :key="social.label"
          kind="transparent"
          :icon="social.icon"
          :aria-label="social.label"
          :href="social.href"
          target="_blank"
        />
      </template>

      <template
        v-if="status"
        #status
      >
        <StatusIndicator
          severity="success"
          :label="status"
        />
      </template>

      <template
        v-if="languages.length"
        #language
      >
        <div class="w-28">
          <Select
            v-model="language"
            placeholder="Language"
          >
            <Select.Trigger aria-label="Language">
              <template #iconLeft>
                <i
                  class="pi pi-globe text-(--text-muted)"
                  aria-hidden="true"
                />
              </template>
            </Select.Trigger>
            <Select.Content>
              <Select.Option
                v-for="option in languages"
                :key="option"
                :value="option"
              >
                {{ option }}
              </Select.Option>
            </Select.Content>
          </Select>
        </div>
      </template>

      <template
        v-if="!brandLeadsSocialRow"
        #brand
      >
        <a
          :href="home"
          aria-label="Azion home"
          :class="BRAND_LINK_CLASS"
          class="mx-auto"
          @click="follow($event, home)"
        >
          <Brand size="small" />
        </a>
      </template>
    </Footer>
  </div>
</template>
