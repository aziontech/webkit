<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import FaqSection from '@aziontech/webkit/faq-section'

  const items = [
    {
      question: 'What is GDPR?',
      answer:
        "The General Data Protection Regulation (GDPR) is a data privacy law implemented by the European Union. It went into effect on May 25, 2018, and is considered one of the world's leading data privacy legislations.\n\nThe goal of GDPR is to honor the privacy of persons residing in the EU, by protecting their:\n\n- Right to be informed\n- Right of access\n- Right to rectification\n- Right to erasure\n- Right to restriction of processing\n- Right to data portability\n- Right to object\n- Right to avoid automated decision-making"
    },
    {
      question: 'Why is GDPR necessary?',
      answer:
        "A majority of the businesses using Azion either reside in the EU or have customers there. We are honoring our responsibility to comply with the rights of the recipients living in the EU.\n\nGDPR compliance is not only an obligation for Azion, but also for many of the businesses using Azion. Azion's compliance allows even more businesses to build their operations on top of Azion's infrastructure without compromises to privacy or compliance."
    },
    {
      question: 'Who audited Azion?',
      answer:
        'Unlike SOC 2 or ISO 27001, GDPR is not a best practice standard but rather a law. Because of this, most companies self-audit to align their operations and technology with the GDPR controls. Azion followed this approach.\n\nAzion also uses [Vanta](https://vanta.com) to monitor all GDPR controls and organize evidence for compliance.'
    },
    {
      question: 'How do I get a signed DPA?',
      answer:
        'A GDPR Article 28 Data Processing Addendum is in force for every Azion account. It is pre-signed by Azion and fully executed once you sign up, so there is no separate counter-signature step.\n\nYou can download the signed copy from the Documents page (login required). The unsigned reference version is our public DPA.'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <FaqSection
      anchor="faq"
      title="Frequently asked questions"
      :items="items"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
