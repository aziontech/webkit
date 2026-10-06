<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  interface Props {
    title?: string
    steps?: unknown[]
    stepDuration?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Creating application',
    steps: () => [
      'Validating configuration',
      'Creating application',
      'Applying delivery settings',
      'Configuring origin',
      'Setting cache expiration policies',
      'Finalizing'
    ],
    stepDuration: 650
  })

  const emit = defineEmits<{
    finished: []
  }>()

  const current = ref(0)
  const done = ref(false)
  const elapsed = ref(0)

  let tick = null
  const timers = []
  const after = (ms, fn) => timers.push(setTimeout(fn, ms))

  const stepState = (index) => {
    if (done.value || index < current.value) return 'done'
    if (index === current.value) return 'active'
    return 'pending'
  }

  const elapsedLabel = computed(() =>
    elapsed.value >= 60
      ? `${Math.floor(elapsed.value / 60)}m ${elapsed.value % 60}s`
      : `${elapsed.value}s`
  )

  const advance = () => {
    if (current.value < props.steps.length - 1) {
      current.value += 1
      after(props.stepDuration, advance)
      return
    }
    after(props.stepDuration, () => {
      done.value = true
      if (tick) clearInterval(tick)
      after(700, () => emit('finished'))
    })
  }

  onMounted(() => {
    tick = setInterval(() => (elapsed.value += 1), 1000)
    after(props.stepDuration, advance)
  })

  onBeforeUnmount(() => {
    timers.forEach(clearTimeout)
    if (tick) clearInterval(tick)
  })
</script>

<template>
  <CardBox
    :padded="false"
    class="w-full"
  >
    <template #header>
      <p class="text-heading-xs text-(--text-default)">{{ title }}</p>
      <div class="flex items-center gap-(--spacing-sm)">
        <Tag
          v-if="done"
          label="Completed"
          severity="success"
        />
        <span class="text-label-sm text-(--text-muted)">
          {{ done ? elapsedLabel : `Provisioning… ${elapsed}s` }}
        </span>
        <Spinner
          v-if="!done"
          class="size-4 text-(--text-muted)"
        />
      </div>
    </template>

    <template #content>
      <Item.List>
        <Item
          v-for="(step, index) in steps"
          :key="step"
        >
          <Item.Media>
            <span class="flex size-6 items-center justify-center">
              <Spinner
                v-if="stepState(index) === 'active'"
                class="size-4 text-(--primary)"
              />
              <i
                v-else-if="stepState(index) === 'done'"
                class="pi pi-check-circle text-body-md leading-none text-(--success)"
                aria-hidden="true"
              />
              <span
                v-else
                class="size-2 rounded-full bg-(--border-strong)"
                aria-hidden="true"
              />
            </span>
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ step }}</Item.Title>
          </Item.Content>
          <Item.Actions>
            <Tag
              v-if="stepState(index) === 'done'"
              label="Done"
              severity="success"
              size="small"
            />
          </Item.Actions>
        </Item>
      </Item.List>
    </template>
  </CardBox>
</template>
