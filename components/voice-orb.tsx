'use client'

import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { clsx } from 'clsx'

interface VoiceOrbProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

interface SpeechRecognitionResult {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult[]
  [index: number]: SpeechRecognitionResult[]
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
}

interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance
}

export function VoiceOrb({ onTranscript, disabled }: VoiceOrbProps) {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setRecording(true)

      useBrowserSTTLive()
    } catch {
      setError('Microphone access denied')
    }
  }

  function useBrowserSTTLive() {
    const win = window as WindowWithSpeech
    const SpeechRecognitionCtor = win.SpeechRecognition ?? win.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
      stopRecording()
    }

    recognition.onerror = () => {
      stopRecording()
    }

    recognition.start()
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setRecording(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={recording ? stopRecording : startRecording}
        disabled={disabled}
        className={clsx(
          'relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]',
          recording
            ? 'bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4)]'
            : 'bg-[#6366f1] shadow-[0_0_40px_rgba(99,102,241,0.35)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]',
          disabled && 'cursor-not-allowed opacity-40'
        )}
      >
        {recording && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/30" />
            <span className="absolute inset-0 animate-pulse rounded-full bg-rose-500/20" />
          </>
        )}
        {recording ? (
          <Square className="relative h-7 w-7 fill-white text-white" />
        ) : (
          <Mic className="relative h-7 w-7 text-white" />
        )}
      </button>
      {recording && (
        <p className="animate-pulse text-sm text-rose-400">Recording… tap to stop</p>
      )}
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </div>
  )
}

