<script setup>
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'

  const certificate = [
    '-----BEGIN CERTIFICATE-----',
    'MIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQUFADBaMQswCQYDVQQGEwJJ',
    'RTESMBAGA1UEChMJQmFsdGltb3JlMRMwEQYDVQQLEwpDeWJlclRydXN0MSIwIAYD',
    '-----END CERTIFICATE-----'
  ].join('\n')
</script>

<template>
  <Field class="w-full max-w-(--container-xs)">
    <Field.Label>Certificate</Field.Label>
    <Textarea
      :model-value="certificate"
      :spellcheck="false"
      readonly
    />
    <Field.Description>Issued by Azion. Upload a new certificate to replace it.</Field.Description>
  </Field>
</template>
