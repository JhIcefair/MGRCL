import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, type PingResult } from '../shared/ipc'

/**
 * renderer 只能看到这里显式暴露的方法；不要暴露 ipcRenderer 本身。
 */
const api = {
  ping: (): Promise<PingResult> => ipcRenderer.invoke(IPC_CHANNELS.ping)
} as const

contextBridge.exposeInMainWorld('mgrcl', api)
