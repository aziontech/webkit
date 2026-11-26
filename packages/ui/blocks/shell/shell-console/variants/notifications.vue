<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import NotificationList from '../parts/notification-list.vue'
  import { sampleNotifications, type ShellConsoleNotification } from '../sample'
  import ShellConsole from '../shell-console.vue'

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const notifications = ref<ShellConsoleNotification[]>([...sampleNotifications])
  const notificationsOpen = ref(true)
  const flashOpen = ref(true)

  const unread = computed(() => notifications.value.filter((item) => !item.read).length)
  const bellLabel = computed(() =>
    unread.value ? `Notifications, ${unread.value} unread` : 'Notifications'
  )

  const markRead = (id: string) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
  }

  const settleFlash = () => {
    markRead('run-4182')
    flashOpen.value = false
  }
</script>

<template>
  <ShellConsole
    v-model:tools-open="notificationsOpen"
    tools-label="Notifications"
    @sign-out="(event) => emit('sign-out', event)"
  >
    <template #actions>
      <span class="relative inline-flex">
        <Tooltip
          content="Notifications"
          side="bottom"
        >
          <IconButton
            icon="az az-bell"
            variant="outline"
            size="medium"
            :aria-label="bellLabel"
            :aria-pressed="notificationsOpen"
            @click="notificationsOpen = !notificationsOpen"
          />
        </Tooltip>
        <span
          v-if="unread"
          aria-hidden="true"
          class="pointer-events-none absolute -end-(--spacing-2xs) -top-(--spacing-2xs)"
        >
          <Badge
            :label="String(unread)"
            severity="danger"
            size="small"
          />
        </span>
      </span>
    </template>

    <template #notifications>
      <Alert
        v-if="flashOpen"
        severity="danger"
        closable
        @close="flashOpen = false"
      >
        azion-site failed to deploy. The version that was live keeps serving traffic.
        <template #actions>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Button
              label="Edit"
              variant="outline"
              size="small"
              @click="settleFlash"
            />
            <Button
              label="Redeploy"
              variant="secondary"
              size="small"
              icon="az az-refresh"
              @click="settleFlash"
            />
          </div>
        </template>
      </Alert>
    </template>

    <template #tools>
      <NotificationList
        v-model:notifications="notifications"
        :unread="unread"
      />
    </template>
  </ShellConsole>
</template>
