<script setup>
  // Decorative ASCII "asterisk" glyph — an eight-point spark rendered on a
  // monospace grid, echoing the Azion mark. Purely decorative (aria-hidden); it
  // inherits its color from the parent via `currentColor`, so a feature card can
  // tint it by setting `color` on the element.
  const ART = [
    '        @@@        ',
    '    .   @@@   .    ',
    '  =%%*  @@@  *%%=  ',
    '   .*%@@@@@@@%*.   ',
    '      =%@@@%=      ',
    ' :*%@@@@@@@@@@@%*: ',
    '      =%@@@%=      ',
    '   .*%@@@@@@@%*.   ',
    '  =%%*  @@@  *%%=  ',
    '    .   @@@   .    ',
    '        @@@        '
  ].join('\n')
</script>

<template>
  <pre
    aria-hidden="true"
    class="w-fit select-none whitespace-pre font-code leading-none"
    style="font-size: 4px; line-height: 1"
    >{{ ART }}</pre>
</template>
