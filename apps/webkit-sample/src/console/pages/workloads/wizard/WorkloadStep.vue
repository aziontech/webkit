<script setup>
  // PART 1 — THE NAME, WHICH IS THE ADDRESS.
  //
  // One field, and it does two jobs: it names the workload in every list, and it PRODUCES
  // the domain the workload answers on (`<name>.map.azionedge.net`). Those are not two
  // decisions, so this part does not ask twice — but it does have to SHOW the second one,
  // because a reader typing a name has no way to know it is choosing a hostname.
  //
  // So the domain is rendered live, under the field, as the reader types. Not as helper
  // prose describing the rule ("your domain will be name.map.azionedge.net") — as the
  // actual value, because the thing a reader checks is the string they will paste into a
  // browser, and prose about a pattern makes them derive it themselves.
  //
  // It is READ-ONLY here. `allowAzionDomain` (in Advanced on the release part) is what
  // decides whether this domain is served at all, and a custom domain is added to the
  // workload after it exists — neither is a field this part can usefully offer.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import { computed } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import { domainForWorkload } from '../../../lib/data/workload-provisioning'
  import { useWorkloadForm } from './form-context'

  defineProps({
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const { form, errors } = useWorkloadForm()

  // The same derivation the provisioning logs narrate, so the domain the reader reads here
  // and the domain the run reports are one function, not two that agree today.
  const domain = computed(() => domainForWorkload(form.name))
</script>

<template>
  <CardBox title="Name the workload">
    <template #content>
      <div class="flex flex-col gap-(--spacing-lg)">
        <FieldStack
          label="Name"
          required
          hint="Identifies the workload in every list, and produces the domain it answers on."
          description="Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen when the domain is built."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="my-workload"
              autocomplete="off"
              :disabled="disabled"
              :required="!!errors.name"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>

        <!-- THE DOMAIN THE NAME PRODUCED. A read-only consequence, not a field — so it is
             framed as a value the reader can copy their eyes over, with the protocol shown
             so it reads as the address it is rather than as a hostname fragment. -->
        <div
          class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) pt-(--spacing-lg)"
        >
          <p class="text-label-sm text-(--text-default)">Domain</p>
          <div
            :data-empty="!domain || null"
            class="flex min-h-10 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) data-[empty]:border-dashed"
          >
            <i
              class="pi pi-globe shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span
              v-if="domain"
              class="min-w-0 truncate text-label-sm text-(--text-default)"
            >
              https://{{ domain }}
            </span>
            <span
              v-else
              class="text-label-sm text-(--text-muted)"
            >
              Name the workload to see its domain.
            </span>
          </div>
          <p class="text-label-sm text-(--text-muted)">
            Provisioned with the workload. Add your own domain to it once it exists.
          </p>
        </div>
      </div>
    </template>
  </CardBox>
</template>
