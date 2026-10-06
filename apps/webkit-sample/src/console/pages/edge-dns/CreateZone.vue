<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FieldRow from '../../components/form/FieldRow.vue'
  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import { useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import { parseZoneFile } from '../../lib/format/zone-file'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const form = reactive({
    name: '',
    domain: '',
    dnssec: false,
    active: true
  })
  const errors = reactive({
    name: '',
    nameKind: 'required',
    domain: '',
    domainKind: 'required'
  })

  const submitting = ref(false)

  const { dirty, commit } = useBaseline(form)

  const NAME_MAX = 50
  const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (name.length > NAME_MAX) {
      errors.nameKind = 'invalid'
      errors.name = `Use at most ${NAME_MAX} characters.`
    } else {
      errors.name = ''
    }

    const domain = form.domain.trim()
    if (!domain) {
      errors.domainKind = 'required'
      errors.domain = 'This field is required.'
    } else if (!DOMAIN_PATTERN.test(domain)) {
      errors.domainKind = 'invalid'
      errors.domain = 'Enter a valid domain name. Example: mydomain.com.'
    } else {
      errors.domain = ''
    }

    return !errors.name && !errors.domain
  }

  const records = ref([])
  const importedFrom = ref('')

  const fileRef = ref(null)

  const openImport = () => fileRef.value?.click()

  const applyParsed = (parsed, source) => {
    if (parsed.origin) {
      if (!form.domain.trim()) {
        form.domain = parsed.origin
        errors.domain = ''
      }
      if (!form.name.trim()) {
        form.name = parsed.origin
        errors.name = ''
      }
    }
    records.value = [...records.value, ...parsed.records]
    importedFrom.value = source

    const count = parsed.records.length
    toast.success(
      count === 1
        ? `Imported 1 record from ${source}.`
        : `Imported ${count} records from ${source}.`,
      parsed.origin ? { description: `Zone origin ${parsed.origin}.` } : undefined
    )
  }

  const onFilePicked = async (event) => {
    const [file] = event.target.files ?? []
    event.target.value = ''
    if (!file) return

    const parsed = parseZoneFile(await file.text())
    if (parsed.records.length === 0) {
      toast.error(`No records found in “${file.name}”.`, {
        description: 'Expected a zone file in the BIND form, like www IN CNAME example.com.'
      })
      return
    }

    applyParsed(parsed, `“${file.name}”`)
  }

  const onDomainPaste = (event) => {
    const parsed = parseZoneFile(event.clipboardData?.getData('text/plain') ?? '')
    if (parsed.records.length === 0) return

    event.preventDefault()
    applyParsed(parsed, 'the pasted zone file')
  }

  const removeRecord = (index) => {
    records.value.splice(index, 1)
    if (records.value.length === 0) importedFrom.value = ''
  }

  const discardImport = () => {
    const count = records.value.length
    records.value = []
    importedFrom.value = ''
    toast.info(
      count === 1 ? '1 imported record discarded.' : `${count} imported records discarded.`
    )
  }

  const { path: originPath, label: originLabel } = useCreateOrigin('/edge-dns', 'Edge DNS')

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const name = form.name.trim()
      const domain = form.domain.trim()
      const id = String(Math.floor(1000 + Math.random() * 9000))
      toast.success(`Zone "${name}" created.`, {
        description: records.value.length
          ? `${records.value.length} imported record${records.value.length === 1 ? '' : 's'} created with the zone.`
          : undefined
      })
      commit()
      router.push({
        path: `/edge-dns/${id}`,
        query: { email: userEmail.value, name, domain }
      })
    } catch (error) {
      toast.error('Could not create the zone.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: 'Create Zone' }]"
    :back-label="`Back to ${originLabel}`"
    title="Create Zone"
    description="A zone holds the DNS records that answer authoritatively for a domain, served from Azion's distributed infrastructure."
    title-id="create-zone-title"
    :submitting="submitting"
    :dirty="dirty"
    @cancel="cancel"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="General"
      hint="The two fields this endpoint requires: what the zone is called here, and the domain it answers for."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              title="Name"
              description="Identifies the zone in this list. It is not the domain."
              :message="errors.name"
              :message-kind="errors.nameKind || 'required'"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  aria-label="Name"
                  placeholder="My zone"
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.name && errors.nameKind === 'required'"
                  :invalid="!!errors.name && errors.nameKind === 'invalid'"
                  :aria-describedby="messageId"
                  @update:model-value="errors.name = ''"
                />
              </template>
            </FieldRow>

            <FieldRow
              title="Domain Name"
              description="The root domain this zone answers for, without a subdomain. Pasting a zone file here imports its records instead."
              :message="errors.domain"
              :message-kind="errors.domainKind || 'required'"
            >
              <template #default="{ messageId }">
                <InputText
                  v-model="form.domain"
                  size="large"
                  class="w-full"
                  aria-label="Domain Name"
                  placeholder="mydomain.com"
                  autocomplete="off"
                  :disabled="submitting"
                  :required="!!errors.domain && errors.domainKind === 'required'"
                  :invalid="!!errors.domain && errors.domainKind === 'invalid'"
                  :aria-describedby="messageId"
                  @update:model-value="errors.domain = ''"
                  @paste="onDomainPaste"
                />
              </template>
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <Section
      v-if="records.length"
      stacked
      :divided="false"
      title="Records"
      :hint="`Read from ${importedFrom} and created with the zone, except the SOA and the nameservers, which stay Azion's.`"
    >
      <template #aside>
        <Button
          type="button"
          label="Discard import"
          kind="text"
          size="medium"
          class="self-start"
          :disabled="submitting"
          @click="discardImport"
        />
      </template>
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="(record, index) in records"
              :key="`${record.name}-${record.type}-${index}`"
              size="small"
            >
              <Item.Content>
                <Item.Title>
                  {{ record.name }}
                  <Tag
                    :label="record.type"
                    severity="info"
                    size="medium"
                  />
                </Item.Title>
                <Item.Description>{{ record.value }} · TTL {{ record.ttl }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <IconButton
                  icon="pi pi-times"
                  kind="text"
                  size="medium"
                  :aria-label="`Remove ${record.type} record ${record.name}`"
                  :disabled="submitting"
                  @click="removeRecord(index)"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <FieldRow
              kind="compact"
              title="DNSSEC"
              description="Signs this zone's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider."
            >
              <Switch
                v-model="form.dnssec"
                aria-label="Enable DNSSEC"
                :disabled="submitting"
              />
            </FieldRow>

            <FieldRow
              kind="compact"
              title="Active"
              description="When active, the zone answers authoritative DNS queries for the domain."
            >
              <Switch
                v-model="form.active"
                aria-label="Active"
                :disabled="submitting"
              />
            </FieldRow>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <template #start>
      <Button
        type="button"
        label="Import"
        kind="outlined"
        size="medium"
        icon="pi pi-upload"
        :disabled="submitting"
        @click="openImport"
      />
      <p class="min-w-0 text-body-sm text-(--text-muted)">
        or paste zone file contents in Domain Name
      </p>
      <input
        ref="fileRef"
        type="file"
        accept=".zone,.txt,.db,text/plain"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        @change="onFilePicked"
      />
    </template>
  </CreatePage>
</template>
