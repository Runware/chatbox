import { ModelProviderEnum, ModelProviderType } from '../../types'
import { defineProvider } from '../registry'
import Runware, { RUNWARE_API_HOST } from './models/runware'

export const runwareProvider = defineProvider({
  id: ModelProviderEnum.Runware,
  name: 'Runware',
  type: ModelProviderType.OpenAI,

  curatedModelIds: [
    'google-gemini-3-1-flash-lite',
    'google-gemini-3-1-pro',
    'openai-gpt-5-4',
    'openai-gpt-5-4-mini',
    'anthropic-claude-opus-4-8',
    'anthropic-claude-sonnet-4-6',
    'anthropic-claude-haiku-4-5',
    'deepseek-v4-flash',
    'deepseek-v4-pro',
    'moonshotai-kimi-k2-6',
    'zai-glm-5-2',
    'minimax-m3',
    'xai-grok-4-3',
  ],
  urls: {
    website: 'https://runware.ai/',
  },
  defaultSettings: {
    apiHost: RUNWARE_API_HOST,
    models: [
      {
        modelId: 'google-gemini-3-1-flash-lite',
        nickname: 'Google Gemini 3.1 Flash Lite',
        contextWindow: 1_048_576,
        maxOutput: 65_536,
        capabilities: ['vision', 'reasoning', 'tool_use'],
      },
      {
        modelId: 'google-gemini-3-1-pro',
        nickname: 'Google Gemini 3.1 Pro',
        contextWindow: 1_048_576,
        maxOutput: 65_536,
        capabilities: ['vision', 'reasoning', 'tool_use'],
      },
      {
        modelId: 'openai-gpt-5-4',
        nickname: 'GPT-5.4',
        contextWindow: 1_050_000,
        maxOutput: 128_000,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'openai-gpt-5-4-mini',
        nickname: 'GPT-5.4 Mini',
        contextWindow: 400_000,
        maxOutput: 128_000,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'anthropic-claude-opus-4-8',
        nickname: 'Claude Opus 4.8',
        contextWindow: 1_000_000,
        maxOutput: 128_000,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'anthropic-claude-sonnet-4-6',
        nickname: 'Claude Sonnet 4.6',
        contextWindow: 1_000_000,
        maxOutput: 128_000,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'anthropic-claude-haiku-4-5',
        nickname: 'Claude Haiku 4.5',
        contextWindow: 200_000,
        maxOutput: 64_000,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'deepseek-v4-flash',
        nickname: 'DeepSeek V4 Flash',
        contextWindow: 1_048_576,
        maxOutput: 384_000,
        capabilities: ['reasoning', 'tool_use'],
      },
      {
        modelId: 'deepseek-v4-pro',
        nickname: 'DeepSeek V4 Pro',
        contextWindow: 1_048_576,
        maxOutput: 384_000,
        capabilities: ['reasoning', 'tool_use'],
      },
      {
        modelId: 'moonshotai-kimi-k2-6',
        nickname: 'Kimi K2.6',
        contextWindow: 262_144,
        maxOutput: 131_072,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'zai-glm-5-2',
        nickname: 'GLM-5.2',
        contextWindow: 1_048_576,
        maxOutput: 131_072,
        capabilities: ['tool_use'],
      },
      {
        modelId: 'minimax-m3',
        nickname: 'MiniMax M3',
        contextWindow: 1_000_000,
        maxOutput: 512_000,
        capabilities: ['vision', 'tool_use'],
      },
      {
        modelId: 'xai-grok-4-3',
        nickname: 'Grok 4.3',
        contextWindow: 1_048_576,
        maxOutput: 131_072,
        capabilities: ['vision', 'tool_use'],
      },
    ],
  },
  createModel: (config) => {
    return new Runware(
      {
        apiKey: config.effectiveApiKey,
        apiHost: config.formattedApiHost || RUNWARE_API_HOST,
        model: config.model,
        temperature: config.settings.temperature,
        topP: config.settings.topP,
        maxOutputTokens: config.settings.maxTokens,
        stream: config.settings.stream,
      },
      config.dependencies
    )
  },
  getDisplayName: (modelId, providerSettings) => {
    return `Runware API (${providerSettings?.models?.find((m) => m.modelId === modelId)?.nickname || modelId})`
  },
})
