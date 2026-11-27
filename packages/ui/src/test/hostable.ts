import type { DefineComponent } from 'vue'

type PropsOf<C> = C extends (props: infer P, ...rest: never[]) => unknown
  ? P
  : C extends abstract new (...args: never[]) => { $props: infer P }
    ? P
    : never

type Members<C> = { [K in keyof C]: C[K] }

export const hostable = <C>(component: C) =>
  component as unknown as DefineComponent<PropsOf<C>> & Members<C>
