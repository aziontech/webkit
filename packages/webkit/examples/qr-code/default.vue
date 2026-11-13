<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import QrCode from '@aziontech/webkit/qr-code'

  const account = 'jane.doe@example.com'
  const secret = 'JBSWY3DPEHPK3PXP'
  const uri = `otpauth://totp/Azion:${encodeURIComponent(account)}?secret=${secret}&issuer=Azion`
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <QrCode
      :value="uri"
      :label="`QR code to add ${account} to an authenticator app`"
    />
    <div class="flex flex-col gap-(--spacing-xxs)">
      <p class="text-label-sm text-(--text-default)">Can't scan the code?</p>
      <div class="flex items-center gap-(--spacing-xs)">
        <code
          class="text-label-code text-(--text-default)"
          dir="ltr"
          >{{ secret.match(/.{1,4}/g).join(' ') }}</code
        >
        <CopyButton
          :value="secret"
          aria-label="Copy setup key"
          copied-label="Setup key copied"
        />
      </div>
    </div>
  </div>
</template>
