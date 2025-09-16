/**
 * AI Provider Registry and Factory
 * Manages different AI providers and creates instances based on configuration
 */

import { AIProvider, AIProviderConfig } from './types'
import { GeminiProvider } from './providers/gemini'

export class AIProviderRegistry {
  private static providers = new Map<string, new () => AIProvider>()
  private static instances = new Map<string, AIProvider>()

  static {
    // Register available providers
    this.providers.set('gemini', GeminiProvider)
    // Future providers can be added here
    // this.providers.set('openai', OpenAIProvider)
    // this.providers.set('anthropic', AnthropicProvider)
  }

  static async getProvider(providerName: string): Promise<AIProvider> {
    // Return cached instance if available
    if (this.instances.has(providerName)) {
      return this.instances.get(providerName)!
    }

    // Create new instance
    const ProviderClass = this.providers.get(providerName)
    if (!ProviderClass) {
      throw new Error(`AI provider '${providerName}' not found`)
    }

    const provider = new ProviderClass()
    const config = await this.getProviderConfig(providerName)
    await provider.initialize(config)
    
    // Cache the instance
    this.instances.set(providerName, provider)
    return provider
  }

  static async getProviderConfig(providerName: string): Promise<AIProviderConfig> {
    const configs: Record<string, AIProviderConfig> = {
      gemini: {
        id: 'gemini',
        name: 'gemini',
        displayName: 'Google Gemini',
        type: 'chat',
        model: process.env.DEFAULT_AI_MODEL || 'gemini-1.5-pro',
        apiKey: process.env.GOOGLE_API_KEY || '',
        options: {
          temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
          maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1000'),
          topP: 0.9,
        }
      }
      // Future provider configs can be added here
    }

    const config = configs[providerName]
    if (!config) {
      throw new Error(`Configuration for provider '${providerName}' not found`)
    }

    if (!config.apiKey) {
      throw new Error(`API key for provider '${providerName}' not configured`)
    }

    return config
  }

  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  static clearCache(): void {
    this.instances.clear()
  }
}