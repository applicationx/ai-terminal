#!/bin/bash

# Exit on error
set -e

echo "Setting up AI Terminal environment..."

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux/WSL system."
    
    # Check for apt-get
    if command -v apt-get &> /dev/null; then
        echo "Installing system dependencies for Electron..."
        sudo apt-get update
        # Ubuntu 24.04 (Noble) uses t64 package suffix for time_t 64-bit compatibility
        sudo apt-get install -y libnss3 libnspr4 libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
            libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64
    else
        echo "Warning: apt-get not found. Please install the following libraries manually if running on Linux:"
        echo "libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2"
    fi
fi

echo "Installing project dependencies..."
npm install

echo "Setup complete! You can now run 'npm start' to launch the terminal."
