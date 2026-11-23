<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import { onRadioListKeydown, radioListTabIndex } from '@aziontech/webkit/utils/radio-list'
  import { computed, nextTick, ref } from 'vue'

  import CreateDeployTemplate from '../create-deploy-template.vue'

  interface ServiceOption {
    value: string
    label: string
    description: string
  }

  const services: ServiceOption[] = [
    { value: 'service-01', label: 'service-01', description: 'service-01.example.com' },
    { value: 'service-02', label: 'service-02', description: 'service-02.example.com' },
    { value: 'service-03', label: 'service-03', description: 'service-03.example.com' },
    { value: 'service-04', label: 'service-04', description: 'service-04.example.com' },
    { value: 'service-05', label: 'service-05', description: 'service-05.example.com' },
    { value: 'service-06', label: 'service-06', description: 'service-06.example.com' },
    { value: 'service-07', label: 'service-07', description: 'service-07.example.com' },
    { value: 'web-prod', label: 'web-prod', description: 'www.example.com' },
    { value: 'web-eu-prod', label: 'web-eu-prod', description: 'eu.example.com' },
    { value: 'stage-preview', label: 'stage-preview', description: '*-preview.example.com' },
    { value: 'campaign-landing', label: 'campaign-landing', description: 'campaign.example.com' },
    { value: 'docs-prod', label: 'docs-prod', description: 'docs.example.com' }
  ]
  const VISIBLE = 6

  const phase = ref<'where' | 'connect'>('where')
  const service = ref('')
  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameFieldEl = ref<InstanceType<typeof Input> | null>(null)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return services
    return services.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!service.value || head.some((option) => option.value === service.value)) return head
    const picked = matches.value.find((option) => option.value === service.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const choose = (value: string) => {
    service.value = value
    phase.value = 'connect'
  }

  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameFieldEl.value?.focus())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    creating.value = false
    choose(name)
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0].value)
      return
    }
    startCreating()
  }
</script>

<template>
  <CreateDeployTemplate :service="service">
    <template
      v-if="phase === 'where'"
      #default
    >
      <section
        data-phase="where"
        class="flex w-full flex-col gap-(--spacing-xl)"
        aria-labelledby="deploy-template-where-title"
      >
        <Card class="w-full">
          <template #default>
            <div class="flex flex-col gap-(--spacing-lg)">
              <div class="flex flex-col gap-(--spacing-2xs)">
                <h1
                  id="deploy-template-where-title"
                  class="text-heading-xs text-(--text-default)"
                >
                  Where it runs
                </h1>
                <p class="text-body-sm text-pretty text-(--text-muted)">
                  Select the service that serves the project. Each deploy goes live on it.
                </p>
              </div>

              <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                <Input
                  v-model="query"
                  size="large"
                  class="w-full"
                  placeholder="Search services"
                  aria-label="Search services"
                  autocomplete="off"
                  @keydown.enter.prevent="onSearchEnter"
                />

                <div
                  v-if="creating"
                  class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
                >
                  <Field>
                    <Field.Label>New service</Field.Label>
                    <Input
                      ref="nameFieldEl"
                      v-model="newName"
                      size="large"
                      placeholder="my-service"
                      @keydown.enter.prevent="confirmCreating"
                    />
                  </Field>
                  <div class="flex items-center justify-end gap-(--spacing-sm)">
                    <Button
                      type="button"
                      label="Back"
                      variant="ghost"
                      size="medium"
                      @click="cancelCreating"
                    />
                    <Button
                      type="button"
                      label="Continue"
                      variant="primary"
                      size="medium"
                      :disabled="!newName.trim()"
                      @click="confirmCreating"
                    />
                  </div>
                </div>

                <div
                  v-else
                  class="flex flex-col"
                  role="radiogroup"
                  @keydown="onRadioListKeydown"
                  aria-label="Services"
                >
                  <Item
                    v-for="option in visible"
                    :key="option.value"
                    size="small"
                    clickable
                    role="radio"
                    :aria-checked="service === option.value"
                    :tabindex="
                      radioListTabIndex(
                        option.value,
                        service,
                        visible.map((entry) => entry.value)
                      )
                    "
                    @click="choose(option.value)"
                  >
                    <Item.Media>
                      <i
                        class="az az-server text-body-md leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>{{ option.label }}</Item.Title>
                      <Item.Description>{{ option.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions>
                      <i
                        v-if="service === option.value"
                        class="az az-circle-on text-body-sm leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                      <i
                        v-else
                        class="az az-circle text-body-sm leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </Item.Actions>
                  </Item>

                  <p
                    v-if="hidden"
                    class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    {{ hidden }} more. Type to narrow the list.
                  </p>
                  <p
                    v-else-if="!matches.length"
                    class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    No service matches “{{ query.trim() }}”.
                  </p>

                  <Item
                    size="small"
                    clickable
                    @click="startCreating"
                  >
                    <Item.Media>
                      <i
                        class="az az-plus text-body-sm leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>Create Service</Item.Title>
                    </Item.Content>
                  </Item>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div class="flex justify-center">
          <Button
            type="button"
            label="Continue without a service"
            variant="ghost"
            size="small"
            @click="choose('')"
          />
        </div>
      </section>
    </template>
  </CreateDeployTemplate>
</template>
