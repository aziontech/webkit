<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast } from '@aziontech/webkit/toast'
  import { AGENT_SETUP_PROMPT, AGENT_TOOLS } from '@shared/lib/agent-onboarding'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { AGENT_PROMO } from '../../lib/data/product-empty-states'
  import { useTenancyReload } from '../../lib/state/tenancy-reload'
  import FirstUsePromo from './FirstUsePromo.vue'
  import IconFrame from './IconFrame.vue'

  interface Props {
    product: Record<string, unknown>
    enter?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    enter: false
  })

  const { tenancyReloading } = useTenancyReload()

  const settled = ref(false)
  watch(tenancyReloading, (now, before) => {
    if (before && !now) settled.value = true
  })

  const entranceClass = computed(() =>
    props.enter || settled.value ? 'animate-content-enter motion-reduce:animate-none' : ''
  )

  const route = useRoute()
  const router = useRouter()

  const go = (target) =>
    router.push({
      path: target.path,
      query: { ...target.query, email: route.query.email || undefined }
    })

  const start = (method) => {
    if (method.route) return go(method.route)
    toast.info(method.title, {
      description: `Creating a ${props.product.unit} is disabled in the demo.`
    })
  }

  const catalog = computed(() => props.product.startFast ?? null)

  const catalogLogos = computed(() =>
    (catalog.value?.items ?? []).slice(0, 4).map((item) => item.icon)
  )

  const openCatalog = () => go(catalog.value.route)

  const copyAgentPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_SETUP_PROMPT)
      toast.success('Setup prompt copied.', {
        description: 'Paste it into Claude, Cursor, Windsurf, Codex or OpenCode.'
      })
    } catch {
      toast.error("Couldn't copy the prompt.", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }
</script>

<template>
  <div
    v-if="tenancyReloading"
    class="flex flex-col gap-(--spacing-md)"
  >
    <Skeleton height="23rem" />
    <Skeleton height="7rem" />
  </div>

  <div
    v-else
    class="flex flex-col items-start gap-(--spacing-lg)"
    :class="entranceClass"
  >
    <CardBox
      :padded="false"
      class="w-full"
    >
      <template #content>
        <EmptyState
          :icon="product.icon"
          :title="product.headline"
          :description="product.lead"
        >
          <template #actions>
            <Link
              label="Documentation"
              :href="product.learnMore.href"
              target="_blank"
            />
          </template>
        </EmptyState>

        <Item.List class="border-t border-(--border-muted)">
          <Item
            v-for="method in product.methods"
            :key="method.id"
          >
            <Item.Media>
              <IconFrame :icon="method.icon" />
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ method.title }}</Item.Title>
              <Item.Description>{{ method.description }}</Item.Description>
            </Item.Content>
            <Item.Actions
              :class="
                method.command
                  ? 'basis-full justify-end md:basis-auto md:max-w-(--container-3xs) md:flex-1'
                  : undefined
              "
            >
              <template v-if="method.command">
                <InputGroupRoot class="w-full">
                  <InputText
                    :model-value="method.command"
                    size="large"
                    class="min-w-0 flex-1 [&_input]:text-label-code-sm"
                    :aria-label="`${method.title} command`"
                    readonly
                  />
                  <CopyButton
                    :value="method.command"
                    :aria-label="`Copy the ${method.title} command`"
                    copied-label="Command copied"
                  />
                </InputGroupRoot>
              </template>

              <Button
                v-else
                :label="method.action"
                :kind="method.primary ? 'primary' : 'outlined'"
                size="medium"
                @click="start(method)"
              />
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <div
      class="grid w-full gap-(--spacing-lg)"
      :class="catalog ? 'md:grid-cols-2' : ''"
    >
      <FirstUsePromo
        v-if="catalog"
        :title="catalog.title"
        :description="catalog.description"
        navigates
        @activate="openCatalog"
      >
        <template #logos>
          <IconFrame
            v-for="icon in catalogLogos"
            :key="icon"
            :icon="icon"
          />
        </template>
      </FirstUsePromo>

      <FirstUsePromo
        :title="AGENT_PROMO.title"
        :description="AGENT_PROMO.description"
        @activate="copyAgentPrompt"
      >
        <template #logos>
          <IconFrame
            v-for="agent in AGENT_TOOLS.slice(0, 4)"
            :key="agent"
          >
            <AgentMark
              :name="agent"
              class="size-(--size-4) text-(--text-default)"
            />
          </IconFrame>
        </template>
      </FirstUsePromo>
    </div>
  </div>
</template>
