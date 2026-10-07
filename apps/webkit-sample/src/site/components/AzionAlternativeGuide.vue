<script setup lang="ts">
  import { competitor } from '@aziontech/webkit/assets/competitor-registry'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import Topic from '@aziontech/webkit/topic'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  import { type AlternativeGuide, TRUST_MARKS } from '../data/alternative-guides'
  import SolutionArtHero from './SolutionArtHero.vue'

  interface Props {
    /** The guide's copy, comparison matrix and client marks. */
    guide: AlternativeGuide
  }

  const props = defineProps<Props>()

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const CONTACT = '/site/contact'
  const GUIDE = '/site/docs'
  const CLIENT_STORIES = '/site/success-cases'

  const SUPPORT = {
    full: 'Suporte completo',
    partial: 'Suporte parcial',
    none: 'Não disponível'
  }

  const rival = computed(() => competitor(props.guide.rival))

  const hero = computed(() => ({
    ...props.guide.hero,
    art: {
      name: props.guide.hero.art,
      alt: `A marca da Azion e a marca da ${props.guide.rival}, uma sobre a outra`
    },
    carouselLabel: 'Empresas confiam',
    carouselMarks: TRUST_MARKS
  }))
</script>

<template>
  <div
    lang="pt-BR"
    class="contents"
  >
    <SolutionArtHero :hero="hero">
      <template #actions>
        <Button
          label="Comece Grátis"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Fale com um especialista"
          kind="outlined"
          size="large"
          href="#contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </SolutionArtHero>

    <SectionContainer max-width="site">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <template #header>
          <SectionTitle
            :eyebrow="guide.why.eyebrow"
            :title="guide.why.title"
          />
        </template>

        <FrameBox
          flush
          borders="y"
          marks="bottom"
        >
          <CardGrid
            flush
            kind="frame"
            :columns="3"
          >
            <CardGridCell
              v-for="reason in guide.reasons"
              :key="reason.title"
              kind="canvas"
            >
              <Topic
                :heading-level="3"
                :icon="reason.icon"
                :title="reason.title"
                :description="reason.description"
              />
            </CardGridCell>
          </CardGrid>
        </FrameBox>
      </SectionModule>

      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          flush
          borders="y"
          marks="all"
        >
          <QuoteTabs
            aria-label="Histórias de clientes"
            :items="guide.quotes"
          >
            <template #actions>
              <Button
                label="Ver casos de sucesso"
                kind="secondary"
                size="large"
                :href="CLIENT_STORIES"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </template>
          </QuoteTabs>
        </FrameBox>
      </SectionModule>

      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <template #header>
          <SectionTitle
            kind="left"
            :eyebrow="guide.comparison.eyebrow"
            :title="guide.comparison.title"
          />
        </template>

        <table
          class="w-full table-auto border-separate border-spacing-0 border-b border-(--border-default) text-left lg:table-fixed"
        >
          <caption class="sr-only">
            Comparação de capacidades entre a Azion e a
            {{
              guide.rival
            }}.
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                class="sticky top-14 z-20 border-b border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) align-top font-normal"
              >
                <span class="text-overline-md text-(--text-muted)">Capacidade</span>
              </th>
              <th
                scope="col"
                aria-label="Azion"
                class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) text-center align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
              >
                <Brand
                  kind="default"
                  size="small"
                  class="[&>svg]:h-3! sm:[&>svg]:h-4!"
                />
                <span class="sr-only">Azion</span>
              </th>
              <th
                scope="col"
                :aria-label="guide.rival"
                class="sticky top-14 z-20 w-20 border-b border-l border-(--border-default) bg-(--bg-canvas) px-(--spacing-xs) py-(--spacing-lg) align-top font-normal sm:w-32 sm:px-(--spacing-lg) md:w-40 lg:w-48"
              >
                <ClientMark
                  :client="rival"
                  mark="mx-auto h-auto w-15 max-w-full object-contain sm:w-20"
                />
                <span class="sr-only">{{ guide.rival }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in guide.capabilities"
              :key="row.capability"
              :data-first="index === 0 || null"
              class="group/row"
            >
              <th
                scope="row"
                class="border-t border-(--border-default) px-(--spacing-lg) py-(--spacing-md) text-left align-middle text-label-md font-normal text-(--text-default) group-data-[first]/row:border-t-0"
              >
                {{ row.capability }}
              </th>
              <td
                v-for="platform in ['azion', 'rival']"
                :key="platform"
                class="border-l border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-md) text-center align-middle text-label-md text-(--text-default) group-data-[first]/row:border-t-0"
              >
                <template v-if="row[platform] === 'full'">
                  <i
                    class="pi pi-check text-body-sm text-(--success-contrast)"
                    aria-hidden="true"
                  />
                  <span class="sr-only">{{ SUPPORT.full }}</span>
                </template>
                <template v-else-if="row[platform] === 'none'">
                  <span
                    class="text-(--text-muted)"
                    aria-hidden="true"
                    >—</span
                  >
                  <span class="sr-only">{{ SUPPORT.none }}</span>
                </template>
                <span v-else>{{ SUPPORT.partial }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </SectionModule>

      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <MediaSplit
          framed
          :media-href="GUIDE"
          align="center"
          size="large"
          media-fill="canvas"
          texture="pixelate"
          texture-size="small"
          texture-fade="top"
          :title="guide.mapping.title"
          :description="guide.mapping.description"
        >
          <template #media>
            <Illustration name="build-applications" />
          </template>
          <template #actions>
            <Button
              label="Ver o guia"
              kind="outlined"
              size="medium"
              :href="GUIDE"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </SectionModule>

      <SectionGap hatch />

      <SectionModule
        id="faq"
        :divided="false"
        :padded="false"
      >
        <Faq
          framed
          title="Perguntas Frequentes"
          :items="guide.faq"
        />
      </SectionModule>

      <SectionGap hatch />

      <SectionModule
        id="contact"
        :divided="false"
        :padded="false"
        class="scroll-mt-(--spacing-xxl)"
      >
        <CallToAction
          framed
          kind="split"
          eyebrow="Secure"
          title="Proteção nativa."
          title-muted="Sempre ativa."
          description="Ganhe proteção mais forte, menos exposição a ataques e menos sobrecarga operacional."
        >
          <template #actions>
            <Button
              label="Comece Grátis"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
          </template>
          <template #aside>
            <Button
              label="Fale com nosso time"
              kind="outlined"
              size="large"
              :href="CONTACT"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </CallToAction>
      </SectionModule>

      <FrameBox
        borders="none"
        marks="all"
        data-hatch="true"
        class="h-[calc(var(--spacing-xxl)*2)]"
      >
        <TextureMaterial kind="lines" />
      </FrameBox>
    </SectionContainer>
  </div>
</template>
