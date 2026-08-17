<script setup>
  // The parent route of the signup flow (/signup and /signup/verify). It owns the
  // split — and therefore the entrance — so the flow is ONE screen with a changing
  // card instead of a sequence of page loads.
  //
  // This is the whole reason the flow is nested rather than two sibling routes.
  // vue-router keeps a parent component instance alive across its children, so
  // AuthSplit mounts once, on entering the flow: the header, the seam and the
  // network panel hold perfectly still from "Sign Up for a Free Account" through
  // "Check your inbox", and only the card between them changes. As siblings, each
  // step re-mounted the split and re-ran the 400ms slide, so the map arrived three
  // times over and every step read as leaving the product and coming back.
  //
  // What the card swap gets instead is a cross-fade an order of magnitude smaller
  // than the entrance — `out-in`, so the two cards never occupy the column at once
  // (they differ in height by half the card, and side by side they would fight for
  // the centre). Leaving is fast-02 and arriving is moderate-01: the old card is
  // gone before the new one commits, which is what makes a step change read as a
  // step change rather than as a transition between screens.
  //
  // Onboarding is deliberately NOT a child of this route. It is where the flow
  // actually arrives — the email is verified, the organization gets created, the
  // console appears — and it carries its own composition and its own entrance. The
  // full slide is spent there, once, on the one move that is a real scene change.
  import AuthSplit from '../../components/auth/AuthSplit.vue'
</script>

<template>
  <AuthSplit>
    <RouterView v-slot="{ Component, route }">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <!-- The step's own content: its card, plus whatever belongs on the canvas
             under it. The column's centring and gap come from AuthSplit.

             THE KEYED WRAPPER IS LOAD-BEARING. `<Transition mode="out-in">` must
             not take `<component :is>` as its direct child: with a dynamic
             component there, the leave completes, the old step is removed, and the
             branch waiting to enter is dropped — the slot renders an empty comment
             and the next step never appears at all. Giving the transition a stable
             keyed ELEMENT to hold, with the dynamic component inside it, is what
             makes `out-in` resolve; `route.path` is the identity that tells one
             step from the next.

             The symptom was specific and easy to misdiagnose: /signup/verify was
             correct on a cold load and after a refresh (no leave to wait for), and
             blank every single time it was ARRIVED AT from /signup. Collapsing this
             wrapper back into a bare `<component :is>` brings the blank step
             straight back, so check the step change by NAVIGATING to it — a
             reload will always look fine. -->
        <div
          :key="route.path"
          class="flex w-full flex-col items-center"
        >
          <component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </AuthSplit>
</template>
