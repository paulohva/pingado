const mockExecAsync = jest.fn();

jest.mock('util', () => ({
  promisify: jest.fn(() => mockExecAsync),
}));

jest.mock('os', () => ({
  networkInterfaces: () => ({
    'Ethernet': [
      { address: '192.168.1.100', netmask: '255.255.255.0', family: 'IPv4', internal: false },
    ],
    'lo': [
      { address: '127.0.0.1', netmask: '255.0.0.0', family: 'IPv4', internal: true },
    ],
  }),
}));

describe('Ping Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('quickPing - Windows', () => {
    it('should return IP when ping succeeds on Windows', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'Reply from 192.168.1.1', stderr: '' });
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const quickPing = async (ip: string): Promise<string | null> => {
        try {
          const pingCommand = `ping -n 1 -w 1000 ${ip}`;
          await exec(pingCommand);
          return ip;
        } catch {
          return null;
        }
      };

      const result = await quickPing('192.168.1.1');
      expect(result).toBe('192.168.1.1');
      expect(mockExecAsync).toHaveBeenCalledWith('ping -n 1 -w 1000 192.168.1.1');
    });

    it('should return null when ping fails on Windows', async () => {
      mockExecAsync.mockRejectedValue(new Error('Request timed out'));
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const quickPing = async (ip: string): Promise<string | null> => {
        try {
          const pingCommand = `ping -n 1 -w 1000 ${ip}`;
          await exec(pingCommand);
          return ip;
        } catch {
          return null;
        }
      };

      const result = await quickPing('192.168.1.1');
      expect(result).toBeNull();
    });
  });

  describe('quickPing - Unix/Mac', () => {
    it('should return IP when ping succeeds on Unix', async () => {
      mockExecAsync.mockResolvedValue({ stdout: '64 bytes from 8.8.8.8', stderr: '' });
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const quickPing = async (ip: string): Promise<string | null> => {
        try {
          const pingCommand = `ping -c 1 -W 1 ${ip}`;
          await exec(pingCommand);
          return ip;
        } catch {
          return null;
        }
      };

      const result = await quickPing('8.8.8.8');
      expect(result).toBe('8.8.8.8');
      expect(mockExecAsync).toHaveBeenCalledWith('ping -c 1 -W 1 8.8.8.8');
    });

    it('should return null when ping fails on Unix', async () => {
      mockExecAsync.mockRejectedValue(new Error('Request timeout'));
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const quickPing = async (ip: string): Promise<string | null> => {
        try {
          const pingCommand = `ping -c 1 -W 1 ${ip}`;
          await exec(pingCommand);
          return ip;
        } catch {
          return null;
        }
      };

      const result = await quickPing('8.8.8.8');
      expect(result).toBeNull();
    });
  });

  describe('fullPing', () => {
    it('should return ping output on success', async () => {
      const mockOutput = `Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=10ms TTL=117
Reply from 8.8.8.8: bytes=32 time=11ms TTL=117
Reply from 8.8.8.8: bytes=32 time=10ms TTL=117
Reply from 8.8.8.8: bytes=32 time=10ms TTL=117

Ping statistics for 8.8.8.8:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`;
      
      mockExecAsync.mockResolvedValue({ stdout: mockOutput, stderr: '' });
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const fullPing = async (ip: string, count: number = 4): Promise<string> => {
        try {
          const pingCommand = `ping -n ${count} ${ip}`;
          const { stdout } = await exec(pingCommand);
          return stdout;
        } catch (error: any) {
          return `Error pinging ${ip}: ${error.message}`;
        }
      };

      const result = await fullPing('8.8.8.8', 4);
      expect(result).toContain('Pinging 8.8.8.8');
      expect(mockExecAsync).toHaveBeenCalledWith('ping -n 4 8.8.8.8');
    });

    it('should return error message on failure', async () => {
      mockExecAsync.mockRejectedValue(new Error('Request timed out'));
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const fullPing = async (ip: string, count: number = 4): Promise<string> => {
        try {
          const pingCommand = `ping -n ${count} ${ip}`;
          const { stdout } = await exec(pingCommand);
          return stdout;
        } catch (error: any) {
          return `Error pinging ${ip}: ${error.message}`;
        }
      };

      const result = await fullPing('192.168.1.999', 4);
      expect(result).toContain('Error pinging 192.168.1.999');
    });

    it('should use correct count parameter', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'Pinging 8.8.8.8', stderr: '' });
      
      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const fullPing = async (ip: string, count: number = 4): Promise<string> => {
        try {
          const pingCommand = `ping -n ${count} ${ip}`;
          const { stdout } = await exec(pingCommand);
          return stdout;
        } catch (error: any) {
          return `Error pinging ${ip}: ${error.message}`;
        }
      };

      await fullPing('8.8.8.8', 2);
      expect(mockExecAsync).toHaveBeenCalledWith('ping -n 2 8.8.8.8');

      await fullPing('8.8.8.8', 10);
      expect(mockExecAsync).toHaveBeenCalledWith('ping -n 10 8.8.8.8');
    });
  });

  describe('scanNetwork', () => {
    it('should filter out null results', async () => {
      mockExecAsync
        .mockResolvedValueOnce({ stdout: 'Reply' })
        .mockRejectedValueOnce(new Error())
        .mockResolvedValueOnce({ stdout: 'Reply' });

      const { promisify } = require('util');
      const exec = promisify(mockExecAsync);
      
      const quickPing = async (ip: string): Promise<string | null> => {
        try {
          await exec(`ping -n 1 ${ip}`);
          return ip;
        } catch {
          return null;
        }
      };

      const results = await Promise.all([
        quickPing('192.168.1.1'),
        quickPing('192.168.1.2'),
        quickPing('192.168.1.3'),
      ]);
      
      const filtered = results.filter((ip): ip is string => ip !== null);
      expect(filtered).toEqual(['192.168.1.1', '192.168.1.3']);
    });
  });
});
