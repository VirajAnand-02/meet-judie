/**
 * Main AI Service Entry Point
 * Provides a unified interface for all AI functionality
 */

export { AIProviderRegistry } from './registry'
export { aiConversationService } from './conversation'
export * from './types'

// Re-export for convenience
export { GeminiProvider } from './providers/gemini'