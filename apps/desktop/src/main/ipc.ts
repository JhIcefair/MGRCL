import { app, ipcMain } from 'electron'
import { z } from 'zod'
import { IPC_CHANNELS, type PingResult } from '../shared/ipc'

/**
 * app:ping 无入参，但仍保留 zod 校验入口，避免后续加参数时绕过校验。
 */
const pingArgsSchema = z.tuple([])

function invalidArgs(detail: string): PingResult {
  return {
    ok: false,
    error: {
      code: 'IPC_INVALID_ARGS',
      message: '请求参数无效',
      detail,
      retryable: false
    }
  }
}

export function registerIpcHandlers(): void {
  ipcMain.removeHandler(IPC_CHANNELS.ping)
  ipcMain.handle(
    IPC_CHANNELS.ping,
    (_event, ...args: unknown[]): PingResult => {
      const parsed = pingArgsSchema.safeParse(args)
      if (!parsed.success) {
        return invalidArgs(parsed.error.message)
      }

      return {
        ok: true,
        data: {
          pong: true,
          version: app.getVersion()
        }
      }
    }
  )
}
