## [2.2.1](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.2.0...@aziontech/theme@2.2.1) (2026-06-03)

## [2.2.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.1.1...@aziontech/theme@2.2.0) (2026-06-03)


### Features

* add button highlight ([#622](https://github.com/aziontech/webkit/issues/622)) ([4c2654c](https://github.com/aziontech/webkit/commit/4c2654cce7b31c2b6349d435a871b2d046ab070e))


### Bug Fixes

* adjust card-pricing gap spacing for non-middle cards ([26c051a](https://github.com/aziontech/webkit/commit/26c051a71e2e5a5345c2894fd818627b794c4390))
* empty results block button migration ([#630](https://github.com/aziontech/webkit/issues/630)) ([bb255f4](https://github.com/aziontech/webkit/commit/bb255f4fd798ab524f92c7722e382141b83ce385))
* migration table action buttons ([#621](https://github.com/aziontech/webkit/issues/621)) ([059f99d](https://github.com/aziontech/webkit/commit/059f99dfbfc01ef8698769369f26b461cc6a88d9))
* motion, sizing, scroll, and overlay story docs ([#620](https://github.com/aziontech/webkit/issues/620)) ([7e589ba](https://github.com/aziontech/webkit/commit/7e589ba869ef33d0db7abe13fc4af225f7b85e79))
* table actions IconButton sizes ([#625](https://github.com/aziontech/webkit/issues/625)) ([907b1a6](https://github.com/aziontech/webkit/commit/907b1a6c4d8c4049c7f66b1a7b657fbe9825b78e))
* tag component import ([#626](https://github.com/aziontech/webkit/issues/626)) ([7ae78a5](https://github.com/aziontech/webkit/commit/7ae78a502fa5a7887f32f3b39993b0c93d4f0538))

## [2.1.1](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.1.0...@aziontech/theme@2.1.1) (2026-05-29)


### Bug Fixes

* adding button kind danger ([#617](https://github.com/aziontech/webkit/issues/617)) ([028b200](https://github.com/aziontech/webkit/commit/028b200d6516c22847f952cb985e92fcaedeb76d))
* storybook preview build ([#618](https://github.com/aziontech/webkit/issues/618)) ([108c168](https://github.com/aziontech/webkit/commit/108c168686d3abe741c3037d650271685092e837))

## [2.1.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.0.4...@aziontech/theme@2.1.0) (2026-05-29)


### Features

* align Tag with Figma design system ([#609](https://github.com/aziontech/webkit/issues/609)) ([0fe2acb](https://github.com/aziontech/webkit/commit/0fe2acb09b9abd9f196f8fe95b2146ed587c96e4))
* promote Button/IconButton/SegmentedButton/Avatar to top-level exports ([#611](https://github.com/aziontech/webkit/issues/611)) ([48e5bfc](https://github.com/aziontech/webkit/commit/48e5bfcbec00590b7fafb002ad145d1811ace56f))


### Bug Fixes

* remove duplicated/conflicting size height classes in button ([2668a29](https://github.com/aziontech/webkit/commit/2668a290fc1bb4b9f1d87dfa57af07f992384eac))
* use semantic primary token in overline and card-content ([456b55c](https://github.com/aziontech/webkit/commit/456b55cfe6055f653c48d73811dc3551a8f6e621))

## [2.0.4](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.0.3...@aziontech/theme@2.0.4) (2026-05-27)


### Bug Fixes

* bump ([574dd22](https://github.com/aziontech/webkit/commit/574dd221521ed3f54a0283cd20bed53aeb7f0de3))
* bump webkit ([#598](https://github.com/aziontech/webkit/issues/598)) ([aa77380](https://github.com/aziontech/webkit/commit/aa77380183973b02dee5cd3d9fc8828c578690d0))
* removing href/target props and pt function ([#600](https://github.com/aziontech/webkit/issues/600)) ([b70b6ef](https://github.com/aziontech/webkit/commit/b70b6ef8bc509244cc265ea37abd8e7ceb1aaec2))

## [2.0.3](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.0.2...@aziontech/theme@2.0.3) (2026-05-26)


### Bug Fixes

* adjust readme to bump version ([235c432](https://github.com/aziontech/webkit/commit/235c43204ee721bff4b5250f6ef26130bf1e6967))
* bump version ([8a39df2](https://github.com/aziontech/webkit/commit/8a39df20d73d433512f6b5a2ccc8bef6c16285dc))
* drop [@tailwind](https://github.com/tailwind) base + [@layer](https://github.com/layer) base from v3 globals ([5b2247b](https://github.com/aziontech/webkit/commit/5b2247b37cdc1edcbd59a4061699fc9fea579abf))
* fix label mock ([c0694b7](https://github.com/aziontech/webkit/commit/c0694b72d97c36bdbc79552685eccce83147e334))

## [2.0.2](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.0.1...@aziontech/theme@2.0.2) (2026-05-25)


### Bug Fixes

* fix CI, define version with package.json ([54a3614](https://github.com/aziontech/webkit/commit/54a3614a3ba0a6c0939ff73a40d4a7f925915665))

## [2.0.1](https://github.com/aziontech/webkit/compare/@aziontech/theme@2.0.0...@aziontech/theme@2.0.1) (2026-05-25)


### Bug Fixes

* rename spacing-elements-* tokens to spacing-* ([d28e90e](https://github.com/aziontech/webkit/commit/d28e90e421e0abed24c6e42456dcf4444ded763b))

## [2.0.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.13.0...@aziontech/theme@2.0.0) (2026-05-21)


### ⚠ BREAKING CHANGES

* the semanticColors() plugin export from the previous
structure is gone. Consumers should drop it from tailwind.config plugins —
the same classes are now produced via theme.extend.
* replace Toggle with SegmentedButton

* refactor(theme): migrate semantic colors to native tailwind theme keys ([66505d7](https://github.com/aziontech/webkit/commit/66505d7580d81d4e64f1fb314a94b5addbd7ae65))
* feat(segmented-button)!: replace Toggle with SegmentedButton ([5f63faa](https://github.com/aziontech/webkit/commit/5f63faaa867b0e162a8fc9d769ea61724581d969))


### Features

* add tailwind configuration ([ff236d4](https://github.com/aziontech/webkit/commit/ff236d47d185a437acd2afea5db234807e3e04e0))
* adjust text ([08cda42](https://github.com/aziontech/webkit/commit/08cda42de83989cd6fb0dd4d907de3954e2d9bfc))
* change brand primary color ([51a88f7](https://github.com/aziontech/webkit/commit/51a88f719efbe7f2681912843aee0ddf670a6ca6))
* simplify tag icon api by removing showIcon ([ee1cda9](https://github.com/aziontech/webkit/commit/ee1cda98835c65c25b6418e9033f904eb3c363a7))


### Bug Fixes

* adjust props ([5996d80](https://github.com/aziontech/webkit/commit/5996d80280b476f9de649080a579643c72c5a355))
* adjust props ([4704eb8](https://github.com/aziontech/webkit/commit/4704eb89a21e29b6598127a3e1cb9889c0de99cc))
* adjust stories ([396c245](https://github.com/aziontech/webkit/commit/396c245b9ac014a821cda0d2699f941bbfc6f89c))
* adjust stories ([720b495](https://github.com/aziontech/webkit/commit/720b49564f5ada7e142a8bfe443d51c8e3ba849a))
* adjust tag component icon alignment and spacing ([1e050de](https://github.com/aziontech/webkit/commit/1e050de84b5b533297e9dbc2ca1d0424a3da5e1b))
* adjust tag component icon alignment and spacing ([6d1d355](https://github.com/aziontech/webkit/commit/6d1d355edf9bae96afdf0904342c2c9c2259e8dd))
* checks success skip !== webkit ([#552](https://github.com/aziontech/webkit/issues/552)) ([46290ab](https://github.com/aziontech/webkit/commit/46290ab38d93d532754b0afb6d583fd13bf26a51))
* CI and bump theme ([f29c1f5](https://github.com/aziontech/webkit/commit/f29c1f5d56493934c5098fc0b0b8a2442b0934a5))
* ci pnpm version ([52c035b](https://github.com/aziontech/webkit/commit/52c035bddc7aa8cae9bf821deec30651211eff55))
* corrige popularText e ajustes de tipografia/sufixo em pricing-card e toggle ([#545](https://github.com/aziontech/webkit/issues/545)) ([c5c8b66](https://github.com/aziontech/webkit/commit/c5c8b66d455d62a0502038a0d30d60c4e073609d))
* dep minimatch 9.0.0 added to overriders ([#544](https://github.com/aziontech/webkit/issues/544)) ([d672732](https://github.com/aziontech/webkit/commit/d672732ae945fdce8fcf6c6b6a85878f02532c48))
* remove unused docs ([664ac3e](https://github.com/aziontech/webkit/commit/664ac3e02b2954c0465c7a0afed7e453b71b18f2))
* update suffix for zero price and adjust button visibility ([1f104bb](https://github.com/aziontech/webkit/commit/1f104bb4e32a9265a82a7687dc0df99d72db5729))

## [1.13.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.12.0...@aziontech/theme@1.13.0) (2026-04-30)


### Features

* add comment ([32162bb](https://github.com/aziontech/webkit/commit/32162bba3d96a33e8d4f348e01406701f51078dd))

## [1.12.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.11.0...@aziontech/theme@1.12.0) (2026-04-29)


### Features

* add orientation prop to PricingCard component and update layout for horizontal display ([a9c6618](https://github.com/aziontech/webkit/commit/a9c66188e266ebc885d8d65f79d66a7a9de98059))
* adjust lint ([3cb9c19](https://github.com/aziontech/webkit/commit/3cb9c191dcfc944f87014ba984a1aa91fa84a168))
* enhance PricingCard component with button slot and update layout for better customization ([e5a667f](https://github.com/aziontech/webkit/commit/e5a667fbd7ededa049961e28f76415a449da13c2))


### Bug Fixes

* order ([5293fa7](https://github.com/aziontech/webkit/commit/5293fa7366b500bd765ac984f08feadaac226f77))
* update hover effect and add new semantic color utilities ([76b439e](https://github.com/aziontech/webkit/commit/76b439ee0c28fb870a58443eb998861630408414))

## [1.11.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.10.0...@aziontech/theme@1.11.0) (2026-04-27)


### Features

* update colors value ([2624ffe](https://github.com/aziontech/webkit/commit/2624ffe6a265d82c40e99a9cd26a627371df5927))

## [1.10.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.9.0...@aziontech/theme@1.10.0) (2026-04-27)


### Features

* add BoxGridSelection component with storybook integration and update background tokens ([e98bc8f](https://github.com/aziontech/webkit/commit/e98bc8fcdd14d593b6cc969c6c4e1bacf490a49f))
* adding support to ts, fix the duplicated ts configuration ([f1a2dfa](https://github.com/aziontech/webkit/commit/f1a2dfa60800bdff1099cbba7f92e860390bfeff))
* adding typescript ([d0020e4](https://github.com/aziontech/webkit/commit/d0020e473bec5faff5b28e9ea5cb441b1702ab38))
* lint governance ([d19412c](https://github.com/aziontech/webkit/commit/d19412cf9c71399c2275c977674fbfd007cdfe15))


### Bug Fixes

* array fix ([ab028f3](https://github.com/aziontech/webkit/commit/ab028f35fc5872b2f9c76c0751a6a68163f00592))
* audit packages ([#532](https://github.com/aziontech/webkit/issues/532)) ([52a692b](https://github.com/aziontech/webkit/commit/52a692b141663b82cd6b6a8e65e13f808c7ec6e8))
* correct component name casing and adjust class binding indentation ([73224a9](https://github.com/aziontech/webkit/commit/73224a91933c2f4149796ee73eaecca9f6dabdc4))
* eslint ignoring d.ts ([609bb90](https://github.com/aziontech/webkit/commit/609bb90683421f39466f62fedc7a4fcf29f8a6cd))
* fix prettier toggle ([78d1bc2](https://github.com/aziontech/webkit/commit/78d1bc2d3cb4ff963d514b80038a27c436ce4336))
* lint and stylelint apply configuration ([3b46491](https://github.com/aziontech/webkit/commit/3b46491e80215024ef1580a01be382102f4104a1))
* lint enabling console.warn and console.error ([181b34d](https://github.com/aziontech/webkit/commit/181b34d0dd1e3dcb9873926845148fd4975f3773))
* linted codebase ([06c3f9f](https://github.com/aziontech/webkit/commit/06c3f9f3ffca6a8474bab11c319850e3ff32b3ac))
* pnpm webkit:format ([1db2dd6](https://github.com/aziontech/webkit/commit/1db2dd66cce3c99d7eb8445f6255a486e46b195b))
* rollback .ts --> .js, vue lints adjust ([#529](https://github.com/aziontech/webkit/issues/529)) ([84cf2d1](https://github.com/aziontech/webkit/commit/84cf2d1d3c5dd3fd451822118085701f32b2c2bc))
* stylelint-disable number-max-precision to flag.css ([e1974cf](https://github.com/aziontech/webkit/commit/e1974cf21afcb8a2ab6a06db69789343d32a05d5))

## [1.9.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.8.0...@aziontech/theme@1.9.0) (2026-04-16)


### Features

* add new token to overline-sm ([d9dd3c7](https://github.com/aziontech/webkit/commit/d9dd3c79574c0aec5ba96f889b351b6ec8acc957))
* add PrimeVue abstraction layer documentation ([4e246b1](https://github.com/aziontech/webkit/commit/4e246b1409d761562b17a1109a3fa9441acc89e1))
* add PrimeVue abstraction layer documentation ([bf1b6d0](https://github.com/aziontech/webkit/commit/bf1b6d0f7f47bbb7f258646a6f4427c0dc39a64e))
* add PrimeVue abstraction layer for services and composables (ENG-37137) ([5fb7705](https://github.com/aziontech/webkit/commit/5fb77054ef359aa863a078e813d75b402bff77e9))
* add primevue barrel module and vite config helper ([a53b79a](https://github.com/aziontech/webkit/commit/a53b79a18a000db98abac5fcff585bd181e40149))
* update overline and remove props ([19dfbfc](https://github.com/aziontech/webkit/commit/19dfbfc98b7c4ac27bdf4e1bdcb4570e184fa491))


### Bug Fixes

* add fallback key for skeleton columns ([cc7ec45](https://github.com/aziontech/webkit/commit/cc7ec45c35cc7f12e4ba0627c2de82dd15bed2e0))
* adjust overline to pretty ([178a639](https://github.com/aziontech/webkit/commit/178a63936c689715592b516e0f660e425769c95e))
* buttons copy code, download, save ([3ad74b2](https://github.com/aziontech/webkit/commit/3ad74b2fc50f7af7853d731c3bb0f8457c00d133))
* comment to bump webkit version ([febeeee](https://github.com/aziontech/webkit/commit/febeeeecb61cded796095433259437c943ec0f38))
* embed console storybook url ([f2e6c3d](https://github.com/aziontech/webkit/commit/f2e6c3de1103a7c9d0bbf08e93ced7ab3cb6aa69))
* inlinemessage export, the primevue wrappers should same name ([62d0234](https://github.com/aziontech/webkit/commit/62d02340dc301f1f4e156928f9de09c2e19fedcb))
* plugin transparent bg ([e9ff368](https://github.com/aziontech/webkit/commit/e9ff3686cb438f546104096dd29eee5a9cc36188))
* remove unused css ([d58cceb](https://github.com/aziontech/webkit/commit/d58cceb28273ad90c8c55f71e2c591d8426cd8e1))
* rollback site/button-content ([a2a4dda](https://github.com/aziontech/webkit/commit/a2a4ddadbb7df9ac77b993526c7df29be8da1a61))
* rollback site/button-content ([1399b5e](https://github.com/aziontech/webkit/commit/1399b5e3099eab9a9ef0145fd7544a354592e60b))
* storybook logo azion ([a17cef7](https://github.com/aziontech/webkit/commit/a17cef7a4aa253efafa2dc3c63fddc7a940017e8))
* storybook sidebar console include renderer ([1236946](https://github.com/aziontech/webkit/commit/1236946caae6f8ca2a054fa4de6edfcd4c7543dd))

## [1.8.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.7.0...@aziontech/theme@1.8.0) (2026-04-01)


### Features

* improve overline and imports ([cd5b375](https://github.com/aziontech/webkit/commit/cd5b3752d942bebb56bd57d793ea7b2fdeb91a3a))

## [1.7.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.6.0...@aziontech/theme@1.7.0) (2026-04-01)


### Features

* add new overline variation ([49f7631](https://github.com/aziontech/webkit/commit/49f7631d4839c0c3481a65a38aeeb3f1be66f920))
* add new plugin for animations ([9d03769](https://github.com/aziontech/webkit/commit/9d03769f04f33735af54609b695e46ec5d6f5ff8))
* colors foundation doc first draft ([b2b3bf7](https://github.com/aziontech/webkit/commit/b2b3bf7841f60982ea480ebd1d928624942c7a2f))
* docs typography, icons and more ([85caac0](https://github.com/aziontech/webkit/commit/85caac015c613e7c1decdf192ae1ce6aeaf1c7cc))


### Bug Fixes

* delete unnused component ([79029fc](https://github.com/aziontech/webkit/commit/79029fc9e7d00b771c0c6a1e976ff67e0eebf965))
* general adjusments ([4389c0b](https://github.com/aziontech/webkit/commit/4389c0bfda10c67b42a2737d1d7091e46b384274))
* refinando estilos com a marca ([5dcbe1d](https://github.com/aziontech/webkit/commit/5dcbe1d00b5ac609ba487d028710b114406cb488))
* remove css and style inline to tailwind and components ([4de36a5](https://github.com/aziontech/webkit/commit/4de36a57f097d162fe2aff6527ee203800e295e1))

## [1.6.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.5.0...@aziontech/theme@1.6.0) (2026-03-31)


### Features

* add tokens in overline and changed properties ([54f0b88](https://github.com/aziontech/webkit/commit/54f0b888a81f3c0482611b810e0906a1258af947))


### Bug Fixes

* azion system status color text ([03ae1be](https://github.com/aziontech/webkit/commit/03ae1be158331648bb439f688918ac3adaa62ac3))
* dark light ([0a8539e](https://github.com/aziontech/webkit/commit/0a8539ed2aeeb6ad8ff7178e52eb7ff365c5ac55))
* fix big number token ([9d9ffc4](https://github.com/aziontech/webkit/commit/9d9ffc4508c2a90c61522b9ae8483992c24ea9b5))
* storybook collumn adjust ([fa92b6c](https://github.com/aziontech/webkit/commit/fa92b6c58fcb9c300d2917a18430be1c87aa8523))
* theme colors preview ([15d2e6b](https://github.com/aziontech/webkit/commit/15d2e6bd718f46ed316d6cb0e896cb2ea9f99ee0))

## [1.5.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.4.0...@aziontech/theme@1.5.0) (2026-03-26)


### Features

* add DataTable component with storybook stories ([73f406a](https://github.com/aziontech/webkit/commit/73f406adbe86814e9e0cb2354c5da21e67a6a135))
* add new spacings ([b7fde6d](https://github.com/aziontech/webkit/commit/b7fde6d158964c7e1531ea03d84f96802c088b30))
* button action save/delete/copy ([ff0c602](https://github.com/aziontech/webkit/commit/ff0c60248352c604f0da4eb946e4895a3029612c))


### Bug Fixes

* azion system status unify site/console ([cf160fe](https://github.com/aziontech/webkit/commit/cf160fec755681e81366450e0130100faba8549c))
* button-save update event save to click ([010ed9f](https://github.com/aziontech/webkit/commit/010ed9f0955cf45d2184f82517631a0c91a9aaf8))
* delete and create loading stage ([e70ccd1](https://github.com/aziontech/webkit/commit/e70ccd1dbc32c20589e7d3123eb2f669e7d84b47))
* iconPos and data-testid param ([1fa0a39](https://github.com/aziontech/webkit/commit/1fa0a396a481e4036ed4281ea78dfe7c1872b361))
* remove duplicate CardContent stories from old location ([7802554](https://github.com/aziontech/webkit/commit/7802554efcdd1873781b140f61b9811f5e700483))
* storybook sorting categories components ([d67b887](https://github.com/aziontech/webkit/commit/d67b8879db72f3723c61be335e45ebce2e635daa))

## [1.4.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.3.0...@aziontech/theme@1.4.0) (2026-03-25)


### Features

* add CardBox component to core/card ([9c797ff](https://github.com/aziontech/webkit/commit/9c797ff90dad3f79b59155748d34f37b44e15958))
* add CardContent component to core/card ([403ed84](https://github.com/aziontech/webkit/commit/403ed84a4925cf0eda1ed396a7212495e730ee02))

## [1.3.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.2.0...@aziontech/theme@1.3.0) (2026-03-25)


### Features

* add theme in storybook ([7d2dd17](https://github.com/aziontech/webkit/commit/7d2dd176f74fb6b3e34b37de92dcca0079302f4e))
* add theme tokens to storybook ([a94a353](https://github.com/aziontech/webkit/commit/a94a353f7e4e62164661758d77f7c742a9fba132))
* adjust button ([cde3c11](https://github.com/aziontech/webkit/commit/cde3c112c96004029f672e348df115129d2dac56))
* unify field-password and field-password-strength into a single component ([393d809](https://github.com/aziontech/webkit/commit/393d809c78386410358f8cfbb8e91bfd9b8fb6a7))


### Bug Fixes

* breacrumb ([67aa5d7](https://github.com/aziontech/webkit/commit/67aa5d7bcc43c73bcab2ebb9df145c816c741c65))
* breadcrumb site ([ebe909c](https://github.com/aziontech/webkit/commit/ebe909c8fa0c9c861593c4968d6a7f091eadb3c9))
* dts build ([81c87af](https://github.com/aziontech/webkit/commit/81c87af1f4e14f6451d64c35e084673fe481589e))
* export car-content ([557efb5](https://github.com/aziontech/webkit/commit/557efb55aa1bd880d160baa53e458571b8894f20))
* prevent theme or icons trigger webkit publish and vice versa ([d1bed9c](https://github.com/aziontech/webkit/commit/d1bed9c248671c4fda1dd82fc98059f0937fe3d9))
* primevue breadcrumb wrapper ([815d1e4](https://github.com/aziontech/webkit/commit/815d1e4ce4e86eaed08c2b418266e9b3b6967be7))
* remove the ts of buttom ask azion and trigger storybook ([62f47ba](https://github.com/aziontech/webkit/commit/62f47ba094529a59db685ae0f22c77a4f7cad374))
* storybook the breadcrumb ([09c3323](https://github.com/aziontech/webkit/commit/09c3323ef815da1d4d6b74ba8fd88c7ab34f5451))
* trigger webkit and theme ([48a99fc](https://github.com/aziontech/webkit/commit/48a99fc44121e890ecc5a2bc8b6502055fb037d0))

## [1.2.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.1.1...@aziontech/theme@1.2.0) (2026-03-23)


### Features

* add copy-block component migrated from console ([0dbcea5](https://github.com/aziontech/webkit/commit/0dbcea5f5c6ab37bffeb22a2e26d16bb4af68d50))
* add testimonials-carousel component and fix storybook setup ([dfb885f](https://github.com/aziontech/webkit/commit/dfb885f107cee3dde0a8244fbe4d14182e249d02))
* adding azion used primevue components ([afe100a](https://github.com/aziontech/webkit/commit/afe100aa0e8af190188761ec38bd704b93bc5e30))


### Bug Fixes

* adding sprite country used by flag.css ([39d8464](https://github.com/aziontech/webkit/commit/39d84647d4606ba3ffde846aaa9b4fda61998ea8))
* badge wrap flex with storybook azion style class ([f94aa49](https://github.com/aziontech/webkit/commit/f94aa49a37d47c195b651b9174111ae9a13a1121))
* pnpm-lock.yaml ([d8094ea](https://github.com/aziontech/webkit/commit/d8094eaccb572a8b8d4da180587aa35db63230d7))
* Potential fix for code scanning alert no. 15: Double escaping or unescaping ([7a7346a](https://github.com/aziontech/webkit/commit/7a7346aeeb23398a38f60e2046ae8215622fc360))
* remove unsused files ([12baaac](https://github.com/aziontech/webkit/commit/12baaac9018cfa0cdb1f361a55f85aeed872cd11))
* restore field-text-password export, remove non-existent field-password entries ([a423582](https://github.com/aziontech/webkit/commit/a4235823a32c382392c788d00bb4a68495337780))
* restore isCopyVisible prop for backwards compatibility with console ([5b6594c](https://github.com/aziontech/webkit/commit/5b6594c09b479049492482f8e873479daf45378d))
* reusable country-flag css and image sprite ([7a98395](https://github.com/aziontech/webkit/commit/7a983955d92526e7ea42e32b14d21a0d313eb7d3))
* storybook azion theme ([e7e76ef](https://github.com/aziontech/webkit/commit/e7e76efec8b79a3eb996d103bbf8899d4f3a808d))
* storybook svgs 404/403 ([13c6399](https://github.com/aziontech/webkit/commit/13c639942e22acf7f8ce0fcfd5eaa79f7d6df6c6))
* storybook svgs 404/403 ([e3da2f3](https://github.com/aziontech/webkit/commit/e3da2f3c0040d206094dea6043e86afc5e06cd78))
* trigger build with updated frozen file ([7006895](https://github.com/aziontech/webkit/commit/7006895936d305ac176123cc3965e1d4f4f061c7))

## [1.1.1](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.1.0...@aziontech/theme@1.1.1) (2026-03-18)


### Bug Fixes

* import default ([68197b9](https://github.com/aziontech/webkit/commit/68197b9aee734c6dfae10385e4214c01d06e14be))

## [1.1.0](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.0.4...@aziontech/theme@1.1.0) (2026-03-18)


### Features

* storybook github actions azion deploy ([328e0a9](https://github.com/aziontech/webkit/commit/328e0a9eb94887e15f04f8da47ff8f6ae0fff2f1))


### Bug Fixes

* color variable on tailwind ([611d352](https://github.com/aziontech/webkit/commit/611d35238e270a0662e369d85e9f259cf0f1931c))
* css remove char ([91cda15](https://github.com/aziontech/webkit/commit/91cda1592cf9e427b59a33e3b19ef100b8dea92b))
* improve storybook performance dev server ([dac62a9](https://github.com/aziontech/webkit/commit/dac62a91df1baf4521029d5e0b576d6433432d65))
* prevent loop during npm publishing process ([8a90666](https://github.com/aziontech/webkit/commit/8a906662f9b769d273d11fe89c82cb6c17849ef9))
* remove resolution and storybook ([f19b4f6](https://github.com/aziontech/webkit/commit/f19b4f6e3c07ca8994c1e9dde4bf6013f23216d7))
* resolve storybook preview.js dynamic import failure ([f2f1d28](https://github.com/aziontech/webkit/commit/f2f1d2895b1a7f9c03b331154eae8ba8e478d264))
* rollback exports ([58469be](https://github.com/aziontech/webkit/commit/58469be8614ac7b8814376cbf833727ff733eed5))
* storybook Build workspace packages ([a6c6264](https://github.com/aziontech/webkit/commit/a6c6264cacfa9c960526fdb7f990b9e59e68058a))
* storybook github actions 404 icons ([69ac399](https://github.com/aziontech/webkit/commit/69ac399e84faa780a4b58183353d2e8fe31cf168))
* theme semantic tokens fix ([2a19e9e](https://github.com/aziontech/webkit/commit/2a19e9e8b8405380a3be505d9cd5372f2ad9b63c))
* tmp and .tpm added to gitignore ([644902a](https://github.com/aziontech/webkit/commit/644902a0a881b73a41a78be9c34761aff804b85a))

## [1.0.4](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.0.3...@aziontech/theme@1.0.4) (2026-03-17)


### Bug Fixes

* theme exporting, packagejson["files"] updated ([3fc7359](https://github.com/aziontech/webkit/commit/3fc7359a43a2085e519bef167cc4f24f4b7d61fa))

## [1.0.3](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.0.2...@aziontech/theme@1.0.3) (2026-03-17)


### Bug Fixes

* @aziontech/theme export ([e2a9170](https://github.com/aziontech/webkit/commit/e2a9170c7c6834a0e5474e005230de197db3dcdc))
* update documentation to trigger deploy ([6fb4680](https://github.com/aziontech/webkit/commit/6fb46804be7c176547f4f95fa2d745bad945a9dc))

## [1.0.2](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.0.1...@aziontech/theme@1.0.2) (2026-03-17)


### Bug Fixes

* remove dist from npm script of from theme repo ([9dd3205](https://github.com/aziontech/webkit/commit/9dd3205a8a2531ef4879271ea68d0b6664776b70))
* remove npm publish from theme package.json ([640ce7f](https://github.com/aziontech/webkit/commit/640ce7f4fc59b9c22c93f0df20c81a1b44a1d0a5))

## [1.0.1](https://github.com/aziontech/webkit/compare/@aziontech/theme@1.0.0...@aziontech/theme@1.0.1) (2026-03-17)


### Bug Fixes

* adding documentation theme ([bec0490](https://github.com/aziontech/webkit/commit/bec04901f809ac385503ce2f0eb3b1c15e583293))
* prevent GitHub Actions loop in theme package publish workflow ([5bdc561](https://github.com/aziontech/webkit/commit/5bdc561ee9067301b9252299c8a0f221b14c6c77))
* prevent GitHub Actions loop in webkit package publish workflow ([cd3db78](https://github.com/aziontech/webkit/commit/cd3db78a2f328eedf24078fb6219e4cce158f8be))

## 1.0.0 (2026-03-17)


### Features

* @aziontech/webkit adding form inputs ([5b5eaf4](https://github.com/aziontech/webkit/commit/5b5eaf4aadb9e9f0695083b0a43295bc5e3f6c38))
* add theme ([2b41a6d](https://github.com/aziontech/webkit/commit/2b41a6d9a00886ac77434cd271e44d83d0cdacff))
* adding | core -> form -> field text privacy ([eaf5927](https://github.com/aziontech/webkit/commit/eaf59270ad78723388053c6cd24990bced57d8f7))
* adding app/icons-gallery ([4ebf60f](https://github.com/aziontech/webkit/commit/4ebf60f5185694a17b920d350483f2a27d41c198))
* adding button azion system status ([a2cd287](https://github.com/aziontech/webkit/commit/a2cd287eea8c8a695d3e1b744b0ba729e082d2c7))
* adjust workflow ([cb67f25](https://github.com/aziontech/webkit/commit/cb67f252db65092325f881c0c800f60d7c125514))
* exporting all the form fields ([7316086](https://github.com/aziontech/webkit/commit/731608696ac0b179abbe61fa13097f386b815e5a))
* icons gallery cicd deploy to azion ([d5b538e](https://github.com/aziontech/webkit/commit/d5b538e597bff54fe587adb9f7e63408c31f97f3))
* icons gallery deploy to azion ([fe60b25](https://github.com/aziontech/webkit/commit/fe60b25fa0273376ee71ec922826c793a35553ac))
* migrating azion-theme to @aziontech/theme ([bf89e8d](https://github.com/aziontech/webkit/commit/bf89e8db5decf18e5b0e4bec5b7b918970532a8a))
* storybook azion deploy ([6b2af1d](https://github.com/aziontech/webkit/commit/6b2af1dc0f7a912458a12d1cb870b370a56c3279))


### Bug Fixes

* .releaserc of @aziontech/theme ([d71b3e3](https://github.com/aziontech/webkit/commit/d71b3e3846de4fe26c23641596f84ee22f991a9e))
* @aziontech/icons development mode export ([bbb28fb](https://github.com/aziontech/webkit/commit/bbb28fb8d98c4027427113b072c46b8c6ebd1d01))
* @aziontech/icons step 7 documentation ([1e623c0](https://github.com/aziontech/webkit/commit/1e623c0cacf66b830e5a6e021aed20caae08ca51))
* 9/10 vulnerabilities fixed ([ca4e9a6](https://github.com/aziontech/webkit/commit/ca4e9a6296a36d956f762cc675756e8e050d4768))
* add docs, trigger publish to use semantic release ([f24ca8f](https://github.com/aziontech/webkit/commit/f24ca8f6c459d201fb2d6bfd53bcedfe1b1abc3b))
* adding InputSlot to field-dropdown-lazy-loader-with-filter.vue ([4a4060b](https://github.com/aziontech/webkit/commit/4a4060b93908b3530299ba4e66e4c3aa911c039a))
* ai-ask-azion added ([8e4343f](https://github.com/aziontech/webkit/commit/8e4343fc86fd2e55c9f0a63f0fc565b9836c4caf))
* catalog.json generated to be consumed by icons-gallery ([6ee87fa](https://github.com/aziontech/webkit/commit/6ee87fa08fbb8c1aa06b4b977d69c05e265bbe5a))
* code review ([c2fb899](https://github.com/aziontech/webkit/commit/c2fb89959c50b3a2e1e80346d47714e2730d44fc))
* format code, icons-gallery using exported @aziontech/icons/catalog.json ([431ef0f](https://github.com/aziontech/webkit/commit/431ef0f25ae13be3d24d6510a76b29baf1b3b49b))
* icons gallery cicd building @aziontech/icons ([17c9903](https://github.com/aziontech/webkit/commit/17c990308afa73fb8c04a10b428423bf3a76a9fb))
* input space between label, input and descriptions ([594b601](https://github.com/aziontech/webkit/commit/594b601f2c0d7b0eebd30455f20e8db58ebdad97))
* input space between label, input and descriptions ([45c58a9](https://github.com/aziontech/webkit/commit/45c58a9d58de20cf4c9ee8c5a0352f419af48038))
* packages/icons/.releaserc ([27b477b](https://github.com/aziontech/webkit/commit/27b477bf982d4fbf614edd977cb178c1513a6bfc))
* publish trigger to npm publish ([fc2ae3c](https://github.com/aziontech/webkit/commit/fc2ae3cf3793a92e2045bdd80a4b5e2f1c94543e))
* remove npm token, using only iodc to test ([1fccb01](https://github.com/aziontech/webkit/commit/1fccb01c3363e37d116deedeb59ccfc714b60c04))
* review exatly props .vue files to stories ([21ba95f](https://github.com/aziontech/webkit/commit/21ba95ff379831afb7db1e0c09952fc48ca80e54))
* rollback of ai-ask-azion icon deletion ([cf7b46e](https://github.com/aziontech/webkit/commit/cf7b46e5c15c67d50d18d00821b41990fb075baa))
* semanctic release prepareCmd adjust cmd ([d42161f](https://github.com/aziontech/webkit/commit/d42161f717d1b8a2d78b790737a7fe27f31922a8))
* sync with new dev azionconsole fix ([63c6d8e](https://github.com/aziontech/webkit/commit/63c6d8e228fd5b0c7c84fecc4a8a53e92dc1c49d))
* trigger build ([7d50ce5](https://github.com/aziontech/webkit/commit/7d50ce5ee49fce84075fbf3f075410d5da5017bc))
* trigger cicd @aziontech/icons ([08b20a5](https://github.com/aziontech/webkit/commit/08b20a55acf26da5f0a5731019ef6ed8277e6a31))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- [ ] Add support for custom theme configurations
- [ ] Include accessibility tokens (aria-labels, focus states)
- [ ] Generate TypeScript type definitions for theme tokens
- [ ] Add theme customization helpers

---

## [0.0.1]

### Added

- Initial package release
- Primitive color tokens (orange, violet, neutral, and other complete color palettes)
- Brand color tokens (black, white, gray scales)
- Semantic text tokens (light/dark variants)
- Semantic background tokens (layer1, layer2, canvas, base)
- Semantic border tokens (light/dark variants)
- Tailwind CSS plugin for token integration
- CSS variable initialization for theming
- Build script for token compilation
- Production-ready distribution structure

### Dependencies

- @tailwindcss/typography (^0.5.0)
- prettier (^2.8.0)
