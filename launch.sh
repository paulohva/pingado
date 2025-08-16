#!/bin/bash

# Pingado Network Scanner Launch Script

echo "🌐 Starting Pingado Network Scanner..."
echo "======================================="

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the application in development mode
echo "Launching application..."
npm run dev

echo "Application closed."
