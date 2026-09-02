<script setup>
  // Edge DNS — create zone flow. A focused creation shell (the /navigation skill):
  // the console sidebar is dropped so the single task owns the screen, and the
  // only chrome is one CreationHeader (back + brand + breadcrumb + account
  // avatar). The module create for a resource with a start and an end lands on a
  // dedicated PAGE (route /edge-dns/new), not a modal, so it is linkable and
  // back-button-safe.
  //
  // Layout is section cards (the /form Fields-separated approach composed inside a
  // CardBox two-column grid): each section puts its title + guidance on the left
  // and the field(s) on the right. General (Name) and Domain Name are required;
  // DNSSEC and Status are switches (the detailed DNSSEC key values are surfaced in
  // the zone's Main Settings once it exists). Validation runs on submit only —
  // empty required fields reveal the amber `required` state (a prompt, NOT the red
  // `invalid` error). One `submitting` flag locks the whole scope (fieldset
  // :disabled + every control :disabled + Save :loading, the /usability Pattern 1
  // lock); request-level failures surface via toast.
  //
  // ── IMPORT A ZONE FILE — VARIABLES' PATTERN, NOT A SECOND ONE ──
  //
  // Bringing a zone over from another provider is the same task Variables solves for a
  // `.env`, so it is the same affordance, element for element (see
  // ./AddVariableDrawer.vue): an outlined **Import** on the LEFT of the action bar with
  // the "or paste …" hint beside it, a visually-hidden `<input type="file">` it clicks,
  // one shared parser (../lib/zone-file.js, the sibling of ../lib/dotenv.js), and the
  // same two entry points — the picked file, and pasting the file's contents into the
  // field the records are about (Domain Name here, the Key input there).
  //
  // Why the left of the bar and not a section of its own: import is an alternative to
  // FILLING this form, not a step inside it. It sits opposite Save, where Variables put
  // it, so a reader who has met one module's bulk import recognises the other's without
  // looking for it. The parsed records then appear as a section — a file that silently
  // filled two fields would be asking the reader to trust a parse they cannot see.
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

  // The email carried over from the login flow (falls back to a placeholder).
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

  // One flag locks the whole scope while the create request is in flight.
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

  // The endpoint's own constraints on POST /workspace/dns/zones: the name is at most
  // 50 characters, and the domain has to be a real domain — the API states the
  // pattern, so the form states it too instead of waiting for a 400.
  const NAME_MAX = 50
  const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

  // Validation runs on submit only. An empty message means valid; a populated one
  // drives the field's HelperText — amber `required` when the field is simply not
  // filled in yet, red `invalid` when what is in it cannot be accepted.
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

  // ── Bulk input: Import and paste ───────────────────────────────────────────
  // Both run the same parse (../lib/zone-file.js), exactly as the two `.env` paths in
  // ./AddVariableDrawer.vue run the same `parseDotenv`.
  //
  // The records are held here and shown as their own section: they are what the file
  // said, and the reader has to be able to see (and drop) them before Save. A file that
  // only filled Domain Name would be asking them to trust a parse with no evidence.
  const records = ref([])
  const importedFrom = ref('')

  const fileRef = ref(null)

  const openImport = () => fileRef.value?.click()

  /**
   * Fill the form from a parsed zone file. The origin answers BOTH fields — a zone's
   * name is free text and the file's own origin is the best name it will ever have — but
   * only where the reader has not already typed something, because an import is an offer
   * and not a correction.
   */
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
    // Clear the input so picking the same file twice still fires `change`.
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

  // Pasting a zone file into Domain Name reads the whole file instead of dropping it
  // into the field as one long line — the same trade the Key input makes for a `.env`.
  // Nothing parsed → an ordinary domain was pasted; let the browser handle it.
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

  // Where this page goes back to: Edge DNS, or the Creation Center when the reader picked
  // `Zone` out of its rail (../../lib/behavior/create-origin.js).
  const { path: originPath, label: originLabel } = useCreateOrigin('/edge-dns', 'Edge DNS')

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock
    if (!validate()) return // feedback is now on the fields themselves

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      const name = form.name.trim()
      const domain = form.domain.trim()
      const id = String(Math.floor(1000 + Math.random() * 9000))
      // The count is stated because the reader chose it: an import they could see and
      // prune is the one thing on this form whose result they cannot check afterwards
      // (the zone's Records tab is seeded state in this prototype, not a store).
      toast.success(`Zone "${name}" created.`, {
        description: records.value.length
          ? `${records.value.length} imported record${records.value.length === 1 ? '' : 's'} created with the zone.`
          : undefined
      })
      commit() // the create landed — the leave guard stands down
      // Land on the new zone's detail view, carrying its name + domain so the
      // header and Records drawer read them without a round-trip.
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
      submitting.value = false // release on success AND failure
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

    <!-- Only after an import. An empty "Records" band on a form that does not ask for
         records would read as a section that failed to load. -->
    <Section
      v-if="records.length"
      stacked
      :divided="false"
      title="Records"
      :hint="`Read from ${importedFrom} and created with the zone. The SOA and the nameservers are Azion's and are not imported.`"
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

    <!-- DNSSEC and `active` are both optional to the endpoint and both already carry
         its defaults, so they sit behind the disclosure together. -->
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

    <!-- The bulk path, opposite Save — the Variables drawer's footer, element for
         element. The file input is visually hidden and out of the tab order: the
         Button is the control, and a second focus stop on a native file field would
         be a second way to do one thing. -->
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
