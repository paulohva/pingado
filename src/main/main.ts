import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';

const execAsync = promisify(exec);

let mainWindow: BrowserWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    title: 'Pingado - Network Scanner',
  });

  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    // Wait a bit for the dev server to start, then load
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3000').catch((err) => {
        console.error('Failed to load dev server:', err);
        // If dev server isn't ready, try loading the file
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
      });
    }, 3000); // Increased timeout
    mainWindow.webContents.openDevTools();
    
    // Add error handling
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });
    
    mainWindow.webContents.on('dom-ready', () => {
      console.log('DOM is ready');
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Get local network interface information
async function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const networkInfo: Array<{ name: string; address: string; netmask: string; family: string }> = [];

  Object.keys(interfaces).forEach((name) => {
    const netInterface = interfaces[name];
    if (netInterface) {
      netInterface.forEach((details) => {
        if (details.family === 'IPv4' && !details.internal) {
          networkInfo.push({
            name,
            address: details.address,
            netmask: details.netmask,
            family: details.family,
          });
        }
      });
    }
  });

  return networkInfo;
}

// Calculate network range from IP and netmask
function getNetworkRange(ip: string, netmask: string): string {
  const ipParts = ip.split('.').map(Number);
  const maskParts = netmask.split('.').map(Number);
  
  // Calculate network address
  const networkParts = ipParts.map((part, index) => part & maskParts[index]);
  
  // Calculate CIDR notation
  const cidr = maskParts.reduce((acc, part) => {
    return acc + part.toString(2).split('1').length - 1;
  }, 0);
  
  return `${networkParts.join('.')}/${cidr}`;
}

// Scan network for available IPs
async function scanNetwork(networkRange: string): Promise<string[]> {
  const [network, cidr] = networkRange.split('/');
  const networkParts = network.split('.').map(Number);
  const hosts: string[] = [];
  
  // For simplicity, we'll scan common ranges (adjust based on CIDR if needed)
  const baseNetwork = `${networkParts[0]}.${networkParts[1]}.${networkParts[2]}`;
  
  // Ping sweep - scan 1-254 (skip network and broadcast)
  const pingPromises: Promise<string | null>[] = [];
  
  for (let i = 1; i <= 254; i++) {
    const targetIP = `${baseNetwork}.${i}`;
    pingPromises.push(quickPing(targetIP));
  }
  
  const results = await Promise.all(pingPromises);
  return results.filter((ip): ip is string => ip !== null);
}

// Quick ping to check if host is alive
async function quickPing(ip: string): Promise<string | null> {
  try {
    let pingCommand: string;
    
    // Different ping commands for different platforms
    if (process.platform === 'win32') {
      pingCommand = `ping -n 1 -w 1000 ${ip}`;
    } else {
      pingCommand = `ping -c 1 -W 1 ${ip}`;
    }
    
    await execAsync(pingCommand);
    return ip;
  } catch (error) {
    return null;
  }
}

// Full ping with detailed output
async function fullPing(ip: string, count: number = 4): Promise<string> {
  try {
    let pingCommand: string;
    
    if (process.platform === 'win32') {
      pingCommand = `ping -n ${count} ${ip}`;
    } else {
      pingCommand = `ping -c ${count} ${ip}`;
    }
    
    const { stdout } = await execAsync(pingCommand);
    return stdout;
  } catch (error: any) {
    return `Error pinging ${ip}: ${error.message}`;
  }
}

// IPC handlers
ipcMain.handle('get-network-interfaces', async () => {
  return await getNetworkInterfaces();
});

ipcMain.handle('scan-network', async (_, networkRange: string) => {
  return await scanNetwork(networkRange);
});

ipcMain.handle('ping-host', async (_, ip: string, count: number) => {
  return await fullPing(ip, count);
});

ipcMain.handle('get-network-range', async (_, ip: string, netmask: string) => {
  return getNetworkRange(ip, netmask);
});
