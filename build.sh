#!/bin/bash

# Pingado - Cross-Platform Build Script
# Builds platform-specific executables for Windows, macOS, and Linux

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | sed 's/v//')
    REQUIRED_VERSION="16.0.0"
    
    if ! command_exists python3 &> /dev/null; then
        if command -v python3 -c "import sys; exit(0 if sys.version_info >= (3,6) else 1)" &> /dev/null; then
            print_warning "Python 3.6+ not found. Some native modules may fail to build."
        fi
    fi
    
    print_success "Prerequisites check passed"
}

# Clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    rm -rf dist/
    rm -rf release/
    print_success "Clean completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build the application
build_app() {
    print_status "Building application..."
    npm run build
    print_success "Application built"
}

# Build for specific platform
build_platform() {
    local platform=$1
    print_status "Building for $platform..."
    
    case $platform in
        "windows"|"win")
            npm run dist:win
            print_success "Windows build completed: release/*.exe"
            ;;
        "macos"|"mac"|"darwin")
            npm run dist:mac
            print_success "macOS build completed: release/*.dmg, release/*.zip"
            ;;
        "linux")
            npm run dist:linux
            print_success "Linux build completed: release/*.AppImage, release/*.deb, release/*.rpm"
            ;;
        "all")
            npm run dist:all
            print_success "All platform builds completed"
            ;;
        *)
            print_error "Unknown platform: $platform"
            print_status "Available platforms: windows, macos, linux, all"
            exit 1
            ;;
    esac
}

# Show build results
show_results() {
    print_status "Build Results:"
    echo ""
    
    if [ -d "release" ]; then
        ls -la release/ | grep -E '\.(exe|dmg|zip|AppImage|deb|rpm)$' | while read -r line; do
            filename=$(echo "$line" | awk '{print $9}')
            size=$(echo "$line" | awk '{print $5}')
            print_success "✓ $filename ($size bytes)"
        done
    else
        print_warning "No release directory found"
    fi
    
    echo ""
    print_status "Build artifacts are in the 'release/' directory"
}

# Main function
main() {
    echo -e "${BLUE}"
    echo "🌐 Pingado - Cross-Platform Network Scanner"
    echo "=========================================="
    echo -e "${NC}"
    
    # Parse command line arguments
    PLATFORM="all"
    SKIP_DEPS=false
    SKIP_CLEAN=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--platform)
                PLATFORM="$2"
                shift 2
                ;;
            --skip-deps)
                SKIP_DEPS=true
                shift
                ;;
            --skip-clean)
                SKIP_CLEAN=true
                shift
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  -p, --platform PLATFORM    Build for specific platform (windows|macos|linux|all)"
                echo "  --skip-deps                Skip dependency installation"
                echo "  --skip-clean               Skip cleaning previous builds"
                echo "  -h, --help                 Show this help message"
                echo ""
                echo "Examples:"
                echo "  $0                         Build for all platforms"
                echo "  $0 -p windows              Build for Windows only"
                echo "  $0 -p macos --skip-deps    Build for macOS, skip deps"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    # Execute build process
    check_prerequisites
    
    if [ "$SKIP_CLEAN" = false ]; then
        clean_builds
    fi
    
    if [ "$SKIP_DEPS" = false ]; then
        install_dependencies
    fi
    
    build_app
    build_platform "$PLATFORM"
    show_results
    
    echo ""
    print_success "🎉 Build process completed successfully!"
    echo ""
}

# Run main function with all arguments
main "$@"
