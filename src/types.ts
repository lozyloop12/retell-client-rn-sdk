export interface StartCallConfig {
  accessToken: string;
  sampleRate?: number;
  captureDeviceId?: string;
  playbackDeviceId?: string;
  emitRawAudioSamples?: boolean;
}

export interface RetellEvent {
  event_type: string;
  [key: string]: any;
}

export interface AudioAnalyzer {
  calculateVolume: () => number;
  analyser: AnalyserNode;
  cleanup: () => Promise<void>;
}

export declare class RetellWebClient {
  public isAgentTalking: boolean;
  public analyzerComponent?: AudioAnalyzer;

  constructor();

  startCall(config: StartCallConfig): Promise<void>;
  stopCall(): void;
  mute(): void;
  unmute(): void;
  startAudioPlayback(): Promise<void>;

  // Event emitter methods
  on(event: "call_started", listener: () => void): this;
  on(event: "call_ended", listener: () => void): this;
  on(event: "call_ready", listener: () => void): this;
  on(event: "agent_start_talking", listener: () => void): this;
  on(event: "agent_stop_talking", listener: () => void): this;
  on(event: "update", listener: (data: RetellEvent) => void): this;
  on(event: "metadata", listener: (data: RetellEvent) => void): this;
  on(event: "node_transition", listener: (data: RetellEvent) => void): this;
  on(event: "audio", listener: (data: Float32Array) => void): this;
  on(event: "error", listener: (error: string) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;

  emit(event: "call_started"): boolean;
  emit(event: "call_ended"): boolean;
  emit(event: "call_ready"): boolean;
  emit(event: "agent_start_talking"): boolean;
  emit(event: "agent_stop_talking"): boolean;
  emit(event: "update", data: RetellEvent): boolean;
  emit(event: "metadata", data: RetellEvent): boolean;
  emit(event: "node_transition", data: RetellEvent): boolean;
  emit(event: "audio", data: Float32Array): boolean;
  emit(event: "error", error: string): boolean;
  emit(event: string, ...args: any[]): boolean;

  removeAllListeners(event?: string): this;
  removeListener(event: string, listener: (...args: any[]) => void): this;
}

export default RetellWebClient;
