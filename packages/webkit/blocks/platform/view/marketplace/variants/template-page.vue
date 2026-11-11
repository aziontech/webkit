<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'

  const template = {
    title: 'Nuxt Storefront',
    framework: 'Nuxt',
    publisher: 'Example',
    updated: 'Oct 21, 2026',
    description:
      'A storefront with a product list, a product page and a cart, rendered on the edge and cached per page.'
  }

  const form = reactive({ name: 'nuxt-storefront', repository: 'acme/nuxt-storefront' })
  const submitted = ref(false)
  const deploying = ref(false)
  const formEl = ref(null)
  const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
  const REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/
  const errors = computed(() => {
    if (!submitted.value) return {}
    const out = {}
    if (!form.name.trim()) out.name = 'Enter a name for the application.'
    else if (!SLUG.test(form.name.trim()))
      out.name = 'Use lowercase letters, numbers and single hyphens.'
    if (!REPO.test(form.repository.trim()))
      out.repository = 'Enter the repository as owner/name, like acme/nuxt-storefront.'
    return out
  })

  const RUN_TOAST = 'template-deploy'
  let timer
  const focusForm = () => {
    toast.dismiss(RUN_TOAST)
    nextTick(() => formEl.value?.querySelector('input')?.focus())
  }
  const deploy = () => {
    submitted.value = true
    if (deploying.value) return
    if (Object.keys(errors.value).length) {
      nextTick(() => formEl.value?.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    deploying.value = true
    const name = form.name.trim()
    toast.loading(`Deploying ${name}…`, {
      id: RUN_TOAST,
      description: 'It keeps running if you leave this page.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      deploying.value = false
      toast.success(`${name} is live.`, {
        id: RUN_TOAST,
        description: `Built from ${template.title} and pushed to ${form.repository.trim()}.`,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: focusForm },
          { label: 'Redeploy', onClick: deploy }
        ]
      })
    }, 2400)
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <nav
        aria-label="Breadcrumb"
        class="pt-(--layout-group-gap)"
      >
        <Link
          href="/marketplace?tab=templates"
          label="Back to Templates"
          size="medium"
          :show-icon="false"
        />
      </nav>
      <PageHeader
        :title="template.title"
        :description="template.description"
      />

      <div
        class="layout-section-start grid min-w-0 grid-cols-1 gap-(--layout-section-gap) pb-(--layout-boundary-end) lg:grid-cols-[minmax(0,1fr)_var(--container-2xs)]"
      >
        <form
          ref="formEl"
          class="flex min-w-0 flex-col"
          novalidate
          aria-label="Deploy template"
          @submit.prevent="deploy"
        >
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="deploying"
          >
            <legend class="sr-only">Deploy {{ template.title }}</legend>
            <SettingsSection
              title="Application"
              hint="The application this template creates."
            >
              <Field
                required
                :invalid="Boolean(errors.name)"
              >
                <Field.Label>Name</Field.Label>
                <Input
                  v-model="form.name"
                  size="large"
                  autocomplete="off"
                />
                <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
                <Field.Description v-else
                  >Also the subdomain of its generated address.</Field.Description
                >
              </Field>
            </SettingsSection>
            <SettingsSection
              title="Repository"
              hint="Where the template's code is copied, so you can change it and redeploy."
            >
              <Field
                required
                :invalid="Boolean(errors.repository)"
              >
                <Field.Label>Repository</Field.Label>
                <Input
                  v-model="form.repository"
                  size="large"
                  autocomplete="off"
                />
                <Field.Error v-if="errors.repository">{{ errors.repository }}</Field.Error>
              </Field>
            </SettingsSection>
          </fieldset>
          <div class="flex justify-end pt-(--layout-group-gap)">
            <Button
              type="submit"
              label="Deploy"
              icon="pi pi-cloud-upload"
              kind="primary"
              size="large"
              :loading="deploying"
            />
          </div>
        </form>

        <aside
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          aria-label="About this template"
        >
          <Card>
            <template #content>
              <DocProse>
                <p>
                  Product pages are cached for a minute and the cart is never cached. Replace the
                  sample catalog with your own API in <code>server/api/products.ts</code>.
                </p>
              </DocProse>
            </template>
          </Card>
          <KeyValuePairs aria-label="Template details">
            <KeyValuePairs.Item label="Framework">{{ template.framework }}</KeyValuePairs.Item>
            <KeyValuePairs.Item label="Publisher"
              ><bdi>{{ template.publisher }}</bdi></KeyValuePairs.Item
            >
            <KeyValuePairs.Item label="Updated">{{ template.updated }}</KeyValuePairs.Item>
          </KeyValuePairs>
        </aside>
      </div>
    </main>

    <Toaster position="bottom-right" />
  </div>
</template>
