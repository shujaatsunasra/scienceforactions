#!/bin/bash

# Deploy to GitHub Pages
echo "🚀 Starting deployment to GitHub Pages..."

# Build the project
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Add all changes
    git add .
    
    # Commit changes
    git commit -m "Deploy to GitHub Pages - $(date)"
    
    # Push to GitHub
    git push origin main
    
    echo "🚀 Deployment initiated! Check GitHub Actions for progress."
    echo "🌐 Your site will be available at: https://shujaatsunasra.github.io/scienceforactions/"
else
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi 