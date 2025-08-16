# Pingado - Network Scanner & Ping Utility

A cross-platform desktop application for network discovery and ping testing, built with Electron, React, and TypeScript.

## Features

- 🔍 **Network Discovery**: Automatically detect and scan your local network interfaces
- 🌐 **IP Scanning**: Discover all active devices on your local network
- 🏓 **Ping Tool**: Test connectivity to any IP address with customizable ping count
- 📊 **Network Statistics**: View detailed information about your network and scan results
- 🎨 **Modern UI**: Beautiful, responsive interface with real-time updates
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux

## System Requirements

### Operating System Support
- ✅ **macOS** 10.13 (High Sierra) or later
- ✅ **Windows** 10 or later (Windows 11 recommended)
- ✅ **Linux** Ubuntu 18.04+, Fedora 32+, or equivalent

### Software Prerequisites

#### Required
- **Node.js** version 16.x or higher (18.x+ recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version` should show v16.0.0 or higher
- **npm** version 8.x or higher (included with Node.js)
  - Verify: `npm --version` should show 8.0.0 or higher

#### Platform-Specific Requirements

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`
- Python 3.x (usually pre-installed)

**Windows:**
- Windows Build Tools (automatically installed with npm packages)
- PowerShell or Command Prompt (Administrator privileges may be required)

**Linux:**
- Build essentials: `sudo apt-get install build-essential` (Ubuntu/Debian)
- Python 3.x and pip
- libgtk-3-dev: `sudo apt-get install libgtk-3-dev`

### Network Requirements
- **Ping command** must be available in system PATH
  - macOS/Linux: Built-in
  - Windows: Built-in (cmd: `ping`, PowerShell: `Test-NetConnection`)
- **Local network access** for network scanning functionality
- **Firewall permissions** may be required for ping operations

## Installation

### Quick Start

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd pingado
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm run dev
   ```
   OR use the launch script:
   ```bash
   ./launch.sh
   ```

### Detailed Setup

1. **Verify Node.js installation**
   ```bash
   node --version  # Should be v16.0.0 or higher
   npm --version   # Should be 8.0.0 or higher
   ```

2. **Install dependencies with verbose output** (if issues occur)
   ```bash
   npm install --verbose
   ```

3. **Build the application** (optional, for testing)
   ```bash
   npm run build
   ```

## Development

### Running in Development Mode

```bash
npm run dev
```

This will start both the Electron main process and the React development server. The app will automatically reload when you make changes.

### Building for Production

```bash
npm run build
```

### Creating Distribution Packages

#### Quick Build (All Platforms)
```bash
npm run dist
```

#### Platform-Specific Builds
```bash
# Windows only
npm run dist:win

# macOS only  
npm run dist:mac

# Linux only
npm run dist:linux

# All platforms
npm run dist:all
```

#### Using Build Scripts (Recommended)

**Unix/Linux/macOS:**
```bash
# Build for all platforms
./build.sh

# Build for specific platform
./build.sh -p windows
./build.sh -p macos
./build.sh -p linux

# Skip dependency installation (faster rebuilds)
./build.sh --skip-deps

# Show help
./build.sh --help
```

**Windows:**
```cmd
REM Build for all platforms
build.bat

REM Build for specific platform
build.bat -p windows
build.bat -p macos
build.bat -p linux

REM Skip dependency installation
build.bat --skip-deps

REM Show help
build.bat --help
```

#### Build Output

This will create platform-specific installers in the `release/` directory:

**Windows:**
- `Pingado Setup X.X.X.exe` - NSIS installer
- `Pingado X.X.X.exe` - Portable executable

**macOS:**
- `Pingado-X.X.X.dmg` - Disk image installer
- `Pingado-X.X.X-mac.zip` - ZIP archive

**Linux:**
- `Pingado-X.X.X.AppImage` - Portable AppImage
- `pingado_X.X.X_amd64.deb` - Debian package
- `pingado-X.X.X.x86_64.rpm` - RPM package

## Usage

### Network Discovery

1. **Select Network Interface**: Choose from your available network interfaces
2. **Scan Network**: Click "Scan Network" to discover all active devices
3. **View Results**: See all discovered IP addresses in the list

### Ping Testing

1. **Select Target**: Either click an IP from the discovered list or enter a custom IP
2. **Set Ping Count**: Choose how many ping packets to send (1-10)
3. **Start Ping**: Click "Ping" to test connectivity
4. **View Results**: See detailed ping statistics in the terminal-style output

### Features

- **Real-time Scanning**: Network discovery happens in real-time with progress indicators
- **Cross-platform Compatibility**: Uses appropriate ping commands for each operating system
- **Responsive Design**: Works well on different screen sizes
- **Network Statistics**: View comprehensive information about your network setup

## Technical Details

### Architecture

- **Frontend**: React with TypeScript for the user interface
- **Backend**: Electron main process handles system operations
- **IPC Communication**: Secure communication between renderer and main processes
- **Network Operations**: Uses system ping commands for maximum compatibility

### Platform Support

- **Windows**: Uses `ping -n` command
- **macOS/Linux**: Uses `ping -c` command
- **All Platforms**: Automatic network interface detection

### Security

- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC communication through preload script

## Development Scripts

- `npm run dev` - Start development environment
- `npm run build` - Build for production
- `npm run dist` - Create distribution packages
- `npm run pack` - Create unpacked distribution
- `npm start` - Start the built application

## Troubleshooting

### Launch Script Issues

**macOS/Linux:**
```bash
# Make the script executable
chmod +x launch.sh

# If permission denied:
sudo chmod +x launch.sh

# Run with explicit shell
bash launch.sh
```

**Windows:**
```powershell
# Use PowerShell or Git Bash
# Or run directly:
npm run dev
```

### Common Issues

#### Installation Problems
1. **Node.js Version Error**
   ```bash
   # Check version
   node --version
   
   # If too old, update Node.js from nodejs.org
   # Or use Node Version Manager (nvm)
   ```

2. **npm Install Failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Python/Build Tools Missing**
   ```bash
   # Windows (run as Administrator)
   npm install --global windows-build-tools
   
   # macOS
   xcode-select --install
   
   # Linux (Ubuntu/Debian)
   sudo apt-get install build-essential python3-dev
   ```

#### Runtime Issues
1. **Permission Errors**: On some systems, ping commands may require elevated privileges
   - **Windows**: Run as Administrator
   - **macOS/Linux**: May need `sudo` for some network operations

2. **Firewall Blocking**: Ensure your firewall allows ping requests
   - Check system firewall settings
   - Some corporate networks block ping

3. **Network Discovery Issues**: Some devices may not respond to ping requests
   - Devices with strict security settings
   - IoT devices that don't respond to ping
   - VPN connections may interfere

4. **Port Already in Use**
   ```bash
   # Kill existing processes
   npm run cleanup
   
   # Or manually:
   pkill -f webpack
   pkill -f electron
   ```

#### Electron Window Issues
1. **Empty/Blank Window**
   - Check developer console for JavaScript errors
   - Ensure React components are loading
   - Verify webpack dev server is running on port 3000

2. **Window Not Opening**
   - Check if Electron process is running
   - Look for error messages in terminal
   - Try: `npm run cleanup && npm run dev`

### Platform-Specific Notes

**Windows:**
- May require running as Administrator for network operations
- Use PowerShell or Command Prompt
- Windows Defender may flag the application initially

**macOS:**
- Firewall settings may affect network discovery
- Gatekeeper may require allowing the app to run
- Network permissions dialog may appear

**Linux:**
- Some distributions require additional network permissions
- AppImage format for distribution
- May need to install additional GTK dependencies

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Try the cleanup command: `npm run cleanup`
4. Restart with: `npm run dev`

**Debug Mode:**
```bash
# Run with verbose output
npm run dev --verbose

# Check webpack compilation
npm run build
```

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application.

## License

MIT License - see LICENSE file for details.
