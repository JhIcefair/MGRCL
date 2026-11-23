import type { PingResult } from '../../shared/ipc'

export {}

declare global {
  interface Window {
    readonly mgrcl: {
      ping: () => Promise<PingResult>
    }
  }
}
