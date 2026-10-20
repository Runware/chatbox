/**
 * Live smoke test for the Runware provider (OpenAI-compatible endpoint).
 *
 * Run:
 *   RUNWARE_API_KEY=... [RUNWARE_BASE_URL=https://api.runware.ai/v1] \
 *   RUN_MODEL_PROVIDER_TESTS=1 pnpm vitest run test/integration/model-provider/runware-smoke.test.ts
 *
 * Skips itself when RUNWARE_API_KEY is not set.
 */
import type { ModelMessage } from 'ai'
import { describe, expect, it } from 'vitest'
import TestPlatform from '../../../src/renderer/platform/test_platform'
import { settings as getDefaultSettings, newConfigs } from '../../../src/shared/defaults'
import type AbstractAISDKModel from '../../../src/shared/models/abstract-ai-sdk'
import { getModel } from '../../../src/shared/providers'
import { ModelProviderEnum, type SessionSettings, type Settings } from '../../../src/shared/types'
import { createMockModelDependencies } from '../mocks/model-dependencies'
import { MockSentryAdapter } from '../mocks/sentry'

const API_KEY = process.env.RUNWARE_API_KEY || ''
const BASE_URL = (process.env.RUNWARE_BASE_URL || 'https://api.runware.ai/v1').replace(/\/$/, '')
const MODEL_ID = process.env.RUNWARE_SMOKE_MODEL || 'openai-gpt-5-4-mini'

describe.runIf(API_KEY)('Runware provider smoke (live)', () => {
  it('completes a chat completion through the Runware provider stack', async () => {
    const mockDependencies = await createMockModelDependencies(new TestPlatform(), new MockSentryAdapter())
    const globalSettings: Settings = {
      ...getDefaultSettings(),
      providers: {
        [ModelProviderEnum.Runware]: {
          apiHost: BASE_URL,
          apiKey: API_KEY,
        },
      },
    }
    const sessionSettings: SessionSettings = {
      provider: ModelProviderEnum.Runware,
      modelId: MODEL_ID,
      temperature: 0.7,
      maxTokens: 64,
      stream: true,
    }
    const model = getModel(sessionSettings, globalSettings, newConfigs(), mockDependencies) as AbstractAISDKModel
    const messages: ModelMessage[] = [{ role: 'user', content: 'Reply with exactly: OK' }]
    const result = await model.chat(messages, {})
    const text = result.contentParts.find((part) => part.type === 'text')?.text
    expect(text).toBeTruthy()
  }, 60_000)
})
