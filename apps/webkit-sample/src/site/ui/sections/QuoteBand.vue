<script setup lang="ts">
  import { type Client, CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Quote from '@aziontech/webkit/quote'
  import SectionModule from '@aziontech/webkit/section-module'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'QuoteBand' })

  export type QuoteBandKind = 'highlight' | 'signed'

  interface Props {
    /** Register of the quotation: the featured highlight or the band-sized signed sentence. */
    kind?: QuoteBandKind
    /** The quotation. */
    text: string
    /** Who said it. */
    name?: string
    /** Their role and company. */
    jobTitle?: string
    /** Client registry name whose mark signs the quotation. */
    client?: string
    /** URL of the company mark, for a client the registry does not hold. */
    logo?: string
    /** Alternative text for the logo. */
    logoAlt?: string
    /** Actions under the attribution. */
    actions?: SiteAction[]
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'signed',
    name: '',
    jobTitle: '',
    client: '',
    logo: '',
    logoAlt: '',
    actions: () => [],
    anchor: ''
  })

  const mark = computed<Pick<Client, 'name'> | null>(() =>
    props.client
      ? (CLIENTS.find((entry) => entry.name === props.client) ?? { name: props.client })
      : null
  )
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div
        :data-kind="kind"
        class="p-(--spacing-xl) lg:data-[kind=signed]:max-w-(--container-5xl)"
      >
        <Quote
          :kind="kind"
          :text="text"
          :name="name"
          :job-title="jobTitle"
          :logo="logo"
          :logo-alt="logoAlt"
        >
          <template
            v-if="mark"
            #mark
          >
            <ClientMark
              :client="mark"
              mark="h-8 w-auto max-w-40 object-contain"
            />
          </template>
          <template
            v-if="actions.length"
            #actions
          >
            <SectionAction
              v-for="action in actions"
              :key="action.label"
              :action="action"
            />
          </template>
        </Quote>
      </div>
    </FrameBox>
  </SectionModule>
</template>
