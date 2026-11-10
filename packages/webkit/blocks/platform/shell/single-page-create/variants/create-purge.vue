<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Alert from '@aziontech/webkit/alert'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, watch } from 'vue'

  const breadcrumb = [{ label: 'Cache', href: '/cache' }, { label: 'Create Purge' }]
  const layers = [
    {
      value: 'cache',
      label: 'Cache',
      description: 'Evicts the objects from the cache layer, in every location.'
    },
    {
      value: 'tiered_cache',
      label: 'Tiered Cache',
      description:
        'Evicts the objects from the tiered cache layer that sits between the cache and your origin.'
    }
  ]
  const types = [
    {
      value: 'cachekey',
      label: 'Cache Key',
      noun: 'cache key',
      description: 'The exact keys objects were cached under, including any @@ variations.',
      placeholder: 'www.example.com/images/image.jpg@@cookie_name=value',
      helper: 'One cache key per line, without the protocol.'
    },
    {
      value: 'url',
      label: 'URL',
      noun: 'URL',
      description: 'Every cached variation of each address.',
      placeholder: 'www.example.com/index.html\nwww.example.com/styles/main.css',
      helper: 'One URL per line, without the protocol.'
    },
    {
      value: 'wildcard',
      label: 'Wildcard',
      noun: 'wildcard expression',
      description: 'Everything that matches a pattern, where an asterisk matches any path.',
      placeholder: 'www.example.com/images/*',
      helper: 'One expression per line. An asterisk matches any sequence of characters.'
    }
  ]
  const TIERED_CACHE_TYPES = ['cachekey']

  const form = reactive({ layer: 'cache', type: 'url', arguments: '' })
  const error = reactive({ kind: 'required', message: '' })

  const tiered = computed(() => form.layer === 'tiered_cache')
  const typeAllowed = (value) => !tiered.value || TIERED_CACHE_TYPES.includes(value)

  watch(tiered, () => {
    if (!typeAllowed(form.type)) form.type = TIERED_CACHE_TYPES[0]
  })

  watch(
    () => [form.type, form.arguments],
    () => {
      error.message = ''
    }
  )

  const selectedType = computed(() => types.find((type) => type.value === form.type) ?? types[1])
  const entries = computed(() =>
    form.arguments
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  const guidance = computed(() => error.message || selectedType.value.helper)

  const lineIssue = (line, index) => {
    const at = entries.value.length > 1 ? 'Line ' + (index + 1) : 'The argument'
    if (/^https?:\/\//i.test(line)) return at + ' starts with a protocol. Remove it.'
    if (form.type === 'wildcard' && !line.includes('*'))
      return at + ' has no asterisk. Choose URL to purge an exact address.'
    if (form.type === 'url' && line.includes('*'))
      return at + ' contains an asterisk. Choose Wildcard to purge a pattern.'
    return ''
  }

  const submit = () => {
    if (!entries.value.length) {
      error.kind = 'required'
      error.message = 'This field is required.'
      return
    }
    const issue = entries.value.map(lineIssue).find(Boolean)
    if (issue) {
      error.kind = 'invalid'
      error.message = issue
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Cache"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-purge-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="min-h-0 flex-1 overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
              <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <h1
                    id="create-purge-title"
                    data-size="small"
                    class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
                  >
                    Create Purge
                  </h1>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">
                  Evict cached objects from every location. Each one is fetched from your origin
                  again on its next request.
                </p>
              </div>
            </header>

            <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Create Purge</legend>

              <section
                class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)"> Target </span>
                    </h2>
                    <Hint
                      text="Where the objects are evicted from, and how this purge identifies them."
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small">
                          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                            <Item.Content>
                              <Item.Title>Layer</Item.Title>
                              <Item.Description
                                >The cache layer the objects are evicted from.</Item.Description
                              >
                            </Item.Content>
                            <Item.Actions class="w-full">
                              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                <fieldset
                                  class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                                >
                                  <legend class="sr-only">Layer</legend>
                                  <Field.Label
                                    v-for="option in layers"
                                    :key="option.value"
                                  >
                                    <Field orientation="horizontal">
                                      <RadioButton
                                        v-model="form.layer"
                                        :value="option.value"
                                        name="purge-layer"
                                        :input-id="'purge-layer-' + option.value"
                                      />
                                      <Field.Content>
                                        <Field.Title>
                                          {{ option.label }}
                                        </Field.Title>
                                        <Field.Description v-if="option.description">
                                          {{ option.description }}
                                        </Field.Description>
                                      </Field.Content>
                                    </Field>
                                  </Field.Label>
                                </fieldset>
                              </div>
                            </Item.Actions>
                          </div>
                        </Item>
                        <Item size="small">
                          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                            <Item.Content>
                              <Item.Title>Purge Type</Item.Title>
                              <Item.Description
                                >How the arguments below identify the objects.</Item.Description
                              >
                            </Item.Content>
                            <Item.Actions class="w-full">
                              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                <fieldset
                                  class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                                >
                                  <legend class="sr-only">Purge Type</legend>
                                  <Field.Label
                                    v-for="option in types"
                                    :key="option.value"
                                  >
                                    <Field
                                      orientation="horizontal"
                                      :disabled="!typeAllowed(option.value)"
                                    >
                                      <RadioButton
                                        v-model="form.type"
                                        :value="option.value"
                                        name="purge-type"
                                        :input-id="'purge-type-' + option.value"
                                      />
                                      <Field.Content>
                                        <Field.Title>
                                          {{ option.label }}
                                        </Field.Title>
                                        <Field.Description v-if="option.description">
                                          {{ option.description }}
                                        </Field.Description>
                                        <Field.Description
                                          v-if="
                                            !typeAllowed(option.value) && typeAllowed(option.value)
                                              ? ''
                                              : 'Tiered Cache purges by cache key only.'
                                          "
                                        >
                                          {{
                                            typeAllowed(option.value)
                                              ? ''
                                              : 'Tiered Cache purges by cache key only.'
                                          }}
                                        </Field.Description>
                                      </Field.Content>
                                    </Field>
                                  </Field.Label>
                                </fieldset>
                              </div>
                            </Item.Actions>
                          </div>
                        </Item>
                      </Item.List>
                    </template>
                  </Card>
                </div>
              </section>

              <section
                class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)"> Arguments </span>
                    </h2>
                    <Hint
                      :text="'The ' + selectedType.noun + 's to purge, one per line.'"
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small">
                          <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                            <Item.Content>
                              <Item.Title>{{ selectedType.label }} List</Item.Title>
                              <Item.Description>{{ selectedType.description }}</Item.Description>
                            </Item.Content>
                            <Item.Actions class="w-full">
                              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                <div class="contents font-(family-name:--font-code) text-body-sm">
                                  <Textarea
                                    v-model="form.arguments"
                                    class="w-full"
                                    :rows="6"
                                    :aria-label="selectedType.label + ' list'"
                                    :placeholder="selectedType.placeholder"
                                    :required="!!error.message && error.kind === 'required'"
                                    :invalid="!!error.message && error.kind === 'invalid'"
                                    aria-describedby="create-purge-arguments-message"
                                    spellcheck="false"
                                    autocomplete="off"
                                  />
                                </div>
                                <HelperText
                                  id="create-purge-arguments-message"
                                  :kind="error.message ? error.kind : 'helper'"
                                  :label="guidance"
                                />
                              </div>
                            </Item.Actions>
                          </div>
                        </Item>
                      </Item.List>
                    </template>
                  </Card>

                  <Alert
                    severity="warning"
                    size="small"
                    label="A purge cannot be undone. A broad one briefly raises the traffic that reaches your origin, while the cache fills again."
                  />
                </div>
              </section>
            </fieldset>
          </div>
        </div>

        <footer
          class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
        >
          <div
            class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
          >
            <div class="ml-auto flex shrink-0 items-center gap-(--spacing-sm)">
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
              />
              <Button
                label="Purge"
                kind="primary"
                size="medium"
                type="submit"
              />
            </div>
          </div>
        </footer>
      </form>
    </main>
  </div>
</template>
