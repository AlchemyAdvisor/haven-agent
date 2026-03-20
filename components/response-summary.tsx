'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { ParsedQuery } from '@/lib/types'

interface ResponseSummaryProps {
  summary: string
  query: ParsedQuery
  totalFound: number
  marketContext: string
  audioBase64?: string | null
}

export function ResponseSummary({
  summary,
  query,
  totalFound,
  marketContext,
  audioBase64,
}: ResponseSummaryProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [audioReady, setAudioReady] = useState(false)

  useEffect(() => {
    if (!audioBase64) return
    const src = `data:audio/mpeg;base64,${audioBase64}`
    const audio = new Audio(src)
    audioRef.current = audio
    setAudioReady(true)
    audio.onended = () => setSpeaking(false)
    audio.play().then(() => setSpeaking(true)).catch(() => setSpeaking(false))
  }, [audioBase64])

  function toggleAudio() {
    if (!audioRef.current) return
    if (speaking) {
      audioRef.current.pause()
      setSpeaking(false)
    } else {
      audioRef.current.play()
      setSpeaking(true)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="rounded-2xl border border-[#1e1e22] bg-[#111113] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <p className="text-base font-medium leading-relaxed text-[#f0f0f2]">{summary}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#8b8b95]">
              <span>
                Query: <span className="text-[#f0f0f2]">{query.raw}</span>
              </span>
              <span>·</span>
              <span>
                Found: <span className="text-[#f0f0f2]">{totalFound} listings</span>
              </span>
              <span>·</span>
              <span className="text-[#f0f0f2]">{marketContext}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {audioBase64 && (
              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 rounded-xl border border-[#1e1e22] bg-[#0a0a0b] px-3 py-2 text-xs font-medium text-[#8b8b95] transition-colors hover:border-[#6366f1]/50 hover:text-[#f0f0f2]"
              >
                {speaking ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 animate-pulse text-[#6366f1]" />
                    Speaking…
                  </>
                ) : audioReady ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    Replay
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    No audio
                  </>
                )}
              </button>
            )}
            {!audioBase64 && (
              <span className="flex items-center gap-1.5 text-xs text-[#8b8b95]">
                <VolumeX className="h-3.5 w-3.5" /> No voice key
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
