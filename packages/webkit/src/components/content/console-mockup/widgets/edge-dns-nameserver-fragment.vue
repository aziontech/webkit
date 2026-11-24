<script setup lang="ts">
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import FieldDescription from '../../../input/field/field-description/field-description.vue'
  import Input from '../../../input/input/input.vue'
  import InputGroupRoot from '../../../input/input-group/input-group.vue'
  import Item from '../../item/index'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupFragment from '../parts/mockup-fragment.vue'

  defineOptions({ name: 'EdgeDnsNameserverFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; this fragment holds still either way. */
    hovered?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const NAMESERVERS = ['ns1.aziondns.net', 'ns2.aziondns.com', 'ns3.aziondns.org']
</script>

<template>
  <MockupFragment
    class="[--console-mockup-fade-start:78%]"
    :active="active"
  >
    <div class="flex flex-col gap-(--spacing-lg) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <Item
          variant="inline"
          size="small"
          class="flex-col items-stretch gap-(--spacing-sm)"
        >
          <Item.Content>
            <Item.Title>Domain Name</Item.Title>
            <Item.Description>
              Provide the domain name you want to host. Example: example.com.
            </Item.Description>
          </Item.Content>
          <Item.Actions class="w-full justify-start">
            <Input
              model-value="example.com"
              size="medium"
              class="w-full"
              aria-label="Domain Name"
            />
          </Item.Actions>
        </Item>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <Item
          variant="inline"
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
                <Input
                  :model-value="nameserver"
                  size="medium"
                  class="flex-1 font-code"
                  :aria-label="`Nameserver ${index + 1}`"
                  readonly
                />
                <CopyButton
                  variant="ghost"
                  :value="nameserver"
                  :aria-label="`Copy nameserver ${index + 1}`"
                  size="small"
                />
              </InputGroupRoot>
              <FieldDescription>Add the nameservers in your domain provider.</FieldDescription>
            </div>
          </Item.Actions>
        </Item>
      </ConsoleMockupShellItem>
    </div>
  </MockupFragment>
</template>
