<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import Item from '@aziontech/webkit/item'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import OtpInput from '@aziontech/webkit/otp-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, nextTick, ref } from 'vue'

  const account = { name: 'Jane Doe', initials: 'JD', email: 'jane.doe@example.com' }

  const request = {
    code: 'WDJBMJHT',
    client: 'Acme CLI',
    device: 'build-runner-01',
    address: '203.0.113.24',
    requested: 'Nov 14, 2026, 10:42 UTC',
    expires: '15 minutes'
  }

  const scopes = [
    {
      id: 'workloads:read',
      icon: 'ai ai-globe',
      title: 'Read your workloads',
      description: 'Names, domains and status.'
    },
    {
      id: 'applications:deploy',
      icon: 'ai ai-upload',
      title: 'Deploy your applications',
      description: 'Create and publish new versions from the terminal.'
    }
  ]

  const entering = ref(false)
  const code = ref('')
  const codeError = ref('')
  const shownCode = ref(request.code)
  const pending = ref<'' | 'check' | 'confirm' | 'cancel'>('')
  const outcome = ref<'' | 'connected' | 'cancelled'>('')
  const unreachable = ref(false)

  const settled = computed(() => !!outcome.value)
  const grouped = computed(() => `${shownCode.value.slice(0, 4)}-${shownCode.value.slice(4)}`)

  const focusCode = () => nextTick(() => document.getElementById('device-code')?.focus())

  const enterCode = () => {
    entering.value = true
    code.value = ''
    codeError.value = ''
    unreachable.value = false
    focusCode()
  }

  const check = () => {
    if (pending.value) return
    unreachable.value = false
    if (code.value.length < 8) {
      codeError.value = code.value
        ? 'Enter all 8 characters of the code.'
        : 'Enter the code your terminal shows.'
      focusCode()
      return
    }
    codeError.value = ''
    pending.value = 'check'
    setTimeout(() => {
      pending.value = ''
      if (/^0+$/.test(code.value)) {
        codeError.value =
          'That code is not valid or has expired. Check your terminal, or start the sign-in again there.'
        code.value = ''
        focusCode()
        return
      }
      if (/^9+$/.test(code.value)) {
        unreachable.value = true
        return
      }
      shownCode.value = code.value
      entering.value = false
    }, 600)
  }

  const respond = (answer: 'confirm' | 'cancel') => {
    if (pending.value || settled.value) return
    pending.value = answer
    setTimeout(() => {
      pending.value = ''
      outcome.value = answer === 'confirm' ? 'connected' : 'cancelled'
    }, 600)
  }
</script>
<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
    <GlobalHeader
      aria-label="Console"
      class="shrink-0"
    >
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-control) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>
      </GlobalHeader.Brand>
      <GlobalHeader.Center />
      <GlobalHeader.End>
        <Button
          label="Documentation"
          kind="outlined"
          size="medium"
          icon="ai ai-book"
          href="/docs"
        />
      </GlobalHeader.End>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
        <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
          <div
            class="m-auto flex w-full flex-col items-center gap-(--spacing-md) transition-[translate,opacity] duration-slow-01 ease-expressive-entrance starting:-translate-x-6 starting:opacity-0 rtl:starting:translate-x-6 motion-reduce:transition-none"
          >
            <div class="flex w-full flex-col items-center">
              <Card
                class="w-full max-w-(--container-sm)"
                :padded="false"
              >
                <template #default>
                  <section
                    class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
                    aria-labelledby="device-authorization-title"
                  >
                    <PageHeader
                      title-id="device-authorization-title"
                      :title="`Connect ${request.client}`"
                      :description="
                        entering
                          ? 'Enter the code your terminal shows to connect it to your account.'
                          : 'Check that this code matches the one in your terminal, then confirm.'
                      "
                    />

                    <Alert
                      key="alert-1"
                      v-if="outcome === 'connected'"
                      severity="success"
                      size="small"
                      label="Device connected. Go back to your terminal; you can close this tab."
                    />
                    <Alert
                      key="alert-2"
                      v-else-if="outcome === 'cancelled'"
                      severity="info"
                      size="small"
                      label="Request cancelled. The device was not connected."
                    />
                    <Alert
                      key="alert-3"
                      v-else-if="unreachable"
                      severity="warning"
                      size="small"
                    >
                      We could not check the code. Your entry is kept; try again in a moment.
                      <template #actions>
                        <Button
                          label="Retry"
                          kind="secondary"
                          size="small"
                          :loading="pending === 'check'"
                          @click="check"
                        />
                      </template>
                    </Alert>

                    <form
                      v-if="entering"
                      class="flex flex-col gap-(--spacing-lg)"
                      aria-label="Enter the device code"
                      novalidate
                      @submit.prevent="check"
                    >
                      <Field :invalid="!!codeError">
                        <Field.Label for="device-code">Device code</Field.Label>
                        <OtpInput
                          id="device-code"
                          v-model="code"
                          name="code"
                          :length="8"
                          mode="alphanumeric"
                          :group="4"
                          :disabled="pending === 'check'"
                          @update:model-value="codeError = ''"
                          @complete="check"
                        />
                        <Field.Description>{{
                          codeError ||
                          `Codes expire ${request.expires} after the terminal shows them.`
                        }}</Field.Description>
                      </Field>
                      <Button
                        type="submit"
                        label="Continue"
                        kind="primary"
                        size="large"
                        class="w-full"
                        :loading="pending === 'check'"
                      />
                    </form>

                    <template v-else>
                      <div
                        class="flex flex-col items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md)"
                      >
                        <span class="text-label-sm text-(--text-muted)">Device code</span>
                        <span class="text-label-code-lg text-(--text-default)">{{ grouped }}</span>
                      </div>

                      <KeyValueList
                        kind="split"
                        aria-label="Request details"
                      >
                        <KeyValueList.Item label="Application">{{
                          request.client
                        }}</KeyValueList.Item>
                        <KeyValueList.Item label="Device">{{ request.device }}</KeyValueList.Item>
                        <KeyValueList.Item label="IP address">{{
                          request.address
                        }}</KeyValueList.Item>
                        <KeyValueList.Item label="Requested">{{
                          request.requested
                        }}</KeyValueList.Item>
                      </KeyValueList>

                      <div class="flex flex-col gap-(--spacing-xs)">
                        <h2 class="text-label-md text-(--text-muted)">Signed in as</h2>
                        <Item
                          kind="outlined"
                          size="small"
                        >
                          <Item.Media>
                            <Avatar
                              :label="account.initials"
                              size="medium"
                            />
                          </Item.Media>
                          <Item.Content>
                            <Item.Title>{{ account.name }}</Item.Title>
                            <Item.Description>{{ account.email }}</Item.Description>
                          </Item.Content>
                          <Item.Actions>
                            <Button
                              label="Switch account"
                              kind="outlined"
                              size="small"
                              href="/login?prompt=select_account"
                              :disabled="!!pending || settled"
                            />
                          </Item.Actions>
                        </Item>
                      </div>

                      <div class="flex flex-col gap-(--spacing-xs)">
                        <h2
                          id="device-authorization-scopes"
                          class="text-label-md text-(--text-muted)"
                        >
                          {{ request.client }} will be able to
                        </h2>
                        <Item.List aria-labelledby="device-authorization-scopes">
                          <Item
                            v-for="scope in scopes"
                            :key="scope.id"
                            size="small"
                            role="listitem"
                          >
                            <Item.Media kind="icon">
                              <i
                                :class="scope.icon"
                                aria-hidden="true"
                              />
                            </Item.Media>
                            <Item.Content>
                              <Item.Title>{{ scope.title }}</Item.Title>
                              <Item.Description>{{ scope.description }}</Item.Description>
                            </Item.Content>
                          </Item>
                        </Item.List>
                      </div>

                      <div class="grid grid-cols-2 gap-(--spacing-sm)">
                        <Button
                          label="Cancel"
                          kind="secondary"
                          size="large"
                          class="w-full"
                          :loading="pending === 'cancel'"
                          :disabled="pending === 'confirm' || settled"
                          @click="respond('cancel')"
                        />
                        <Button
                          label="Confirm"
                          kind="primary"
                          size="large"
                          class="w-full"
                          :loading="pending === 'confirm'"
                          :disabled="pending === 'cancel' || settled"
                          @click="respond('confirm')"
                        />
                      </div>

                      <a
                        v-if="!settled"
                        class="text-link self-start text-body-sm"
                        href="#"
                        @click.prevent="enterCode"
                        >The code does not match? Enter the code from your terminal</a
                      >
                    </template>
                  </section>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
