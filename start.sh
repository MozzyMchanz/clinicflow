#!/bin/bash

echo "========================================"
echo "  ClinicFlow - Starting Server"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "Starting ClinicFlow server..."
echo ""
echo "Open your browser and go to: http://localhost:3000"
echo ""
echo "Demo Login:"
echo "  Email:    admin@clinic.com"
echo "  Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"

node server.js
