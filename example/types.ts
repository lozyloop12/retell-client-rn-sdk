/**
 * Shared TypeScript interface definitions for Retell SDK examples
 *
 * This file provides type safety for the examples when importing
 * the RetellWebClient from the built package to avoid module
 * resolution issues during development.
 */

export interface IRetellWebClient {
  on(event: string, callback: (...args: any[]) => void): void;
  removeAllListeners(): void;
  startCall(config: {
    accessToken: string;
    sampleRate?: number;
    emitRawAudioSamples?: boolean;
    captureDeviceId?: string;
    playbackDeviceId?: string;
  }): Promise<void>;
  stopCall(): void;
  mute(): void;
  unmute(): void;
  startAudioPlayback(): Promise<void>;
  isAgentTalking?: boolean;
}

export interface RetellWebClientConstructor {
  new (): IRetellWebClient;
  registerGlobals(): Promise<void>;
}

/**
 * Helper function to get the RetellWebClient with proper typing
 * Use this in examples instead of direct imports to avoid TypeScript issues
 */
export function getRetellWebClient(): RetellWebClientConstructor {
  const { RetellWebClient } = require("retell-client-rn-sdk") as {
    RetellWebClient: RetellWebClientConstructor;
  };
  return RetellWebClient;
}
