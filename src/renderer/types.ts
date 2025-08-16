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

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
