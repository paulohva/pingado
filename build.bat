@echo off
REM Pingado - Windows Build Script
REM Builds platform-specific executables

setlocal enabledelayedexpansion

echo.
echo 🌐 Pingado - Cross-Platform Network Scanner
echo ==========================================
echo.

REM Parse command line arguments
set PLATFORM=all
set SKIP_DEPS=false
set SKIP_CLEAN=false

:parse_args
if "%~1"=="" goto end_parse
if "%~1"=="-p" (
    set PLATFORM=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--platform" (
    set PLATFORM=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--skip-deps" (
    set SKIP_DEPS=true
    shift
    goto parse_args
)
if "%~1"=="--skip-clean" (
    set SKIP_CLEAN=true
    shift
    goto parse_args
)
if "%~1"=="-h" goto show_help
if "%~1"=="--help" goto show_help
echo [ERROR] Unknown option: %~1
echo Use --help for usage information
exit /b 1

:show_help
echo Usage: %0 [OPTIONS]
echo.
echo Options:
echo   -p, --platform PLATFORM    Build for specific platform (windows^|macos^|linux^|all)
echo   --skip-deps                Skip dependency installation
echo   --skip-clean               Skip cleaning previous builds
echo   -h, --help                 Show this help message
echo.
echo Examples:
echo   %0                         Build for all platforms
echo   %0 -p windows              Build for Windows only
echo   %0 -p macos --skip-deps    Build for macOS, skip deps
exit /b 0

:end_parse

REM Check prerequisites
echo [INFO] Checking prerequisites...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    exit /b 1
)

echo [SUCCESS] Prerequisites check passed

REM Clean previous builds
if "%SKIP_CLEAN%"=="false" (
    echo [INFO] Cleaning previous builds...
    if exist dist rmdir /s /q dist
    if exist release rmdir /s /q release
    echo [SUCCESS] Clean completed
)

REM Install dependencies
if "%SKIP_DEPS%"=="false" (
    echo [INFO] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed
)

REM Build the application
echo [INFO] Building application...
call npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build application
    exit /b 1
)
echo [SUCCESS] Application built

REM Build for specific platform
echo [INFO] Building for %PLATFORM%...

if "%PLATFORM%"=="windows" (
    call npm run dist:win
    echo [SUCCESS] Windows build completed: release/*.exe
) else if "%PLATFORM%"=="win" (
    call npm run dist:win
    echo [SUCCESS] Windows build completed: release/*.exe
) else if "%PLATFORM%"=="macos" (
    call npm run dist:mac
    echo [SUCCESS] macOS build completed: release/*.dmg, release/*.zip
) else if "%PLATFORM%"=="mac" (
    call npm run dist:mac
    echo [SUCCESS] macOS build completed: release/*.dmg, release/*.zip
) else if "%PLATFORM%"=="darwin" (
    call npm run dist:mac
    echo [SUCCESS] macOS build completed: release/*.dmg, release/*.zip
) else if "%PLATFORM%"=="linux" (
    call npm run dist:linux
    echo [SUCCESS] Linux build completed: release/*.AppImage, release/*.deb, release/*.rpm
) else if "%PLATFORM%"=="all" (
    call npm run dist:all
    echo [SUCCESS] All platform builds completed
) else (
    echo [ERROR] Unknown platform: %PLATFORM%
    echo [INFO] Available platforms: windows, macos, linux, all
    exit /b 1
)

if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)

REM Show build results
echo.
echo [INFO] Build Results:
echo.

if exist release (
    for %%f in (release\*.exe release\*.dmg release\*.zip release\*.AppImage release\*.deb release\*.rpm) do (
        if exist "%%f" (
            echo [SUCCESS] ✓ %%~nxf
        )
    )
) else (
    echo [WARNING] No release directory found
)

echo.
echo [INFO] Build artifacts are in the 'release/' directory
echo.
echo [SUCCESS] 🎉 Build process completed successfully!
echo.
