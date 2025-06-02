// src/components/pages/home-page.tsx
'use client'

import { useCounterStore } from '../../../../providers/counterStoreProvider';

export default function CounterComponent() {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )

  return (
    <div>
      Count: {count}
      <hr />
      <button type="button" onClick={incrementCount}>
        Increment Count
      </button>
      <button type="button" onClick={decrementCount}>
        Decrement Count
      </button>
    </div>
  )
}
