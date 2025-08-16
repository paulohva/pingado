import { contextBridge, ipcRenderer } from 'electron';

export interface NetworkInterface {
  name: string;
  address: string;
  netmask: string;
  family: string;
}

export interface ElectronAPI {
  getNetworkInterfaces: () => Promise<NetworkInterface[]>;
  scanNetwork: (networkRange: string) => Promise<string[]>;
  pingHost: (ip: string, count: number) => Promise<string>;
  getNetworkRange: (ip: string, netmask: string) => Promise<string>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  getNetworkInterfaces: () => ipcRenderer.invoke('get-network-interfaces'),
  scanNetwork: (networkRange: string) => ipcRenderer.invoke('scan-network', networkRange),
  pingHost: (ip: string, count: number) => ipcRenderer.invoke('ping-host', ip, count),
  getNetworkRange: (ip: string, netmask: string) => ipcRenderer.invoke('get-network-range', ip, netmask),
} as ElectronAPI);
