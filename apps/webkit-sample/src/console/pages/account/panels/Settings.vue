<script setup>
  // Settings → Account Settings. The account's identity, company details, address,
  // login preferences, connected source-control providers, appearance, and the
  // destructive Danger Zone.
  //
  // SAVE SCOPE — ONE save for the whole page, and the bar that commits it does not
  // exist until something has been edited. That is the console's settings model (an
  // application's Main Settings is the same shape): these fields are one account
  // record submitted together, so a per-band Save would ask which part of one record
  // the reader meant, and a bar pinned from the first paint would advertise work
  // nobody has started.
  //
  // LAYOUT — the bands are the create pattern exactly: a Section (title + Hint) over
  // a flush CardBox whose body is an Item.List of FieldRows. So the page that creates
  // a thing and the page that edits it are the same anatomy, and the reader learns
  // one. This tab owns its own scroll region AND its own footer, which is why the
  // shell hands it a plain flex column rather than a scroll box: a footer pinned by
  // the shell would need this form's flags back out of the component.
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
  import { useTheme } from '@shared/lib/theme.js'
  import { reactive, ref } from 'vue'

  import FieldRow from '../../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useFont } from '../../../lib/state/font.js'

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

  // The three address selects are one row shape repeated, so they are data: three
  // hand-written blocks differing only in their option list is three places to fix
  // the next time the row changes.
  const places = [
    { key: 'country', label: 'Country', options: countries },
    { key: 'state', label: 'State/Region', options: states },
    { key: 'city', label: 'City', options: cities }
  ]

  // One flag locks the whole scope while the request is in flight: Save shows
  // :loading and the outer <fieldset> is :disabled off it.
  const saving = ref(false)

  // `dirty` is what MOUNTS the bar: it compares the live form against the baseline
  // committed by the last successful save, so the bar appears on the first edit and
  // leaves again when the reader puts the value back.
  const { dirty, commit } = useBaseline(form)

  // What Discard restores. Kept as a JSON snapshot rather than a reactive copy so
  // restoring cannot alias the live object and re-dirty it.
  const snapshot = ref(JSON.parse(JSON.stringify(form)))

  const save = () =>
    saveGroup(saving, 'Account settings saved.', () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(form))
    })

  const discard = () => {
    Object.assign(form, JSON.parse(JSON.stringify(snapshot.value)))
  }

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
    @submit.prevent="save"
  >
    <!-- Body: the only region that scrolls, between the tab bar above and the bar
         that appears below once something is edited. -->
    <div class="min-h-0 flex-1 overflow-auto">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-[var(--layout-section-gap)] pt-[var(--layout-section-gap)]"
      >
        <PageHeading
          title="Account Settings"
          description="Manage your account's identity, company details, address, and login preferences."
        />

        <!-- Section owns the band step, so the fieldset only stacks them. -->
        <fieldset
          class="mx-0 mt-[var(--layout-section-gap)] flex min-w-0 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">Account settings</legend>

          <Section
            stacked
            anchor
            :divided="false"
            title="General"
            hint="How this account is identified on the platform."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    title="Account Name"
                    description="What this account is called across the console."
                  >
                    <InputText
                      v-model="form.accountName"
                      size="large"
                      class="w-full"
                      aria-label="Account Name"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    title="Client ID"
                    description="Can't be changed. Quote it when opening a support ticket about this account."
                  >
                    <InputText
                      v-model="form.clientId"
                      size="large"
                      class="w-full"
                      aria-label="Client ID"
                      readonly
                      :disabled="saving"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Company information"
            hint="The company that owns the account. These details appear on every invoice."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    title="Company Name"
                    description="The legal entity that owns this account."
                  >
                    <InputText
                      v-model="form.companyName"
                      size="large"
                      class="w-full"
                      aria-label="Company Name"
                      placeholder="Company S.A."
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    title="Company ID"
                    description="Personal or company ID number that identifies account ownership."
                  >
                    <InputText
                      v-model="form.companyId"
                      size="large"
                      class="w-full"
                      aria-label="Company ID"
                      placeholder="00.000.000/0001-00"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    kind="wide"
                    title="Billing emails"
                    description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
                  >
                    <Textarea
                      v-model="form.billingEmails"
                      class="w-full"
                      :rows="3"
                      aria-label="Billing emails"
                      :disabled="saving"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Address information"
            hint="Where the account owner is registered. Used on invoices and for tax purposes."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow title="Postal Code">
                    <InputText
                      v-model="form.postalCode"
                      size="large"
                      class="w-full"
                      aria-label="Postal Code"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    v-for="place in places"
                    :key="place.key"
                    :title="place.label"
                  >
                    <Select
                      v-model="form[place.key]"
                      size="large"
                      :display-value="
                        (value) =>
                          place.options.find((option) => option.value === value)?.label ?? ''
                      "
                    >
                      <Select.Trigger
                        class="w-full"
                        :aria-label="place.label"
                      />
                      <Select.Content>
                        <Select.Option
                          v-for="option in place.options"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                  </FieldRow>
                  <FieldRow title="Address">
                    <InputText
                      v-model="form.address"
                      size="large"
                      class="w-full"
                      aria-label="Address"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow title="Apartment, floor, etc.">
                    <InputText
                      v-model="form.apartment"
                      size="large"
                      class="w-full"
                      aria-label="Apartment, floor, etc."
                      placeholder="1st floor"
                      :disabled="saving"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Login Settings"
            hint="How the users linked to this account sign in."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    kind="compact"
                    title="Allow social login"
                    description="Users linked to the account can log in with their social network credentials."
                  >
                    <Switch
                      v-model="form.allowSocialLogin"
                      aria-label="Allow social login"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <FieldRow
                    kind="compact"
                    title="Enforce multi-factor authentication"
                    description="MFA is required on login for every user linked to this account."
                  >
                    <Switch
                      v-model="form.enforceMfa"
                      aria-label="Enforce multi-factor authentication"
                      :disabled="saving"
                    />
                  </FieldRow>
                  <!-- A row whose control is an ACTION, not a value: it opens its own
                       surface and commits there, so it is untouched by this page's
                       Save. Same row anatomy as the two above, so the band keeps one
                       straight edge. -->
                  <FieldRow
                    kind="compact"
                    title="Authenticator devices"
                    description="Manage the devices and recovery codes registered for this account."
                  >
                    <Button
                      type="button"
                      label="Manage"
                      kind="outlined"
                      size="medium"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <Section
            stacked
            anchor
            :divided="false"
            title="Source control"
            hint="The Git providers this account can read repositories from when it builds an application. Connecting one commits immediately at the provider, so these rows are not part of Save."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <Item
                    v-for="provider in sourceControls"
                    :key="provider.key"
                    size="small"
                  >
                    <Item.Media>
                      <!-- Git-provider icon frame: 32px square, surface-raised fill,
                           muted hairline border, 20px glyph. -->
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
          </Section>

          <!-- Appearance — live preferences (font + theme), OUTSIDE the save scope:
               they drive the app singletons and persist on change. The hint is where
               that exception is stated, so nobody looks for them under Save. -->
          <Section
            stacked
            anchor
            :divided="false"
            title="Appearance"
            hint="Preferences for this browser. They apply the moment you change them and are not part of Save."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    title="Font family"
                    description="The primary sans typeface across the console. Non-default faces load from Google Fonts."
                  >
                    <Select
                      v-model="font"
                      size="large"
                      :display-value="
                        (value) => fonts.find((option) => option.value === value)?.label ?? ''
                      "
                    >
                      <Select.Trigger
                        class="w-full"
                        aria-label="Font family"
                      />
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
                  </FieldRow>
                  <FieldRow
                    title="System appearance"
                    description="Follow the operating system, or force a light or dark theme."
                  >
                    <Select
                      v-model="theme"
                      size="large"
                      :display-value="
                        (value) => appearances.find((option) => option.value === value)?.label ?? ''
                      "
                    >
                      <Select.Trigger
                        class="w-full"
                        aria-label="System appearance"
                      />
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
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>

          <!-- Danger Zone — titled like every other band above it. What marks it as
               destructive is the `kind="danger"` Button inside, not a recoloured
               heading. -->
          <Section
            stacked
            anchor
            :divided="false"
            title="Danger Zone"
            hint="Irreversible. Read the row before you click it."
          >
            <CardBox :padded="false">
              <template #content>
                <Item.List>
                  <FieldRow
                    kind="compact"
                    title="Remove personal account"
                    description="Permanently deletes this Personal Account and all associated data from Azion's platform. It cannot be undone."
                  >
                    <Button
                      type="button"
                      label="Delete account"
                      kind="danger"
                      size="medium"
                      icon="pi pi-trash"
                      @click="deleteAccount"
                    />
                  </FieldRow>
                </Item.List>
              </template>
            </CardBox>
          </Section>
        </fieldset>
      </div>
    </div>

    <!-- The bar exists only once something has been edited, and it SLIDES UP when it
         appears — the same commit model as an application's Main Settings, so every
         settings page in the console behaves identically. Mounted with `v-if`, not
         hidden with opacity: a settings page opens read-mostly, and a Save bar pinned
         from the first paint is a permanent call to action for work nobody started,
         costing 56px to say there is nothing to do. Discard comes with it, because a
         page-level commit owes a way out that is not undoing each field by hand. -->
    <!-- The bar has no scrolling ancestor here — this tab owns its own scroll box and the
         footer is that box's sibling — so `sticky` resolves to in-flow and the flex column
         holds it at the bottom. -->
    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      @save="save"
      @discard="discard"
    />
  </form>
</template>
