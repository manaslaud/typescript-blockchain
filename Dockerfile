# Development stage
FROM node:16-alpine as dev
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set timeout 60000 \
    && npm ci --only=development

# Copy source code
COPY . .

RUN npm run compile

# Production stage
FROM node:16-alpine as prod
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=dev /usr/src/app/build ./build

# Set the command to run the app
CMD ["node", "build/index.js"]
