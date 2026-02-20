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

// SVG module declaration for TypeScript
declare module '*.svg' {
  const content: string;
  export default content;
}

// Audio module declarations for TypeScript
declare module '*.mp3' {
  const content: string;
  export default content;
}

declare module '*.wav' {
  const content: string;
  export default content;
}

declare module '*.m4a' {
  const content: string;
  export default content;
}

declare module '*.ogg' {
  const content: string;
  export default content;
}

declare module '*.mp4' {
  const content: string;
  export default content;
}
