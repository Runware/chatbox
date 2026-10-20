import { describe, expect, it } from 'vitest'
import { runwareProvider } from './runware'

describe('runwareProvider', () => {
  it('registers as an OpenAI-compatible provider pointing at the Runware API', () => {
    expect(runwareProvider.id).toBe('runware')
    expect(runwareProvider.name).toBe('Runware')
    expect(runwareProvider.type).toBe('openai')
    expect(runwareProvider.defaultSettings?.apiHost).toBe('https://api.runware.ai/v1')
  })

  it('ships curated defaults taken from the Runware model catalog', () => {
    const models = runwareProvider.defaultSettings?.models ?? []
    expect(models.length).toBeGreaterThan(0)
    for (const model of models) {
      expect(model.modelId).toMatch(/^[a-z0-9]+(-[a-z0-9.]+)*$/i)
      expect(model.type).toBeUndefined()
    }
    expect(models.map((model) => model.modelId)).toContain('google-gemini-3-1-flash-lite')
  })
})
