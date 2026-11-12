# Qr Code

> A QR code drawn as SVG from a string, with no image request and no dependency: WebKit's own encoder (byte mode, UTF-8, versions 1–40, error correction L/M/Q/H) turns the value into modules, and the component draws them as one path. It is for setup flows that hand a URI to a phone, first the `otpauth://` URI of an authenticator app in `auth#MfaSetup`, where it replaces the image the API returned and the framed placeholder of the demo. The code is always dark on a light plate (the plate pins the light theme), because several authenticator scanners do not read an inverted code.

- Import: `import QrCode from '@aziontech/webkit/qr-code'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [qr-code.json](https://github.com/aziontech/webkit/blob/main/.specs/qr-code.json)

## When to use

- A phone has to pick up a value the screen shows: an authenticator `otpauth://` URI, a pairing link, a short download URL.
- Next to a typed alternative: the same value (or its secret) as text with a `CopyButton`, for people who cannot scan.

## Do

- Always give the code a typed alternative next to it: the setup key or the link as text.
- Name the code after what it does (`QR code to add ana@example.com to an authenticator app`), not `QR code`.
- Keep the default `M` error correction; raise it only when the code is printed or shown small.

## Don’t

- The value is only for reading or copying on the same device → show it as text with `CopyButton`.
- A brand or partner logo → use `Brand` or the partner's asset.
- A long payload (over a few hundred characters) → link to it; a dense code is hard to scan from a screen.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [copy-button](copy-button.md) — the typed alternative beside the code.
- [otp-input](otp-input.md) — the 6-digit code the app shows after the scan.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `—` | true | The text the code carries (a URI, a key), encoded as UTF-8 bytes. |
| `label` | `string` | `undefined` | false | Accessible name of the image. Empty uses the catalog's `QR code`; name it after what the scan does. |
| `errorCorrection` | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'` | false | Error-correction level: `L` 7 %, `M` 15 %, `Q` 25 %, `H` 30 % of the code can be lost and still read. Higher levels make denser codes. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Rendered width: `small` 128 px, `medium` 160 px, `large` 224 px, quiet zone included. |

## States

- `data-size`: `small` | `medium` | `large`.
- `data-version` on the root: the QR version the encoder picked (1–40); `data-modules`: the module count per side.
- An empty value draws no code: the plate keeps its size and `data-version` is absent. A value too long for version 40 at the chosen level draws no code either and logs one warning.

## Accessibility

- The root is `role="img"` named by `label` (catalog `QR code` when empty); the SVG inside is `aria-hidden` and not focusable; the code takes no focus.
- The code is never the only way: the page puts the value or its secret beside it as text.
- Contrast: dark modules on a light plate in both themes (the plate sets `data-theme="light"`); `forced-color-adjust: none` keeps the code dark on light in forced colors, so a scanner still reads it.

## Right-to-left

- Layout: the code is never mirrored (`dir="ltr"` on the SVG); the plate is symmetric.
- Icons: none.
- Keyboard: none.
- User data: the value is not shown as text by the component.

## Internationalization

| Key            | English source | Override prop |
| -------------- | -------------- | ------------- |
| `qrCode.label` | `QR code`      | `label`       |

- The value is encoded as UTF-8 bytes, so non-Latin text works; most authenticator URIs are ASCII.

## Responsive

- Container queries: none.
- Narrow: fixed size; `shrink-0`; `max-w-full` so it never overflows a 320 px column.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import QrCode from '@aziontech/webkit/qr-code'

  const account = 'ana.silva@example.com'
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
```

### Sizes

```vue
<script setup>
  import QrCode from '@aziontech/webkit/qr-code'
</script>

<template>
  <div class="flex flex-wrap items-end gap-(--spacing-lg)">
    <QrCode
      v-for="size in ['small', 'medium', 'large']"
      :key="size"
      value="https://www.azion.com/en/documentation/"
      :size="size"
      :label="`QR code, ${size}, to the Azion documentation`"
    />
  </div>
</template>
```
