<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Item from '@aziontech/ui/item'
  import Link from '@aziontech/ui/link'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import Switch from '@aziontech/ui/switch'
  import { computed } from 'vue'

  import {
    ALERT_CHANNEL_OPTIONS,
    CADENCE_OPTIONS,
    DEPLOY_ALERT_OPTIONS,
    DIGEST_CHANNEL_OPTIONS,
    DIGESTS,
    pickOption,
    type UserProfileNotificationSettings
  } from '../user-profile-model'
  import ProfileSelect from './profile-select.vue'

  export interface ProfileNotificationsTabProps {
    /** Verified addresses the user can route notifications to. */
    emails: string[]
  }

  const props = defineProps<ProfileNotificationsTabProps>()

  const form = defineModel<UserProfileNotificationSettings>('form', { required: true })

  const emit = defineEmits<{
    'view-watched': [event: MouseEvent]
  }>()

  const emailOptions = computed(() => props.emails.map((email) => ({ label: email, value: email })))
</script>

<template>
  <div class="flex flex-col">
    <SettingsGroup
      label="Delivery"
      hint="Where Azion sends your notification emails."
      anchor="delivery"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            title="Notification email"
            description="Every email below goes here unless your organization routes it elsewhere."
          >
            <ProfileSelect
              v-model="form.defaultEmail"
              :options="emailOptions"
              aria-label="Notification email"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Scheduled digests"
      hint="Summaries of what happened in your accounts, one per area of the platform."
      anchor="digests"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow
            v-for="digest in DIGESTS"
            :key="digest.key"
            :title="digest.title"
            :description="digest.description"
          >
            <div class="grid w-full grid-cols-2 gap-(--spacing-xs)">
              <ProfileSelect
                :model-value="form[digest.cadence]"
                @update:model-value="
                  form[digest.cadence] = pickOption(CADENCE_OPTIONS, $event, 'off')
                "
                :options="CADENCE_OPTIONS"
                :aria-label="`${digest.title} frequency`"
              />
              <ProfileSelect
                :model-value="form[digest.channel]"
                @update:model-value="
                  form[digest.channel] = pickOption(DIGEST_CHANNEL_OPTIONS, $event, 'email')
                "
                :options="DIGEST_CHANNEL_OPTIONS"
                :aria-label="`${digest.title} channel`"
              />
            </div>
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>

    <SettingsGroup
      label="Watched resources and alerts"
      hint="What reaches you right away, and where."
      anchor="alerts"
    >
      <Card :padded="false">
        <Item.List>
          <SettingsRow title="Watched resources">
            <template #description>
              Applications, Functions and firewalls you watch.
              <Link
                href="#watched-resources"
                inline
                @click.prevent="emit('view-watched', $event)"
                >See the {{ form.watchedResourcesCount }} you watch</Link
              >
            </template>
            <ProfileSelect
              :model-value="form.watchedResourcesChannel"
              @update:model-value="
                form.watchedResourcesChannel = pickOption(ALERT_CHANNEL_OPTIONS, $event, 'off')
              "
              :options="ALERT_CHANNEL_OPTIONS"
              aria-label="Watched resources channel"
            />
          </SettingsRow>
          <SettingsRow
            title="Mentions"
            description="When someone mentions you in an incident note, a review or a deploy approval."
          >
            <ProfileSelect
              :model-value="form.mentionsChannel"
              @update:model-value="
                form.mentionsChannel = pickOption(ALERT_CHANNEL_OPTIONS, $event, 'off')
              "
              :options="ALERT_CHANNEL_OPTIONS"
              aria-label="Mentions channel"
            />
          </SettingsRow>
          <SettingsRow
            title="Deployments and builds"
            description="Application deploys and Functions builds."
          >
            <ProfileSelect
              :model-value="form.deployAlertsChannel"
              @update:model-value="
                form.deployAlertsChannel = pickOption(DEPLOY_ALERT_OPTIONS, $event, 'off')
              "
              :options="DEPLOY_ALERT_OPTIONS"
              aria-label="Deployments and builds alerts"
            />
          </SettingsRow>
          <SettingsRow
            title="AI Copilot sessions"
            description="When a long agent task finishes or waits for your approval."
          >
            <ProfileSelect
              :model-value="form.copilotSessionsChannel"
              @update:model-value="
                form.copilotSessionsChannel = pickOption(ALERT_CHANNEL_OPTIONS, $event, 'off')
              "
              :options="ALERT_CHANNEL_OPTIONS"
              aria-label="AI Copilot sessions channel"
            />
          </SettingsRow>
          <SettingsRow
            title="Personal token alerts"
            description="An email as soon as a token is created or is about to expire."
            variant="compact"
          >
            <Switch
              v-model="form.tokenAlerts"
              aria-label="Personal token alerts"
            />
          </SettingsRow>
          <SettingsRow
            title="Release notes and tips"
            description="New features and tips inside the console."
            variant="compact"
          >
            <Switch
              v-model="form.releaseNotes"
              aria-label="Release notes and tips"
            />
          </SettingsRow>
        </Item.List>
      </Card>
    </SettingsGroup>
  </div>
</template>
