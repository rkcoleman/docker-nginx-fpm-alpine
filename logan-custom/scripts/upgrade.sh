#!/bin/bash

# PrivateBin Upgrade Script
# Maintains customizations while upgrading to new versions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}PrivateBin Upgrade Tool${NC}"
echo "========================"

# Check current version
CURRENT_VERSION=$(grep "ARG PRIVATEBIN_VERSION=" "$PROJECT_ROOT/Dockerfile" | cut -d'=' -f2)
echo -e "Current version: ${YELLOW}$CURRENT_VERSION${NC}"

# Get latest version from GitHub
echo "Checking for latest version..."
LATEST_VERSION=$(curl -s https://api.github.com/repos/PrivateBin/PrivateBin/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
echo -e "Latest version: ${YELLOW}$LATEST_VERSION${NC}"

if [ "$CURRENT_VERSION" = "$LATEST_VERSION" ]; then
    echo -e "${GREEN}You are already on the latest version!${NC}"
    exit 0
fi

echo -e "\n${YELLOW}Upgrade available: $CURRENT_VERSION -> $LATEST_VERSION${NC}"
read -p "Do you want to proceed with the upgrade? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Upgrade cancelled."
    exit 0
fi

# Backup current configuration
echo -e "\n${GREEN}Creating backup...${NC}"
BACKUP_DIR="$PROJECT_ROOT/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "$PROJECT_ROOT/custom-theme" "$BACKUP_DIR/"
cp -r "$PROJECT_ROOT/config" "$BACKUP_DIR/"
cp "$PROJECT_ROOT/Dockerfile" "$BACKUP_DIR/"

# Update Dockerfile version
echo -e "\n${GREEN}Updating Dockerfile...${NC}"
sed -i.bak "s/ARG PRIVATEBIN_VERSION=.*/ARG PRIVATEBIN_VERSION=$LATEST_VERSION/" "$PROJECT_ROOT/Dockerfile"

# Test build
echo -e "\n${GREEN}Testing build...${NC}"
cd "$PROJECT_ROOT"
if docker build -t privatebin-custom:test . ; then
    echo -e "${GREEN}Build successful!${NC}"
    
    # Run basic tests
    echo -e "\n${GREEN}Running smoke tests...${NC}"
    docker run --rm -d --name privatebin-test -p 8888:8080 \
        -e OAUTH2_PROXY_CLIENT_ID=test \
        -e OAUTH2_PROXY_CLIENT_SECRET=test \
        -e OAUTH2_PROXY_COOKIE_SECRET=$(openssl rand -base64 32) \
        -e OAUTH2_PROXY_AZURE_TENANT=test \
        privatebin-custom:test
    
    sleep 5
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8888 | grep -q "200\|302"; then
        echo -e "${GREEN}Smoke test passed!${NC}"
        docker stop privatebin-test
    else
        echo -e "${RED}Smoke test failed!${NC}"
        docker stop privatebin-test
        exit 1
    fi
    
    # Tag the new version
    docker tag privatebin-custom:test privatebin-custom:$LATEST_VERSION
    docker tag privatebin-custom:test privatebin-custom:latest
    
    echo -e "\n${GREEN}Upgrade complete!${NC}"
    echo "Next steps:"
    echo "1. Review the changes and test thoroughly"
    echo "2. Push to your container registry:"
    echo "   docker push your-registry/privatebin-custom:$LATEST_VERSION"
    echo "   docker push your-registry/privatebin-custom:latest"
    echo "3. Update your deployment to use the new version"
    
else
    echo -e "${RED}Build failed! Rolling back...${NC}"
    mv "$PROJECT_ROOT/Dockerfile.bak" "$PROJECT_ROOT/Dockerfile"
    exit 1
fi

# Cleanup
rm -f "$PROJECT_ROOT/Dockerfile.bak"
docker rmi privatebin-custom:test 2>/dev/null || true

echo -e "\n${GREEN}Backup saved to: $BACKUP_DIR${NC}"