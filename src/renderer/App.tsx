import React, { useState, useEffect } from 'react';
import { NetworkInterface } from './types';
import iconSvg from './icon.svg';

const App: React.FC = () => {
  const [networkInterfaces, setNetworkInterfaces] = useState<NetworkInterface[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<NetworkInterface | null>(null);
  const [availableIPs, setAvailableIPs] = useState<string[]>([]);
  const [selectedIP, setSelectedIP] = useState<string>('');
  const [customIP, setCustomIP] = useState<string>('');
  const [pingCount, setPingCount] = useState<number>(4);
  const [pingResults, setPingResults] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [scanTime, setScanTime] = useState<number>(0);

  useEffect(() => {
    loadNetworkInterfaces();
  }, []);

  const loadNetworkInterfaces = async () => {
    try {
      const interfaces = await window.electronAPI.getNetworkInterfaces();
      setNetworkInterfaces(interfaces);
      if (interfaces.length > 0) {
        setSelectedInterface(interfaces[0]);
      }
    } catch (error) {
      console.error('Error loading network interfaces:', error);
    }
  };

  const handleScanNetwork = async () => {
    if (!selectedInterface) return;

    setIsScanning(true);
    setAvailableIPs([]);
    const startTime = Date.now();

    try {
      const networkRange = await window.electronAPI.getNetworkRange(
        selectedInterface.address,
        selectedInterface.netmask
      );
      
      const ips = await window.electronAPI.scanNetwork(networkRange);
      setAvailableIPs(ips);
      setScanTime(Date.now() - startTime);
    } catch (error) {
      console.error('Error scanning network:', error);
      setPingResults(`Error scanning network: ${error}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePing = async () => {
    const targetIP = selectedIP || customIP;
    if (!targetIP) return;

    setIsPinging(true);
    setPingResults('');

    try {
      const result = await window.electronAPI.pingHost(targetIP, pingCount);
      setPingResults(result);
    } catch (error) {
      setPingResults(`Error pinging ${targetIP}: ${error}`);
    } finally {
      setIsPinging(false);
    }
  };

  const handleIPSelect = (ip: string) => {
    setSelectedIP(ip);
    setCustomIP('');
  };

  const handleCustomIPChange = (value: string) => {
    setCustomIP(value);
    setSelectedIP('');
  };

  return (
    <div className="app">
      <div className="header">
        <h1>
          <img src={iconSvg} alt="Pingado" className="app-icon" />
          Pingado
        </h1>
        <p>Network Scanner & Ping Utility</p>
      </div>

      <div className="main-content">
        <div className="card">
          <h2>🔍 Network Discovery</h2>
          
          <div className="network-interfaces">
            <h3>Select Network Interface:</h3>
            {networkInterfaces.map((iface, index) => (
              <div
                key={index}
                className={`interface-item ${selectedInterface === iface ? 'selected' : ''}`}
                onClick={() => setSelectedInterface(iface)}
              >
                <div className="interface-name">{iface.name}</div>
                <div className="interface-details">
                  {iface.address} / {iface.netmask}
                </div>
              </div>
            ))}
          </div>

          <button
            className="scan-button"
            onClick={handleScanNetwork}
            disabled={!selectedInterface || isScanning}
          >
            {isScanning ? (
              <div className="loading">
                <div className="spinner"></div>
                Scanning Network...
              </div>
            ) : (
              'Scan Network'
            )}
          </button>

          {availableIPs.length > 0 && (
            <div>
              <h3>Available IPs ({availableIPs.length} found):</h3>
              <div className="ip-list">
                {availableIPs.map((ip) => (
                  <div
                    key={ip}
                    className={`ip-item ${selectedIP === ip ? 'selected' : ''}`}
                    onClick={() => handleIPSelect(ip)}
                  >
                    <div className="ip-status"></div>
                    {ip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>🏓 Ping Tool</h2>
          
          <div className="ping-controls">
            <input
              type="text"
              className="ping-input"
              placeholder="Enter IP address or select from list"
              value={customIP}
              onChange={(e) => handleCustomIPChange(e.target.value)}
            />
            <input
              type="number"
              className="ping-count"
              min="1"
              max="10"
              value={pingCount}
              onChange={(e) => setPingCount(parseInt(e.target.value) || 4)}
            />
            <button
              className="ping-button"
              onClick={handlePing}
              disabled={(!selectedIP && !customIP) || isPinging}
            >
              {isPinging ? 'Pinging...' : 'Ping'}
            </button>
          </div>

          {selectedIP && (
            <div style={{ marginBottom: '15px', padding: '10px', background: '#e7f3ff', borderRadius: '6px' }}>
              Selected IP: <strong>{selectedIP}</strong>
            </div>
          )}

          {pingResults && (
            <div>
              <h3>Ping Results:</h3>
              <div className="ping-results">
                {pingResults}
              </div>
            </div>
          )}
        </div>
      </div>

      {(availableIPs.length > 0 || scanTime > 0) && (
        <div className="card full-width-card">
          <h2>📊 Network Statistics</h2>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-value">{availableIPs.length}</div>
              <div className="stat-label">Active Hosts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{networkInterfaces.length}</div>
              <div className="stat-label">Network Interfaces</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{(scanTime / 1000).toFixed(1)}s</div>
              <div className="stat-label">Last Scan Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{selectedInterface?.address || 'N/A'}</div>
              <div className="stat-label">Local IP</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
