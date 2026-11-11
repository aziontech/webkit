<script setup>
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'

  const agentMarks = [
    { name: 'claude', src: claudeMark, mono: false },
    { name: 'codex', src: codexMark, mono: true },
    { name: 'gemini', src: geminiMark, mono: false },
    { name: 'cursor', src: cursorMark, mono: true }
  ]
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-lg)">
    <Card
      :padded="false"
      class="w-full"
    >
      <template #content>
        <EmptyState
          icon="pi pi-box"
          title="Create your first resource"
          description="Start from scratch, from a template or by importing your code."
        >
          <template #actions>
            <Link
              label="Documentation"
              href="https://example.com/docs/resources"
              target="_blank"
            />
          </template>
        </EmptyState>

        <div class="border-t border-(--border-muted)">
          <Item.List>
            <Item>
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="ai ai-github text-body-lg leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
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
                  kind="primary"
                  size="medium"
                />
              </Item.Actions>
            </Item>
            <Item>
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="pi pi-code text-body-lg leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>Via CLI</Item.Title>
                <Item.Description
                  >Run platform deploy and ship the branch you are on.</Item.Description
                >
              </Item.Content>
              <div
                class="flex basis-full md:basis-auto md:max-w-(--container-3xs) md:flex-1 justify-end"
              >
                <Item.Actions class="w-full">
                  <InputGroupRoot class="w-full">
                    <div class="flex min-w-0 flex-1">
                      <Input
                        model-value="platform deploy"
                        size="large"
                        class="w-full"
                        aria-label="Via CLI command"
                        readonly
                      />
                    </div>
                    <CopyButton
                      value="platform deploy"
                      aria-label="Copy the Via CLI command"
                      copied-label="Command copied"
                    />
                  </InputGroupRoot>
                </Item.Actions>
              </div>
            </Item>
            <Item>
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="pi pi-globe text-body-lg leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>From scratch</Item.Title>
                <Item.Description>Point a domain at a service you already run.</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button
                  label="Create"
                  kind="outlined"
                  size="medium"
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
        <template #content>
          <button
            type="button"
            class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
          >
            <span
              class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
              aria-hidden="true"
            >
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-cor ai-next text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-cor ai-react text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-cor ai-vue text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai-cor ai-svelte text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </span>

            <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <span class="text-heading-xxs text-(--text-default)"
                >Start from a Catalog template</span
              >
              <span class="text-pretty text-body-sm text-(--text-muted)"
                >Deploy a framework starter and the resource that serves it, in one step.</span
              >
            </span>

            <i
              class="pi pi-external-link absolute end-(--spacing-md) top-(--spacing-md) text-body-sm leading-none text-(--text-muted) transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none group-hover:text-(--text-default)"
              aria-hidden="true"
            />
          </button>
        </template>
      </Card>

      <Card
        :padded="false"
        class="w-full"
      >
        <template #content>
          <button
            type="button"
            class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
          >
            <span
              class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
              aria-hidden="true"
            >
              <span
                v-for="agent in agentMarks"
                :key="agent.name"
                class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <span
                  v-if="agent.mono"
                  class="size-(--size-4) shrink-0 bg-current text-(--text-default) mask-(--agent-mark) mask-contain mask-center mask-no-repeat"
                  :style="{ '--agent-mark': 'url(' + agent.src + ')' }"
                />
                <img
                  v-else
                  :src="agent.src"
                  alt=""
                  class="size-(--size-4) shrink-0"
                />
              </span>
            </span>

            <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <span class="text-heading-xxs text-(--text-default)">Set up your coding agent</span>
              <span class="text-pretty text-body-sm text-(--text-muted)"
                >Give your editor a prompt that teaches it to build and deploy here.</span
              >
            </span>
          </button>
        </template>
      </Card>
    </div>
  </div>
</template>
