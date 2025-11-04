import { useEffect, useState } from 'react'

type TypewriterOptions = {
  speed?: number
  startDelay?: number
  loop?: boolean
  loopDelay?: number
  fallback?: string
}

export function useTypewriter(
  text: string,
  {
    speed = 40,
    startDelay = 0,
    loop = false,
    loopDelay = 2000,
    fallback = '',
  }: TypewriterOptions = {},
) {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    const content = text?.length ? text : ''

    if (!content.trim()) {
      setDisplay(fallback)
      return
    }

    setDisplay('')

    let index = 0
    let timer: number
    let active = true

    const type = () => {
      if (!active) return

      index += 1
      setDisplay(content.slice(0, index))

      if (index < content.length) {
        timer = window.setTimeout(type, speed)
        return
      }

      if (loop) {
        timer = window.setTimeout(() => {
          if (!active) return
          index = 0
          setDisplay('')
          timer = window.setTimeout(type, startDelay)
        }, loopDelay)
      }
    }

    timer = window.setTimeout(type, startDelay)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [fallback, loop, loopDelay, speed, startDelay, text])

  return display
}

export type { TypewriterOptions }
