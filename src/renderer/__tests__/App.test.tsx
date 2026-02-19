import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../renderer/App';

const mockNetworkInterfaces = [
  { name: 'Ethernet', address: '192.168.1.100', netmask: '255.255.255.0', family: 'IPv4' },
  { name: 'Wi-Fi', address: '192.168.0.50', netmask: '255.255.255.0', family: 'IPv4' },
];

const mockScanResults = ['192.168.1.1', '192.168.1.10', '192.168.1.50'];
const mockPingResult = `Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=10ms TTL=117
Reply from 8.8.8.8: bytes=32 time=11ms TTL=117
Reply from 8.8.8.8: bytes=32 time=10ms TTL=117
Reply from 8.8.8.8: bytes=32 time=10ms TTL=117
Ping statistics for 8.8.8.8: Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`;

const mockElectronAPI = {
  getNetworkInterfaces: jest.fn().mockResolvedValue(mockNetworkInterfaces),
  scanNetwork: jest.fn().mockResolvedValue(mockScanResults),
  pingHost: jest.fn().mockResolvedValue(mockPingResult),
  getNetworkRange: jest.fn().mockResolvedValue('192.168.1.0/24'),
};

Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true,
});

async function renderApp() {
  await act(async () => {
    render(<App />);
  });
}

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app with correct title', async () => {
    await renderApp();
    expect(screen.getByText('Pingado')).toBeInTheDocument();
    expect(screen.getByText('Network Scanner & Ping Utility')).toBeInTheDocument();
  });

  it('renders Network Discovery section', async () => {
    await renderApp();
    expect(screen.getByText('🔍 Network Discovery')).toBeInTheDocument();
  });

  it('renders Ping Tool section', async () => {
    await renderApp();
    expect(screen.getByText('🏓 Ping Tool')).toBeInTheDocument();
  });

  it('loads network interfaces on mount', async () => {
    await renderApp();
    expect(mockElectronAPI.getNetworkInterfaces).toHaveBeenCalled();
  });

  it('displays network interfaces', async () => {
    await renderApp();
    expect(screen.getByText('Ethernet')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
  });

  it('has Scan Network button', async () => {
    await renderApp();
    expect(screen.getByRole('button', { name: /scan network/i })).toBeInTheDocument();
  });

  it('has Ping button', async () => {
    await renderApp();
    expect(screen.getByRole('button', { name: /^ping$/i })).toBeInTheDocument();
  });

  it('has IP input field', async () => {
    await renderApp();
    expect(screen.getByPlaceholderText(/enter ip address/i)).toBeInTheDocument();
  });

  it('has ping count input', async () => {
    await renderApp();
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('calls scanNetwork when Scan Network button is clicked', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    await act(async () => {
      fireEvent.click(scanButton);
    });

    expect(mockElectronAPI.getNetworkRange).toHaveBeenCalledWith(
      '192.168.1.100',
      '255.255.255.0'
    );
    expect(mockElectronAPI.scanNetwork).toHaveBeenCalledWith('192.168.1.0/24');
  });

  it('displays scan results after scanning', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    await act(async () => {
      fireEvent.click(scanButton);
    });

    expect(screen.getByText(/3 found/)).toBeInTheDocument();
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.10')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.50')).toBeInTheDocument();
  });

  it('calls pingHost when Ping button is clicked with custom IP', async () => {
    await renderApp();

    const ipInput = screen.getByPlaceholderText(/enter ip address/i);
    fireEvent.change(ipInput, { target: { value: '8.8.8.8' } });

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    await act(async () => {
      fireEvent.click(pingButton);
    });

    expect(mockElectronAPI.pingHost).toHaveBeenCalledWith('8.8.8.8', 4);
  });

  it('calls pingHost with selected IP from scan results', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    await act(async () => {
      fireEvent.click(scanButton);
    });

    const ipItem = screen.getByText('192.168.1.1');
    fireEvent.click(ipItem);

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    await act(async () => {
      fireEvent.click(pingButton);
    });

    expect(mockElectronAPI.pingHost).toHaveBeenCalledWith('192.168.1.1', 4);
  });

  it('displays ping results after pinging', async () => {
    await renderApp();

    const ipInput = screen.getByPlaceholderText(/enter ip address/i);
    fireEvent.change(ipInput, { target: { value: '8.8.8.8' } });

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    await act(async () => {
      fireEvent.click(pingButton);
    });

    expect(screen.getByText(/Ping Results:/)).toBeInTheDocument();
  });

  it('shows loading state during network scan', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    fireEvent.click(scanButton);

    expect(screen.getByText(/scanning network/i)).toBeInTheDocument();

    await act(async () => {});
  });

  it('shows loading state during ping', async () => {
    await renderApp();

    const ipInput = screen.getByPlaceholderText(/enter ip address/i);
    fireEvent.change(ipInput, { target: { value: '8.8.8.8' } });

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    fireEvent.click(pingButton);

    expect(screen.getByText('Pinging...')).toBeInTheDocument();

    await act(async () => {});
  });

  it('updates ping count when input changes', async () => {
    await renderApp();

    const inputs = screen.getAllByRole('spinbutton');
    const pingCountInput = inputs[0];
    
    fireEvent.change(pingCountInput, { target: { value: '2' } });

    const ipInput = screen.getByPlaceholderText(/enter ip address/i);
    fireEvent.change(ipInput, { target: { value: '8.8.8.8' } });

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    await act(async () => {
      fireEvent.click(pingButton);
    });

    expect(mockElectronAPI.pingHost).toHaveBeenCalledWith('8.8.8.8', 2);
  });

  it('disables Scan button when scanning', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    fireEvent.click(scanButton);

    expect(scanButton).toBeDisabled();

    await act(async () => {});
  });

  it('disables Ping button when no IP is selected or entered', async () => {
    await renderApp();

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    expect(pingButton).toBeDisabled();
  });

  it('enables Ping button when custom IP is entered', async () => {
    await renderApp();

    const ipInput = screen.getByPlaceholderText(/enter ip address/i);
    fireEvent.change(ipInput, { target: { value: '8.8.8.8' } });

    const pingButton = screen.getByRole('button', { name: /^ping$/i });
    expect(pingButton).not.toBeDisabled();
  });

  it('shows Network Statistics after scan', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    await act(async () => {
      fireEvent.click(scanButton);
    });

    expect(screen.getByText('📊 Network Statistics')).toBeInTheDocument();
  });

  it('displays correct active hosts count', async () => {
    await renderApp();

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    await act(async () => {
      fireEvent.click(scanButton);
    });

    expect(screen.getByText('Active Hosts')).toBeInTheDocument();
  });

  it('selects network interface when clicked', async () => {
    await renderApp();

    const wifiOption = screen.getByText('Wi-Fi');
    fireEvent.click(wifiOption);

    const scanButton = screen.getByRole('button', { name: /scan network/i });
    await act(async () => {
      fireEvent.click(scanButton);
    });

    expect(mockElectronAPI.getNetworkRange).toHaveBeenCalledWith(
      '192.168.0.50',
      '255.255.255.0'
    );
  });
});
