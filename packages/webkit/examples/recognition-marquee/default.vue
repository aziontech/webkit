<script setup>
  import forresterExtendedColor from '@aziontech/webkit/assets/forrester-extended-color.svg'
  import forresterExtendedReversed from '@aziontech/webkit/assets/forrester-extended-reversed.svg'
  import frostAndSullivanExtendedColor from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
  import frostAndSullivanExtendedReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
  import g2SymbolColor from '@aziontech/webkit/assets/g2-symbol-color.svg'
  import gartnerExtendedColor from '@aziontech/webkit/assets/gartner-extended-color.svg'
  import gartnerExtendedReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
  import gigaomExtendedColor from '@aziontech/webkit/assets/gigaom-extended-color.svg'
  import gigaomExtendedReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'
  import RecognitionMarquee from '@aziontech/webkit/recognition-marquee'
</script>

<template>
  <RecognitionMarquee
    eyebrow="Analysts"
    title="Recognized as a market leader"
    aria-label="Analyst recognitions"
    :items="[
      {
        text: 'Named a Leader and Fast Mover, and the only vendor whose platform meets every key criterion the report sets for a full-stack edge deployment.',
        reportName: 'GigaOm Radar for Full-Stack Edge Deployments v3',
        date: 'May 2026',
        firmName: 'GigaOm',
        logo: gigaomExtendedReversed,
        logoLight: gigaomExtendedColor
      },
      {
        text: 'Evaluated as a Strong Performer among the edge development platforms that matter most.',
        reportName: 'The Forrester Wave™: Edge Development Platforms',
        date: 'March 2026',
        firmName: 'Forrester',
        logo: forresterExtendedReversed,
        logoLight: forresterExtendedColor
      },
      {
        text: 'Covered as a vendor in the market guide that defines the edge distribution platform category, in two consecutive editions.',
        reportName: 'Gartner Market Guide for Edge Distribution Platforms',
        date: 'November 2025',
        firmName: 'Gartner',
        logo: gartnerExtendedReversed,
        logoLight: gartnerExtendedColor
      },
      {
        text: 'Recognized as Latin America Company of the Year in the edge distribution platform industry, after being profiled among the Companies to Action on the Frost Radar™.',
        reportName: 'Frost & Sullivan Latin America Company of the Year',
        date: 'June 2026',
        firmName: 'Frost & Sullivan',
        logo: frostAndSullivanExtendedReversed,
        logoLight: frostAndSullivanExtendedColor
      },
      {
        text: 'Positioned as a Challenger and Fast Mover, with the application and API security stack evaluated as one platform rather than a set of bolt-ons.',
        reportName: 'GigaOm Radar for Application and API Security v5',
        date: 'March 2026',
        firmName: 'GigaOm',
        logo: gigaomExtendedReversed,
        logoLight: gigaomExtendedColor
      },
      {
        text: 'Recognized as a Leader in CDN, Web Security, and DDoS Protection, and a High Performer in Cloud Security, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and API Security Tools.',
        reportName: 'G2 Reports',
        date: 'March 2026',
        firmName: 'G2',
        logo: g2SymbolColor
      },
      {
        text: 'Recognized as a Leader in CDN and a High Performer in Web Security, DDoS Protection, WAF, Bot Detection and Mitigation, SSL & TLS Certificate Tools, and DNS Security Solution.',
        reportName: 'G2 Reports',
        date: 'December 2025',
        firmName: 'G2',
        logo: g2SymbolColor
      }
    ]"
  />
</template>
