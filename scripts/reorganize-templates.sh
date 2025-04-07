#!/bin/bash

# Create main template directories
mkdir -p src/templates/{frameworks,databases,auth,ci}

# Move framework templates
mkdir -p src/templates/frameworks/{express,koa,fastify,nestjs}
mv src/templates/express/src/* src/templates/frameworks/express/src/ 2>/dev/null || true
mv src/templates/koa/src/* src/templates/frameworks/koa/src/ 2>/dev/null || true
mv src/templates/fastify/src/* src/templates/frameworks/fastify/src/ 2>/dev/null || true
mv src/templates/nest/src/* src/templates/frameworks/nestjs/src/ 2>/dev/null || true

# Move database templates
mkdir -p src/templates/databases/{mongodb,postgres,mysql}
mv src/templates/databases/mongodb/* src/templates/databases/mongodb/ 2>/dev/null || true
mv src/templates/databases/postgres/* src/templates/databases/postgres/ 2>/dev/null || true
mv src/templates/databases/mysql/* src/templates/databases/mysql/ 2>/dev/null || true

# Move auth templates
mkdir -p src/templates/auth/{jwt,oauth,session}
mv src/templates/auth/jwt/* src/templates/auth/jwt/ 2>/dev/null || true
mv src/templates/auth/oauth/* src/templates/auth/oauth/ 2>/dev/null || true
mv src/templates/auth/session/* src/templates/auth/session/ 2>/dev/null || true

# Move CI templates
mkdir -p src/templates/ci/{github,gitlab,jenkins}
mv src/templates/ci/github/* src/templates/ci/github/ 2>/dev/null || true
mv src/templates/ci/gitlab/* src/templates/ci/gitlab/ 2>/dev/null || true
mv src/templates/ci/jenkins/* src/templates/ci/jenkins/ 2>/dev/null || true

# Clean up old directories
rm -rf src/templates/{express,koa,fastify,nest,postgres} 2>/dev/null || true

echo "Templates reorganized successfully!" 