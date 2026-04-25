import { useState, useCallback } from 'react'

export function useTweaks(defaults) {
  const [values, setValues] = useState(defaults)

  const setTweak = useCallback((key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    // Optional: persist to localStorage
    try {
      localStorage.setItem('csi-tweaks', JSON.stringify({ ...values, [key]: val }))
    } catch (e) {
      // localStorage not available
    }
  }, [values])

  return [values, setTweak]
}
