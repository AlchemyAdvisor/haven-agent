export interface ElevenLabsOptions {
  voiceId?: string
  modelId?: string
}

export async function textToSpeech(
  text: string,
  options: ElevenLabsOptions = {}
): Promise<ArrayBuffer | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    console.warn('[ElevenLabs] API key not set. Skipping TTS.')
    return null
  }

  const voiceId = options.voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? 'EXAVITQu4vr4xnSDxMaL'
  const modelId = options.modelId ?? 'eleven_monolingual_v1'
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })

  if (!response.ok) {
    console.error('[ElevenLabs] TTS failed:', response.status, await response.text())
    return null
  }

  return response.arrayBuffer()
}
