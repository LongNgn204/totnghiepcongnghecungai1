#!/bin/bash

# Cloudflare Workers Deployment Script
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-development}
PROJECT_NAME="ai-hoc-tap-api"

echo "🚀 Deploying $PROJECT_NAME to $ENVIRONMENT..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI is not installed${NC}"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

# Check if wrangler.toml exists
if [ ! -f "wrangler.toml" ]; then
    echo -e "${RED}❌ wrangler.toml not found${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Check Gemini API Key
echo -e "${YELLOW}🔑 Checking Gemini API Key...${NC}"
if wrangler secret list | grep -q "GEMINI_API_KEY"; then
    echo -e "${GREEN}✓ GEMINI_API_KEY is set${NC}"
else
    echo -e "${YELLOW}⚠️  GEMINI_API_KEY not found${NC}"
    echo "You need to set it with:"
    echo "  wrangler secret put GEMINI_API_KEY"
    echo ""
    read -p "Set it now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        wrangler secret put GEMINI_API_KEY
    fi
fi
echo ""

# Step 3: Check Database
echo -e "${YELLOW}[object Object]Checking database...${NC}"
if wrangler d1 list | grep -q "ai-hoc-tap-db"; then
    echo -e "${GREEN}✓ Database exists${NC}"
else
    echo -e "${YELLOW}⚠️  Database not found${NC}"
    echo "Creating database..."
    wrangler d1 create ai-hoc-tap-db
fi
echo ""

# Step 4: Build (if needed)
echo -e "${YELLOW[object Object] Building...${NC}"
# TypeScript is compiled by wrangler automatically
echo -e "${GREEN}✓ Build ready${NC}"
echo ""

# Step 5: Deploy
echo -e "${YELLOW}🚀 Deploying to Cloudflare Workers...${NC}"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "Deploying to PRODUCTION..."
    wrangler deploy --env production
else
    echo "Deploying to DEVELOPMENT..."
    wrangler deploy
fi

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""

# Get the deployed URL
ACCOUNT_ID=$(wrangler whoami | grep "Account ID" | awk '{print $NF}')
DEPLOYED_URL="https://${PROJECT_NAME}.${ACCOUNT_ID}.workers.dev"

echo "📍 Deployed URL: $DEPLOYED_URL"
echo ""

# Step 6: Test deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
HEALTH_CHECK=$(curl -s "$DEPLOYED_URL/api/health" | grep -q "ok" && echo "OK" || echo "FAILED")

if [ "$HEALTH_CHECK" = "OK" ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Health check failed${NC}"
    echo "Try: curl $DEPLOYED_URL/api/health"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update frontend VITE_API_URL to: $DEPLOYED_URL"
echo "2. Deploy frontend to Cloudflare Pages"
echo "3. Run integration tests"
echo ""
echo "For more info, see: CLOUDFLARE_AI_GATEWAY_SETUP.md"

