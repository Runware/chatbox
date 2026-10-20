import OpenAICompatible, { type OpenAICompatibleSettings } from '../../../models/openai-compatible'
import type { ModelDependencies } from '../../../types/adapters'

export const RUNWARE_API_HOST = 'https://api.runware.ai/v1'

type RunwareOptions = Omit<OpenAICompatibleSettings, 'apiHost'> & { apiHost?: string }

export default class Runware extends OpenAICompatible {
  public name = 'Runware'
  declare public options: OpenAICompatibleSettings
  constructor(options: RunwareOptions, dependencies: ModelDependencies) {
    const apiHost = options.apiHost || RUNWARE_API_HOST
    super(
      {
        ...options,
        apiHost,
      },
      dependencies
    )
    this.options = {
      ...options,
      apiHost,
    }
  }
}
