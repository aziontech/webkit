import Brand from '@aziontech/webkit/brand'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import FieldPassword from '@aziontech/webkit/field-password'
import FieldText from '@aziontech/webkit/field-text'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { indent } from '../../_shared/markup'

export const SHELL_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'"
]

export const components = {
  Brand,
  Button,
  CardBox,
  Divider,
  FieldPassword,
  FieldText,
  GlobalHeader,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  IconButton,
  Tag,
  Tooltip
}

export const authColumn = (
  body
) => `<div class="flex h-dvh flex-col overflow-hidden bg-(--bg-canvas)">
  <GlobalHeader aria-label="Azion Console" class="shrink-0">
    <GlobalHeader.Brand>
      <a
        href="/site/home"
        aria-label="Azion home"
        class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <Button label="Documentation" kind="outlined" size="medium" icon="pi pi-book" href="/site/docs" />
    </GlobalHeader.Right>
  </GlobalHeader>

  <main class="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
    <div class="layout-column-site flex flex-1 flex-col lg:min-h-0">
      <div class="flex flex-1 flex-col py-(--spacing-xl) lg:min-h-0 lg:overflow-y-auto">
        <div class="m-auto flex w-full flex-col items-center gap-(--spacing-md)">
${indent(body, 5)}
        </div>
      </div>
    </div>
  </main>
</div>`

export const signupFlow = (body) =>
  authColumn(`<div class="flex w-full flex-col items-center">
${indent(body)}
</div>`)

const TERMS_COPY = `By continuing, I agree to Azion's
<a
  class="text-link"
  href="https://www.azion.com/en/documentation/agreements/customer-agreement/"
  target="_blank"
  rel="noopener noreferrer"
>terms of service</a>
and
<a
  class="text-link"
  href="https://www.azion.com/en/documentation/agreements/privacy-policy/"
  target="_blank"
  rel="noopener noreferrer"
>privacy policy</a>.`

export const footer = (prompt, action, href, termsCondition = '') => `<div
  class="flex w-full max-w-(--container-sm) flex-col items-center gap-(--spacing-sm)"
>
  <div class="flex items-center justify-center gap-(--spacing-xs)">
    <p class="text-body-xs text-(--text-default)">${prompt}</p>
    <a class="text-link text-body-xs" href="${href}">${action}</a>
  </div>

  <p${termsCondition ? `\n    v-if="${termsCondition}"` : ''}
    class="text-center text-body-xs text-(--text-muted)${termsCondition ? ' motion-reduce:transition-none' : ''}"
  >
${indent(TERMS_COPY, 2)}
  </p>
</div>`

export const providerButtons = (wrapperClass) => `<div class="${wrapperClass}">
  <Button
    type="button"
    label="Continue with Google"
    kind="outlined"
    size="large"
    icon="ai-cor ai-google"
    class="w-full"
  />
  <Button
    type="button"
    label="Continue with GitHub"
    kind="outlined"
    size="large"
    icon="pi pi-github"
    class="w-full"
  />
</div>`
