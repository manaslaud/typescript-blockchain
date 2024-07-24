FROM node:16-alpine as dev
    WORKDIR /usr/src/app
    COPY package*.json .
    RUN npm install
    COPY . .
    RUN npm run compile

FROM node:16-alpine as prod
    WORKDIR /usr/src/app
    COPY package*.json .
    RUN npm ci --only=production
    COPY --from=dev /usr/src/app/build ./build
    
CMD ["node","build/index.js"]
