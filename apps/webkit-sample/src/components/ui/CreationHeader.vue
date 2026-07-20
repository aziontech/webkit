<script setup>
// The single header for every "creation" flow (Create Application, Creation
// Center, Deploy Template): a back IconButton, the Azion brand mark, and the
// module breadcrumb on the left — and the signed-in user on the right. Creation
// pages render exactly ONE header, and it is this one.
//
// Focused flows drop the sidebar so the form is the only thing competing for
// attention, but the user must never look "signed out": the account avatar
// stays anchored to GlobalHeader.Right, mirroring the console shell's header
// (see AppLayout.vue). It is the one piece of persistent chrome a focused flow
// keeps.
import Avatar from "@aziontech/webkit/avatar";
import Breadcrumb from "@aziontech/webkit/breadcrumb";
import GlobalHeader from "@aziontech/webkit/global-header";
import IconButton from "@aziontech/webkit/icon-button";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

defineProps({
  // Breadcrumb trail for the flow. When empty, the breadcrumb is omitted.
  breadcrumb: { type: Array, default: () => [] },
  // Accessible label for the back button.
  backLabel: { type: String, default: "Back" },
  // Whether the back button is shown (hidden on terminal states like success).
  showBack: { type: Boolean, default: true },
});

const emit = defineEmits(["back", "navigate"]);

const route = useRoute();
const router = useRouter();

// The email carried over from the login flow (falls back to a placeholder),
// matching AppLayout so the identity is consistent across shells.
const userEmail = computed(() => route.query.email || "myemail@azion.com");

// The account avatar routes to the same account page as the console header,
// preserving the email query so identity carries across.
const openAccount = () =>
  router.push({ path: "/account", query: { email: userEmail.value } });
</script>

<template>
  <GlobalHeader aria-label="Azion Console">
    <GlobalHeader.Left>
      <IconButton
        v-if="showBack"
        icon="pi pi-chevron-left"
        :aria-label="backLabel"
        kind="outlined"
        size="small"
        @click="emit('back')"
      />
      <GlobalHeader.Brand>
        <span class="text-[var(--primary)]">
          <svg
            viewBox="0 0 90 18"
            fill="currentColor"
            role="img"
            aria-label="Azion"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M86.637 0L85.1445 7.79033L87.861 11.1671L90 0H86.637ZM72.5099 0L69.1465 17.561H72.5111L74.8163 5.52224L84.5333 17.561H86.637L87.0518 15.4112L74.6131 0H72.5099Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M51.6563 0L48.293 17.561H65.7833L69.1466 0H51.6563ZM54.3884 3.31794H65.1392L63.0467 14.243H52.296L54.3884 3.31794Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M45.0001 0L41.707 17.561H44.9994L48.2924 0H45.0001Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M24.217 0L23.5814 3.31801H35.1962L21.3511 14.9756L20.8535 17.561H38.3437L38.9793 14.243H27.3646L41.2126 2.58289L41.7072 0H24.217Z"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z"
            />
          </svg>
        </span>
      </GlobalHeader.Brand>
      <Breadcrumb
        v-if="breadcrumb.length"
        :items="breadcrumb"
        @navigate="(...args) => emit('navigate', ...args)"
      />
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <!-- The signed-in user stays visible even in a focused flow. -->
      <button
        type="button"
        aria-label="Account settings"
        class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
        @click="openAccount"
      >
        <Avatar
          :label="userEmail"
          size="medium"
          kind="square"
        />
      </button>
    </GlobalHeader.Right>
  </GlobalHeader>
</template>
