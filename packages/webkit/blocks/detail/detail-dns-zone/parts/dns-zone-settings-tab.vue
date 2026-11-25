<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import ItemList from '@aziontech/webkit/item-list'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import type { DnsZoneDetailSettings, DnsZoneDetailZone } from '../detail-dns-zone.vue'

  export interface DnsZoneSettingsTabProps {
    /** The zone whose nameservers and DNSSEC key the form shows. */
    zone: DnsZoneDetailZone
    /** The save is in flight: the form locks and Save spins. */
    saving: boolean
    /** The form differs from the zone, so the save bar shows. */
    dirty: boolean
    /** Id of the Name error message. */
    nameMessageId: string
    /** Id of the Domain name error message. */
    domainMessageId: string
    /** Id of the nameserver description. */
    nameserverMessageId: string
  }

  const props = defineProps<DnsZoneSettingsTabProps>()

  const emit = defineEmits<{
    save: [event: Event]
    shortcut: [event: KeyboardEvent]
    discard: [event: MouseEvent]
  }>()

  const settings = defineModel<DnsZoneDetailSettings>('settings', { required: true })
  const errors = defineModel<{ name: string; domain: string }>('errors', { required: true })

  const dnssecKeys = computed(() => [
    {
      label: 'Key tag',
      value: props.zone.dnssecKey.keyTag,
      description:
        'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
    },
    {
      label: 'Algorithm',
      value: props.zone.dnssecKey.algorithm,
      description: 'Specifies the algorithm used to generate the DNSSEC key.'
    },
    {
      label: 'Digest type',
      value: props.zone.dnssecKey.digestType,
      description: 'Indicates the hash function used for the DNSSEC digest.'
    },
    {
      label: 'Digest',
      value: props.zone.dnssecKey.digest,
      description:
        'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
    }
  ])

  const DNSSEC_DESCRIPTION =
    'Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing ' +
    'attacks. Configure the key tag and digest values in your domain provider to ' +
    'complete the setup.'
</script>

<template>
  <section class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
    <form
      class="flex min-h-full min-w-0 flex-col"
      aria-label="Zone settings"
      novalidate
      @submit.prevent="(event: Event) => emit('save', event)"
    >
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="saving"
          >
            <legend class="sr-only">Zone settings</legend>
            <SettingsGroup
              label="General"
              hint="How this zone is identified across the platform."
              anchor="general"
            >
              <Card :padded="false">
                <template #default>
                  <ItemList>
                    <SettingsRow
                      title="Name"
                      description="Give a unique and descriptive name to identify your zone."
                    >
                      <Input
                        v-model="settings.name"
                        size="large"
                        class="w-full"
                        aria-label="Name"
                        autocomplete="off"
                        required
                        :invalid="!!errors.name"
                        :aria-describedby="errors.name ? nameMessageId : undefined"
                        :disabled="saving"
                        @update:model-value="errors.name = ''"
                      />
                      <FieldError
                        v-if="errors.name"
                        :id="nameMessageId"
                        >{{ errors.name }}</FieldError
                      >
                    </SettingsRow>

                    <SettingsRow
                      title="Domain name"
                      description="Provide the domain name you want to host. Example: example.com."
                    >
                      <Input
                        v-model="settings.domain"
                        size="large"
                        class="w-full"
                        aria-label="Domain name"
                        autocomplete="off"
                        required
                        :invalid="!!errors.domain"
                        :aria-describedby="errors.domain ? domainMessageId : undefined"
                        :disabled="saving"
                        @update:model-value="errors.domain = ''"
                      />
                      <FieldError
                        v-if="errors.domain"
                        :id="domainMessageId"
                        >{{ errors.domain }}</FieldError
                      >
                    </SettingsRow>
                  </ItemList>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              label="Configure your nameserver"
              hint="Make this zone the authoritative DNS for the domain."
              anchor="configure-your-nameserver"
            >
              <Card :padded="false">
                <template #default>
                  <ItemList>
                    <SettingsRow
                      title="Nameservers"
                      description="Make this zone the authoritative DNS for the domain by copying the nameserver values."
                      stackable
                    >
                      <div class="flex w-full flex-col gap-(--spacing-xs)">
                        <InputGroupRoot
                          v-for="(ns, index) in zone.nameservers"
                          :key="ns"
                          size="large"
                        >
                          <Input
                            :model-value="ns"
                            size="large"
                            class="min-w-0 flex-1"
                            :aria-label="'Nameserver ' + (index + 1)"
                            monospace
                            readonly
                          />
                          <CopyButton
                            variant="ghost"
                            :value="ns"
                            :aria-label="'Copy nameserver ' + (index + 1)"
                            size="small"
                          />
                        </InputGroupRoot>
                      </div>
                      <FieldDescription :id="nameserverMessageId"
                        >Add the nameservers in your domain provider.</FieldDescription
                      >
                    </SettingsRow>
                  </ItemList>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              label="DNSSEC"
              hint="Signs the zone so resolvers can detect spoofed answers."
              anchor="dnssec"
            >
              <Card :padded="false">
                <template #default>
                  <ItemList>
                    <SettingsRow
                      title="Enable DNSSEC"
                      :description="DNSSEC_DESCRIPTION"
                      variant="compact"
                    >
                      <Switch
                        v-model="settings.dnssec"
                        aria-label="Enable DNSSEC"
                        :disabled="saving"
                      />
                    </SettingsRow>

                    <template v-if="settings.dnssec">
                      <SettingsRow
                        v-for="key in dnssecKeys"
                        :key="key.label"
                        :title="key.label"
                        :description="key.description"
                        variant="stacked"
                      >
                        <InputGroupRoot
                          size="large"
                          class="w-full"
                        >
                          <Input
                            :model-value="key.value"
                            size="large"
                            class="min-w-0 flex-1"
                            :aria-label="key.label"
                            monospace
                            readonly
                          />
                          <CopyButton
                            variant="ghost"
                            :value="key.value"
                            :aria-label="'Copy ' + key.label"
                            size="small"
                          />
                        </InputGroupRoot>
                      </SettingsRow>
                    </template>
                  </ItemList>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              label="Status"
              hint="A zone can be held inactive while its records are being built."
              anchor="status"
            >
              <Card :padded="false">
                <template #default>
                  <ItemList>
                    <SettingsRow
                      title="Active"
                      description="When active, the zone answers authoritative DNS queries for the domain."
                      variant="compact"
                    >
                      <Switch
                        v-model="settings.active"
                        aria-label="Active"
                        :disabled="saving"
                      />
                    </SettingsRow>
                  </ItemList>
                </template>
              </Card>
            </SettingsGroup>
          </fieldset>
        </section>
      </div>
      <Transition
        enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
        leave-to-class="translate-y-2 opacity-0"
      >
        <SaveBar
          v-if="dirty || saving"
          variant="docked"
          @save="(event: KeyboardEvent) => emit('shortcut', event)"
        >
          You have unsaved changes.

          <template #actions>
            <Button
              type="button"
              label="Discard"
              variant="outline"
              size="medium"
              :disabled="saving"
              @click="(event: MouseEvent) => emit('discard', event)"
            />
            <Button
              type="submit"
              variant="primary"
              size="medium"
              :loading="saving"
              aria-keyshortcuts="Meta+S Control+S"
            >
              Save
              <Kbd
                meta
                size="small"
                aria-hidden="true"
                >S</Kbd
              >
            </Button>
          </template>
        </SaveBar>
      </Transition>
    </form>
  </section>
</template>
