<script setup lang="ts">
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Logo from '@aziontech/webkit/logo'
  import Skeleton from '@aziontech/webkit/skeleton'

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]

  export interface FirstUseProps {
    /** The account is still loading; skeletons draw the block's footprint. */
    loading?: boolean
    /** The empty state's title, naming the resource. */
    title?: string
    /** The sentence under the title. */
    description?: string
    /** Where Documentation goes; it opens in a new tab. */
    docsHref?: string
    /** The command the Via CLI row shows and copies. */
    command?: string
    /** Where Set up your coding agent goes. */
    agentSetupHref?: string
  }

  withDefaults(defineProps<FirstUseProps>(), {
    loading: false,
    title: 'Create your first resource',
    description: 'Start from scratch, from a template or by importing your code.',
    docsHref: 'https://example.com/docs/resources',
    command: 'azion deploy',
    agentSetupHref: '/agent-setup'
  })

  const emit = defineEmits<{
    import: [event: MouseEvent]
    create: [event: MouseEvent]
  }>()

  const methods = ['github', 'cli', 'scratch']
  const promos = ['catalog', 'agent']
</script>

<template>
  <div
    v-if="loading"
    class="flex flex-col items-start gap-(--spacing-lg)"
    role="status"
    aria-label="Loading resources"
    aria-busy="true"
  >
    <Card
      :padded="false"
      class="w-full"
    >
      <template #default>
        <div
          class="flex flex-col items-center gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-xl)"
        >
          <Skeleton
            width="2.5rem"
            height="2.5rem"
          />
          <Skeleton
            width="14rem"
            height="1.25rem"
          />
          <Skeleton
            width="20rem"
            height="0.875rem"
          />
        </div>

        <div class="border-t border-(--border-muted)">
          <Item.List>
            <Item
              v-for="method in methods"
              :key="method"
            >
              <Item.Media>
                <Skeleton
                  width="2rem"
                  height="2rem"
                />
              </Item.Media>
              <Item.Content>
                <Skeleton
                  width="8rem"
                  height="0.875rem"
                />
                <Skeleton
                  width="16rem"
                  height="0.75rem"
                />
              </Item.Content>
              <Item.Actions>
                <Skeleton
                  width="5rem"
                  height="2rem"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </div>
      </template>
    </Card>

    <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
      <Card
        v-for="promo in promos"
        :key="promo"
        class="w-full"
      >
        <template #default>
          <div class="flex flex-col gap-(--spacing-md)">
            <Skeleton
              width="7rem"
              height="2rem"
            />
            <div class="flex flex-col gap-(--spacing-2xs)">
              <Skeleton
                width="12rem"
                height="1rem"
              />
              <Skeleton height="0.875rem" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <div
    v-else
    class="flex flex-col items-start gap-(--spacing-lg)"
  >
    <Card
      :padded="false"
      class="w-full"
    >
      <template #default>
        <EmptyState
          icon="ai ai-box"
          :title="title"
          :description="description"
        >
          <template #actions>
            <Link
              label="Documentation"
              :href="docsHref"
              target="_blank"
            />
          </template>
        </EmptyState>

        <div class="border-t border-(--border-muted)">
          <Item.List>
            <Item>
              <Item.Media type="icon">
                <i
                  class="ai ai-github text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>From GitHub</Item.Title>
                <Item.Description
                  >Import a repository and deploy it on every push.</Item.Description
                >
              </Item.Content>
              <Item.Actions>
                <Button
                  label="Import"
                  variant="primary"
                  size="medium"
                  @click="(event: MouseEvent) => emit('import', event)"
                />
              </Item.Actions>
            </Item>
            <Item>
              <Item.Media type="icon">
                <i
                  class="ai ai-code text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>Via CLI</Item.Title>
                <Item.Description
                  >Run azion deploy and ship the branch you are on.</Item.Description
                >
              </Item.Content>
              <div
                class="flex basis-full md:basis-auto md:max-w-(--container-3xs) md:flex-1 justify-end"
              >
                <Item.Actions class="w-full">
                  <InputGroupRoot class="w-full">
                    <div class="flex min-w-0 flex-1">
                      <Input
                        :model-value="command"
                        size="large"
                        class="w-full"
                        aria-label="Via CLI command"
                        readonly
                        monospace
                        :spellcheck="false"
                      />
                    </div>
                    <CopyButton
                      :value="command"
                      aria-label="Copy the Via CLI command"
                      copied-label="Command copied"
                      size="small"
                    />
                  </InputGroupRoot>
                </Item.Actions>
              </div>
            </Item>
            <Item>
              <Item.Media type="icon">
                <i
                  class="ai ai-globe text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>From scratch</Item.Title>
                <Item.Description>Point a domain at a service you already run.</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button
                  label="Create"
                  variant="outline"
                  size="medium"
                  @click="(event: MouseEvent) => emit('create', event)"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </div>
      </template>
    </Card>

    <div class="grid w-full gap-(--spacing-lg) md:grid-cols-2">
      <Card
        :padded="false"
        class="w-full"
      >
        <template #default>
          <a
            href="https://www.azion.com/en/templates/"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start no-underline transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
          >
            <span
              class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
              aria-hidden="true"
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-nextjs text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-react text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-vue text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-color ai-svelte text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </span>

            <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span class="text-heading-2xs text-(--text-default)"
                >Start from a Catalog template</span
              >
              <span class="text-pretty text-body-sm text-(--text-muted)"
                >Deploy a framework starter and the resource that serves it, in one step.</span
              >
            </span>

            <i
              class="ai ai-external-link absolute end-(--spacing-md) top-(--spacing-md) text-body-sm leading-none text-(--text-muted) transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none group-hover:text-(--text-default)"
              aria-hidden="true"
            />
            <span class="sr-only">(opens in a new tab)</span>
          </a>
        </template>
      </Card>

      <Card
        :padded="false"
        class="w-full"
      >
        <template #default>
          <a
            :href="agentSetupHref"
            class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start no-underline transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
          >
            <span
              class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
              aria-hidden="true"
            >
              <span
                v-for="agent in agentMarks"
                :key="agent.name"
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <Logo
                  :name="agent.name"
                  :src="agent.src"
                  :variant="agent.mono ? 'current' : 'color'"
                  decorative
                  size="small"
                />
              </span>
            </span>

            <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span class="text-heading-2xs text-(--text-default)">Set up your coding agent</span>
              <span class="text-pretty text-body-sm text-(--text-muted)"
                >Give your editor a prompt that teaches it to build and deploy here.</span
              >
            </span>
          </a>
        </template>
      </Card>
    </div>
  </div>
</template>
