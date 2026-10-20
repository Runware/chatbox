import type { ProviderModelInfo } from '@shared/types'
import type { ModelDependencies } from '@shared/types/adapters'
import type { SentryScope } from '@shared/utils/sentry_adapter'
import { describe, expect, it, vi } from 'vitest'
import Runware from './runware'

const mockScope: SentryScope = {
  setTag: vi.fn(),
  setExtra: vi.fn(),
}

function createDependencies(): ModelDependencies {
  return {
    request: {
      fetchWithOptions: vi.fn(),
      apiRequest: vi.fn(),
    },
    storage: {
      saveImage: vi.fn(),
      getImage: vi.fn(),
    },
    sentry: {
      captureException: vi.fn(),
      withScope: vi.fn((callback: (scope: SentryScope) => void) => callback(mockScope)),
    },
    getRemoteConfig: vi.fn(),
    platformType: 'desktop',
    oauth: {
      refreshCredential: vi.fn(),
      persistCredential: vi.fn(),
      clearCredential: vi.fn(),
    },
  }
}

function createModel(overrides: Partial<ConstructorParameters<typeof Runware>[0]> = {}) {
  const model: ProviderModelInfo = {
    modelId: 'google-gemini-3-1-flash-lite',
    type: 'chat',
  }
  return new Runware(
    {
      apiKey: 'test-key',
      model,
      stream: false,
      ...overrides,
    },
    createDependencies()
  )
}

describe('Runware listModels', () => {
  it('fetches models from the OpenAI-compatible /models endpoint', async () => {
    const customFetch = vi.fn((input: unknown, init?: RequestInit) => {
      expect(String(input)).toBe('https://api.runware.ai/v1/models')
      expect(init?.method).toBe('GET')
      expect(init?.headers).toMatchObject({ Authorization: 'Bearer test-key' })
      return Promise.resolve(
        new Response(
          JSON.stringify({
            object: 'list',
            data: [
              { id: 'google-gemini-3-1-flash-lite', object: 'model', created: 0 },
              { id: 'openai-gpt-5-4', object: 'model', created: 0 },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
    })

    const runware = createModel({ customFetch })
    const models = await runware.listModels()

    expect(customFetch).toHaveBeenCalledOnce()
    expect(models.map((model) => model.modelId)).toEqual([
      'google-gemini-3-1-flash-lite',
      'openai-gpt-5-4',
    ])
  })

  it('honors a custom apiHost override (e.g. proxy base URL)', async () => {
    const customFetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ object: 'list', data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )
    const runware = createModel({ apiHost: 'https://proxy.example/v1', customFetch })
    await runware.listModels()
    expect(String((customFetch.mock.calls[0] as unknown[])[0])).toBe('https://proxy.example/v1/models')
  })

  it('returns an empty list when the remote catalog is unreachable', async () => {
    const runware = createModel({
      customFetch: vi.fn(() => Promise.reject(new Error('network error'))),
    })
    const models = await runware.listModels()
    expect(models).toEqual([])
  })
})
