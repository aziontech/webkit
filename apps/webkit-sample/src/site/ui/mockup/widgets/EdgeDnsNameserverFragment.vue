<script setup lang="ts">
  import CopyButton from '@aziontech/webkit/copy-button'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'EdgeDnsNameserverFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; this fragment holds still either way. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const NAMESERVERS = ['ns1.aziondns.net', 'ns2.aziondns.com', 'ns3.aziondns.org']
</script>

<template>
  <ShellMockup
    kind="bare"
    fade="bottom"
    class="[--mockup-fade-start:78%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
      <MockupPart :order="0">
        <Item
          kind="inline"
          size="small"
          class="flex-col items-stretch gap-(--spacing-sm)"
        >
          <Item.Content>
            <Item.Title>Domain Name</Item.Title>
            <Item.Description>
              Provide the domain name you want to host. Example: mydomain.com.
            </Item.Description>
          </Item.Content>
          <Item.Actions class="w-full justify-start">
            <InputText
              model-value="edgeflow.com"
              size="medium"
              class="w-full"
              aria-label="Domain Name"
            />
          </Item.Actions>
        </Item>
      </MockupPart>

      <MockupPart :order="1">
        <Item
          kind="inline"
          size="small"
          class="flex-col items-stretch gap-(--spacing-sm)"
        >
          <Item.Content>
            <Item.Title>Nameservers</Item.Title>
            <Item.Description>
              Set Azion Edge DNS as the authoritative DNS server for a domain by copying the
              nameservers values.
            </Item.Description>
          </Item.Content>
          <Item.Actions class="w-full justify-start">
            <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
              <InputGroupRoot
                v-for="(nameserver, index) in NAMESERVERS"
                :key="nameserver"
              >
                <InputText
                  :model-value="nameserver"
                  size="medium"
                  class="flex-1 font-code"
                  :aria-label="`Nameserver ${index + 1}`"
                  readonly
                />
                <CopyButton
                  kind="transparent"
                  :value="nameserver"
                  :aria-label="`Copy nameserver ${index + 1}`"
                />
              </InputGroupRoot>
              <HelperText label="Add the nameservers in your domain provider." />
            </div>
          </Item.Actions>
        </Item>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
