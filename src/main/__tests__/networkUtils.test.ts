import * as os from 'os';

function getNetworkRange(ip: string, netmask: string): string {
  const ipParts = ip.split('.').map(Number);
  const maskParts = netmask.split('.').map(Number);
  
  const networkParts = ipParts.map((part, index) => part & maskParts[index]);
  
  const cidr = maskParts.reduce((acc, part) => {
    return acc + part.toString(2).split('1').length - 1;
  }, 0);
  
  return `${networkParts.join('.')}/${cidr}`;
}

function getNetworkInterfaces() {
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

describe('Network Utilities', () => {
  describe('getNetworkRange', () => {
    it('should calculate correct network range for /24 subnet', () => {
      const result = getNetworkRange('192.168.1.100', '255.255.255.0');
      expect(result).toBe('192.168.1.0/24');
    });

    it('should calculate correct network range for /16 subnet', () => {
      const result = getNetworkRange('192.168.100.50', '255.255.0.0');
      expect(result).toBe('192.168.0.0/16');
    });

    it('should calculate correct network range for /8 subnet', () => {
      const result = getNetworkRange('10.50.100.200', '255.0.0.0');
      expect(result).toBe('10.0.0.0/8');
    });

    it('should calculate correct network range for /32 subnet', () => {
      const result = getNetworkRange('192.168.1.1', '255.255.255.255');
      expect(result).toBe('192.168.1.1/32');
    });

    it('should handle 10.x.x.x private network', () => {
      const result = getNetworkRange('10.0.0.50', '255.255.255.0');
      expect(result).toBe('10.0.0.0/24');
    });

    it('should handle 172.16.x.x private network range', () => {
      const result = getNetworkRange('172.16.5.10', '255.255.0.0');
      expect(result).toBe('172.16.0.0/16');
    });

    it('should handle different IP within same subnet', () => {
      const result = getNetworkRange('192.168.1.250', '255.255.255.0');
      expect(result).toBe('192.168.1.0/24');
    });

    it('should return correct CIDR for /25 subnet', () => {
      const result = getNetworkRange('192.168.1.128', '255.255.255.128');
      expect(result).toBe('192.168.1.128/25');
    });

    it('should return correct CIDR for /26 subnet', () => {
      const result = getNetworkRange('192.168.1.64', '255.255.255.192');
      expect(result).toBe('192.168.1.64/26');
    });

    it('should return correct CIDR for /27 subnet', () => {
      const result = getNetworkRange('192.168.1.32', '255.255.255.224');
      expect(result).toBe('192.168.1.32/27');
    });

    it('should return correct CIDR for /28 subnet', () => {
      const result = getNetworkRange('192.168.1.16', '255.255.255.240');
      expect(result).toBe('192.168.1.16/28');
    });
  });

  describe('getNetworkInterfaces', () => {
    it('should return an array', () => {
      const result = getNetworkInterfaces();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return interfaces with required properties', () => {
      const result = getNetworkInterfaces();
      if (result.length > 0) {
        result.forEach((iface) => {
          expect(iface).toHaveProperty('name');
          expect(iface).toHaveProperty('address');
          expect(iface).toHaveProperty('netmask');
          expect(iface).toHaveProperty('family');
        });
      }
    });

    it('should only return IPv4 interfaces', () => {
      const result = getNetworkInterfaces();
      result.forEach((iface) => {
        expect(iface.family).toBe('IPv4');
      });
    });

    it('should exclude internal interfaces', () => {
      const result = getNetworkInterfaces();
      result.forEach((iface) => {
        expect(iface.address).not.toBe('127.0.0.1');
      });
    });
  });
});
