/**
 * 跨进程共享的 IPC 契约。
 * 只放类型、通道名与返回信封，不放任何 Electron / Node 运行时对象。
 */

export interface AppError {
  code: string
  message: string
  detail?: string
  retryable: boolean
  logRef?: string
}

export type IpcResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError }

export interface PingData {
  pong: true
  version: string
}

export type PingResult = IpcResult<PingData>

export const IPC_CHANNELS = {
  ping: 'app:ping'
} as const
