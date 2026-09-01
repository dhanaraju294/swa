import { useSyncExternalStore } from 'react'

import { EMPTY_FORMAT_OVERRIDE_BUNDLE, type FormatOverrideBundle } from './format-overrides'

// The Airo builder injected this bundle via a `virtual:format-overrides` module.
// Outside the builder there are no visual overrides, so we start from the empty bundle.
const initialFormatOverrideBundle: FormatOverrideBundle = EMPTY_FORMAT_OVERRIDE_BUNDLE

export const FORMAT_OVERRIDES_UPDATE_EVENT = 'format-overrides:update'
export const FORMAT_OVERRIDES_WILL_UPDATE_EVENT = 'airo-format-overrides:will-update'

const listeners = new Set<() => void>()
let currentBundle: FormatOverrideBundle = initialFormatOverrideBundle

export function getFormatOverrideBundle(): FormatOverrideBundle {
  return currentBundle
}

export function subscribeFormatOverrideBundle(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setFormatOverrideBundle(bundle: FormatOverrideBundle): void {
  currentBundle = bundle
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(FORMAT_OVERRIDES_WILL_UPDATE_EVENT, { detail: bundle }))
  }
  listeners.forEach((listener) => listener())
}

export function useFormatOverrideBundle(): FormatOverrideBundle {
  return useSyncExternalStore(
    subscribeFormatOverrideBundle,
    getFormatOverrideBundle,
    getFormatOverrideBundle,
  )
}

if (import.meta.hot) {
  import.meta.hot.on(FORMAT_OVERRIDES_UPDATE_EVENT, (bundle: FormatOverrideBundle) => {
    setFormatOverrideBundle(bundle)
  })
}
