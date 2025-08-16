# 🌐 Pingado - Cross-Platform Network Scanner & Ping Utility

[![Release](https://img.shields.io/github/v/release/paulohva/pingado)](https://github.com/paulohva/pingado/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/paulohva/pingado/releases)
[![License](https://img.shields.io/github/license/paulohva/pingado)](LICENSE)

A modern cross-platform desktop application for network discovery and ping testing, built with Electron, React, and TypeScript.

> 🚀 **Ready for production use!** Download the latest release for your platform from the [Releases page](https://github.com/paulohva/pingado/releases).

![Pingado Screenshot](https://via.placeholder.com/800x500/667eea/ffffff?text=Pingado+Network+Scanner)

## Features

- 🔍 **Network Discovery**: Automatically detect and scan your local network interfaces
- 🌐 **IP Scanning**: Discover all active devices on your local network
- 🏓 **Ping Tool**: Test connectivity to any IP address with customizable ping count
- 📊 **Network Statistics**: View detailed information about your network and scan results
- 🎨 **Modern UI**: Beautiful, responsive interface with real-time updates
- 💻 **Cross-Platform**: Works on Windows, macOS, and Linux

## 🚀 Quick Start

1. **Download** the appropriate installer for your platform from [Releases](https://github.com/paulohva/pingado/releases)
2. **Install** by running the installer or extracting the portable version
3. **Launch** Pingado from your Applications folder or desktop
4. **Click "Scan Network"** to discover devices on your local network
5. **Select an IP** and click "Ping" to test connectivity

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

## 📥 Installation

### 🚀 For End Users (Recommended)

**Download pre-built applications from the [Releases page](https://github.com/paulohva/pingado/releases):**

#### macOS
- **Intel Macs**: Download `Pingado-X.X.X.dmg` 
- **Apple Silicon (M1/M2/M3)**: Download `Pingado-X.X.X-arm64.dmg`
- **Portable versions**: Download `.zip` files (no installation required)

#### Windows
- **Installer**: Download `Pingado Setup X.X.X.exe`
- **Portable**: Download `Pingado X.X.X.exe`

#### Linux
- **AppImage**: Download `Pingado-X.X.X.AppImage` (universal)
- **Debian/Ubuntu**: Download `.deb` package
- **RedHat/CentOS**: Download `.rpm` package

### 🛠️ For Developers

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/paulohva/pingado.git
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

### Security & Privacy

- **Context isolation enabled** - Renderer process runs in isolated context
- **Node integration disabled** - Prevents direct Node.js access from renderer
- **Secure IPC communication** - All communication through preload script
- **No data collection** - Application runs entirely locally
- **No external connections** - Only local network scanning and ping
- **Open source** - Full source code available for security review

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

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Reporting Issues
- Use the [GitHub Issues](https://github.com/paulohva/pingado/issues) page
- Include your OS, version, and detailed steps to reproduce
- Attach screenshots if relevant

### 💡 Feature Requests
- Check existing issues first to avoid duplicates
- Describe the feature and its use case
- Consider if it fits the project's scope

### 🔧 Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'feat: add amazing feature'`
5. Push to your fork: `git push origin feature/amazing-feature`
6. Open a Pull Request with a detailed description

### 📋 Development Setup
```bash
# Clone your fork
git clone https://github.com/yourusername/pingado.git
cd pingado

# Install dependencies
npm install

# Start development
npm run dev
```

### 🧪 Testing
- Test on your target platforms
- Verify network scanning and ping functionality
- Check the build process: `npm run build`

Feel free to reach out if you need help getting started!

## 📝 Changelog

### v1.0.0 (Latest)
- 🎉 **Initial Release**
- ✅ Cross-platform network scanning and ping functionality
- ✅ Modern React + TypeScript UI
- ✅ Comprehensive build system for Windows, macOS, and Linux
- ✅ Professional installers and portable versions
- ✅ Complete documentation and troubleshooting guides

### Upcoming Features
- 🔄 Network monitoring with continuous ping
- 📊 Enhanced network statistics and graphs  
- 🎯 Custom ping intervals and packet sizes
- 💾 Export scan results to CSV/JSON
- 🌙 Dark mode theme option

## 🏗️ Built With

- **[Electron](https://electronjs.org/)** - Cross-platform desktop framework
- **[React](https://reactjs.org/)** - UI library for building interfaces
- **[TypeScript](https://typescriptlang.org/)** - Type-safe JavaScript
- **[Webpack](https://webpack.js.org/)** - Module bundler and build tool
- **[electron-builder](https://electron.build/)** - Application packaging and distribution

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/paulohva/pingado)
![GitHub forks](https://img.shields.io/github/forks/paulohva/pingado)
![GitHub issues](https://img.shields.io/github/issues/paulohva/pingado)
![GitHub last commit](https://img.shields.io/github/last-commit/paulohva/pingado)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Made with ❤️ for network administrators and developers</strong>
  <br>
  <a href="https://github.com/paulohva/pingado/releases">Download</a> • 
  <a href="https://github.com/paulohva/pingado/issues">Report Bug</a> • 
  <a href="https://github.com/paulohva/pingado/issues">Request Feature</a>
</div>
