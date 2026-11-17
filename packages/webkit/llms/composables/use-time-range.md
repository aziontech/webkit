# useTimeRange

Composable `@aziontech/webkit/use-time-range`. The signatures and option tables below are read from its typed source, [`src/composables/use-time-range/index.ts`](https://github.com/aziontech/webkit/blob/main/packages/webkit/src/composables/use-time-range/index.ts).

```ts
import { useTimeRange, timeRangePreset, TIME_RANGE_PRESETS } from '@aziontech/webkit/use-time-range'
import type { UseTimeRangeOptions, UseTimeRangeReturn, TimeRangePresetKey } from '@aziontech/webkit/use-time-range'
```

## `useTimeRange`

```ts
function useTimeRange(value: MaybeRefOrGetter<DateRangeValue | null | undefined>, options: UseTimeRangeOptions = {}): UseTimeRangeReturn
```

## `UseTimeRangeOptions`

Options of `useTimeRange`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `now` | `MaybeRefOrGetter<Date \| number \| undefined>` | no | Reference clock. A ref or getter that changes re-resolves the range; unset reads the nearest ConfigProvider now, then the real clock. |

## `UseTimeRangeReturn`

What `useTimeRange` returns.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | `ComputedRef<Date \| null>` | yes | Start instant of the range; null with no range. |
| `to` | `ComputedRef<Date \| null>` | yes | End instant of the range; null with no range. |
| `refresh` | `() => void` | yes | Resolves a relative range again against the clock, so the window ends now. |

## `timeRangePreset`

```ts
function timeRangePreset(key: TimeRangePresetKey): DateRangeValue
```

## `TimeRangePresetKey`

Key of a preset in `TIME_RANGE_PRESETS`.

```ts
type TimeRangePresetKey = 'last-1-hour' | 'last-24-hours' | 'last-7-days' | 'last-30-days'
```

## `TIME_RANGE_PRESETS`

```ts
const TIME_RANGE_PRESETS: RelativeOption[]
```
