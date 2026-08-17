<script setup>
  // The payment card's brand mark — the Visa wordmark exported from the design,
  // on the brand's own blue plate.
  //
  // The paths are the exported asset, not a redraw: a payment brand is a
  // trademark, and an approximation of one is wrong in a way a user notices and a
  // brand guideline forbids. Geometry is the design's: a 40x28 plate with the
  // 22x7 wordmark centred in it, both fixed, so the mark never stretches with the
  // row it sits in.
  //
  // The plate colour is the only literal colour in this app that is not a theme
  // token, and it has to be: Visa blue is Visa's, not the theme's, and it stays
  // the same in light and dark exactly like the client logos on the marketing
  // pages do. Everything around it — the row, the border, the label — is tokens.
  defineProps({
    // Accessible name. The mark is decorative when the row already names the card
    // ("Ended with 8888"), which is the default.
    ariaLabel: { type: String, default: '' }
  })
</script>

<template>
  <span
    class="flex h-7 w-10 shrink-0 items-center justify-center overflow-clip rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[#2548a0]"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel || undefined"
    :aria-hidden="ariaLabel ? undefined : 'true'"
  >
    <svg
      width="22"
      height="7"
      viewBox="0 0 22 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="block"
      focusable="false"
    >
      <g clip-path="url(#card-brand-visa-clip)">
        <path
          d="M11.3779 2.22887C11.3653 3.2001 12.2598 3.74205 12.9337 4.0643C13.626 4.3949 13.8585 4.60693 13.8558 4.90261C13.8506 5.35508 13.3036 5.5548 12.7916 5.56255C11.8985 5.57613 11.3792 5.3259 10.9663 5.13665L10.6446 6.61416C11.0588 6.80147 11.8258 6.96483 12.6211 6.972C14.4881 6.972 15.7095 6.06757 15.7162 4.66529C15.7235 2.8856 13.2078 2.7871 13.225 1.99163C13.2309 1.75042 13.4655 1.49302 13.9794 1.42758C14.2337 1.39452 14.9359 1.36922 15.7321 1.729L16.0445 0.299482C15.6164 0.146494 15.0661 0 14.381 0C12.6238 0 11.3878 0.916747 11.3779 2.22887ZM19.047 0.123132C18.7061 0.123132 18.4188 0.318289 18.2906 0.617771L15.6237 6.867H17.4893L17.8606 5.8601H20.1403L20.3557 6.867H22L20.5651 0.123132H19.047ZM19.308 1.9449L19.8464 4.4773H18.3719L19.308 1.9449ZM9.11591 0.123217L7.64534 6.86692H9.42313L10.893 0.123048L9.11591 0.123217ZM6.48596 0.123217L4.63555 4.71328L3.88704 0.810398C3.79921 0.374711 3.45237 0.123132 3.0672 0.123132H0.0423672L0 0.318964C0.620984 0.451204 1.32653 0.664494 1.75398 0.892711C2.01558 1.03212 2.09017 1.15399 2.17611 1.48526L3.59382 6.867H5.4725L8.35278 0.123132L6.48596 0.123217Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="card-brand-visa-clip">
          <rect
            width="22"
            height="7"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  </span>
</template>
