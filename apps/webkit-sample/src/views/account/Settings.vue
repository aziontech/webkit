<script setup>
  // Settings → Account Settings. The account's identity, company details, address,
  // login preferences, connected source-control providers, appearance, and the
  // destructive Danger Zone.
  //
  // SAVE SCOPE — one flag for the whole tab, not per-group. Unlike an application's
  // Main Settings (where each topic group owns its own footer Save), these fields
  // are one account record submitted together: Save shows `:loading`, the outer
  // <fieldset> is `:disabled` off the same flag, and the bar stays pinned so it is
  // reachable without scrolling back down a long form.
  //
  // LAYOUT — this tab owns its own scroll region AND its own pinned footer, which is
  // why the shell hands it a plain flex column rather than a scroll box: a footer
  // pinned by the shell would need the form's `submitting`/`submit` back out of this
  // component, which is exactly the coupling the split removes. The measure is the
  // FORM one (`.layout-column-form`) on the body AND on the footer, so the buttons
  // stay under the fields they submit instead of drifting to the viewport edge.
  //
  // Appearance is the one section OUTSIDE the save scope: font and theme drive
  // module-level singletons persisted to localStorage, so they apply live on change.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import PageHeading from '../../components/ui/PageHeading.vue'
  import SectionHeading from '../../components/ui/SectionHeading.vue'
  import { useFont } from '../../font.js'
  import { sleep } from '../../lib/forms'
  import { useTheme } from '../../theme.js'

  const DOCS = 'https://www.azion.com/en/documentation/'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // Appearance preferences apply LIVE (they drive module-level singletons and are
  // persisted to localStorage), so they sit outside the `submitting` save scope.
  const { font, fonts } = useFont()
  const { theme } = useTheme()
  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]

  // --- Field option models -------------------------------------------------
  const countries = [
    { label: 'Brazil', value: 'br' },
    { label: 'United States', value: 'us' },
    { label: 'Portugal', value: 'pt' }
  ]
  const states = [
    { label: 'Rio Grande do Sul', value: 'rs' },
    { label: 'São Paulo', value: 'sp' },
    { label: 'Rio de Janeiro', value: 'rj' }
  ]
  const cities = [
    { label: 'Porto Alegre', value: 'poa' },
    { label: 'São Paulo', value: 'sao' },
    { label: 'Rio de Janeiro', value: 'rio' }
  ]

  // A display-value resolver for each Select (maps stored value → visible label).
  const labelOf = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''

  // --- Form state ----------------------------------------------------------
  const form = reactive({
    accountName: 'Gabriel Lisboa',
    clientId: '9757a',
    companyName: '',
    companyId: '',
    billingEmails: 'gabriel.mendonca@azion.com',
    postalCode: '00000-000',
    country: 'br',
    state: 'rs',
    city: 'poa',
    address: 'n',
    apartment: '',
    allowSocialLogin: true,
    enforceMfa: false
  })

  // One flag locks the whole scope while the request is in flight: Save shows
  // :loading and the outer <fieldset> is :disabled off it.
  const submitting = ref(false)

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock

    submitting.value = true
    try {
      await sleep(900)
      toast.success('Account settings saved.')
    } catch (error) {
      // Request-level failure → toast, with a way to recover. Never silent.
      toast.error('Could not save account settings.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }

  const cancel = () => router.push({ path: '/home', query: { email: userEmail.value } })

  // Source control providers. GitHub is connected; GitLab and Bitbucket can be
  // linked. GitHub has no colored glyph, so it uses the monochrome PrimeIcon.
  const sourceControls = [
    {
      key: 'github',
      name: 'Github',
      icon: 'pi pi-github',
      connected: true,
      tag: 'Active',
      description:
        'Connected as rafael.umman: to repositories in organizations: azion-tech, rafael-personal.',
      action: 'Manage'
    },
    {
      key: 'gitlab',
      name: 'Gitlab',
      icon: 'ai-cor ai-gitlab',
      connected: false,
      description: 'Connect GitLab for Cloud Agents, and enhanced codebase control.',
      action: 'Connect'
    },
    {
      key: 'bitbucket',
      name: 'Bitbucket',
      icon: 'ai-cor ai-bitbucket',
      connected: false,
      description: 'Connect Bitbucket for Cloud Agents, and enhanced codebase control.',
      action: 'Connect'
    }
  ]

  const onProviderAction = (provider) =>
    provider.connected
      ? toast.success(`Opening ${provider.name} integration settings…`)
      : toast.success(`Connecting to ${provider.name}…`)

  const deleteAccount = () =>
    toast.error('This action is disabled in the demo.', {
      description: 'Deleting an account is irreversible.'
    })
</script>

<template>
  <form
    class="flex min-h-0 flex-1 flex-col"
    aria-label="Account settings"
    novalidate
    @submit.prevent="submit"
  >
    <!-- Body: the only region that scrolls, between the tab bar above and the Save
         bar pinned below. -->
    <div class="min-h-0 flex-1 overflow-auto">
      <div
        class="layout-column-form layout-boundary flex min-w-0 flex-col"
      >
        <PageHeading
          title="Account Settings"
          description="Manage your account's identity, company details, address, and login preferences."
        />

        <fieldset
          class="layout-section-start mx-0 flex min-w-0 flex-col gap-[var(--layout-section-gap)] border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">Account settings</legend>

          <!-- Section: General -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="General"
              anchor
            />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Account Name</Item.Title>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.accountName"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Account Name"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Client ID</Item.Title>
                      <Item.Description>
                        ID of the associated account. Can't be changed. Use this value to open
                        support tickets for issues related to the account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.clientId"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Client ID"
                        readonly
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Company Information -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Company Information"
              anchor
            />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Company Name</Item.Title>
                      <Item.Description>
                        Name of the company associated with the account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.companyName"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Company Name"
                        placeholder="Company S.A."
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Company ID</Item.Title>
                      <Item.Description>
                        Personal or company ID number to identify account ownership.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.companyId"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Company ID"
                        placeholder="00.000.000/0001-00"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Billing Emails</Item.Title>
                      <Item.Description>
                        Billing information will be forwarded to all emails listed in this field.
                        Separate each email address with a semicolon ( ; ).
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <Textarea
                        v-model="form.billingEmails"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Billing Emails"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Address Information -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Address Information"
              anchor
            />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Postal Code</Item.Title>
                      <Item.Description> Postal code of the account owner. </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.postalCode"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Postal Code"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Country</Item.Title>
                      <Item.Description>Account owner's country.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <Select
                        v-model="form.country"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        placeholder="Select an option..."
                        :display-value="labelOf(countries)"
                      >
                        <Select.Trigger aria-label="Country" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in countries"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>State/Region</Item.Title>
                      <Item.Description> Account owner's state or region. </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <Select
                        v-model="form.state"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        placeholder="Select an option..."
                        :display-value="labelOf(states)"
                      >
                        <Select.Trigger aria-label="State/Region" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in states"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>City</Item.Title>
                      <Item.Description>Account owner's city.</Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <Select
                        v-model="form.city"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        placeholder="Select an option..."
                        :display-value="labelOf(cities)"
                      >
                        <Select.Trigger aria-label="City" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in cities"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Address</Item.Title>
                      <Item.Description> Account owner's street address. </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.address"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Address"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Apartment, floor, etc.</Item.Title>
                      <Item.Description> Additional information for the address. </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <InputText
                        v-model="form.apartment"
                        size="large"
                        :disabled="submitting"
                        class="w-full"
                        aria-label="Apartment, floor, etc."
                        placeholder="1st floor"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Login Settings -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Login Settings"
              anchor
              :documentation="DOCS"
            />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Allow Social Login</Item.Title>
                      <Item.Description>
                        When enabled, users linked to the account can log in using their social
                        network credentials.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Switch
                        v-model="form.allowSocialLogin"
                        aria-label="Allow Social Login"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Enforce Multi-Factor Authentication</Item.Title>
                      <Item.Description>
                        When enabled, MFA will be enforced upon login for all users linked to this
                        account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Switch
                        v-model="form.enforceMfa"
                        aria-label="Enforce Multi-Factor Authentication"
                        :disabled="submitting"
                      />
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Multi-Factor Authentication Management</Item.Title>
                      <Item.Description>
                        Manage the authenticator devices and recovery codes for this account.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Button
                        type="button"
                        label="Manage"
                        kind="outlined"
                        size="medium"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Source Control -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Source Control"
              anchor
              :documentation="DOCS"
            />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item
                    v-for="provider in sourceControls"
                    :key="provider.key"
                    size="small"
                  >
                    <Item.Media>
                      <!-- Git-provider icon frame (Figma node 5831-26595):
                           32px square, surface-raised fill, muted hairline
                           border, shape-elements radius, 20px glyph. -->
                      <span
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[var(--shape-elements)] border-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                      >
                        <i
                          :class="[
                            provider.icon,
                            'text-[18px] leading-none text-[var(--text-default)]'
                          ]"
                          aria-hidden="true"
                        />
                      </span>
                    </Item.Media>
                    <Item.Content>
                      <Item.Title>
                        {{ provider.name }}
                        <Tag
                          v-if="provider.tag"
                          :label="provider.tag"
                          severity="success"
                          size="small"
                        />
                      </Item.Title>
                      <Item.Description>{{ provider.description }}</Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end">
                      <Button
                        type="button"
                        :label="provider.action"
                        kind="outlined"
                        size="medium"
                        :icon="provider.connected ? undefined : 'pi pi-arrow-up-right'"
                        @click="onProviderAction(provider)"
                      />
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Appearance — live preferences (font + theme), outside the
               save scope. They drive the app singletons and persist on change. -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Appearance"
              anchor
            />
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>Font family</Item.Title>
                      <Item.Description>
                        The primary sans typeface used across the console. Applies immediately;
                        non-default faces load from Google Fonts.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <Select
                        v-model="font"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(fonts)"
                      >
                        <Select.Trigger aria-label="Font family" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in fonts"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>
                  <Item size="small">
                    <Item.Content>
                      <Item.Title>System appearance</Item.Title>
                      <Item.Description>
                        Follow the operating system, or force a light or dark theme.
                      </Item.Description>
                    </Item.Content>
                    <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                      <Select
                        v-model="theme"
                        size="large"
                        class="w-full"
                        :display-value="labelOf(appearances)"
                      >
                        <Select.Trigger aria-label="System appearance" />
                        <Select.Content>
                          <Select.Option
                            v-for="option in appearances"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </Item.Actions>
                  </Item>
                </Item.List>
              </template>
            </CardBox>
          </section>

          <!-- Section: Danger Zone — titled like every other band above it. What
               marks it as destructive is the `kind="danger"` Button inside, not a
               recoloured heading. -->
          <section class="flex flex-col gap-[var(--layout-group-gap)]">
            <SectionHeading
              title="Danger Zone"
              anchor
            />
            <Item kind="outline">
              <Item.Content>
                <Item.Title>Remove Personal Account</Item.Title>
                <Item.Description>
                  This action permanently deletes this Personal Account and all associated data from
                  Azion's platform. It cannot be undone.
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Button
                  type="button"
                  label="Delete account"
                  kind="danger"
                  size="medium"
                  icon="pi pi-trash"
                  @click="deleteAccount"
                />
              </Item.Actions>
            </Item>
          </section>
        </fieldset>
      </div>
    </div>

    <!-- Save bar — pinned below the scrolling body, on the SAME measure as the
         fields so the buttons stay under the form they submit. The scope stays
         locked while the request is in flight. -->
    <footer
      class="shrink-0 border-t-[length:var(--border-width-default)] border-[var(--border-muted)] bg-[var(--bg-surface)]"
    >
      <div
        class="layout-column-form layout-boundary-inline flex items-center justify-end gap-[var(--spacing-sm)] py-[var(--spacing-md)]"
      >
        <Button
          type="button"
          label="Cancel"
          kind="outlined"
          size="medium"
          :disabled="submitting"
          @click="cancel"
        />
        <!-- webkit Button renders a native type="button" and does not forward a type
             prop, so drive submit from its click event. -->
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="submitting"
          @click="submit"
        />
      </div>
    </footer>
  </form>
</template>
