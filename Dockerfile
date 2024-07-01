FROM node:16-alpine as dev
    WORKDIR /usr/src/app
    COPY package*.json .
    RUN npm install
    COPY . .
    RUN npm run compile

FROM node:16-alpine as prod
    ARG NODE_ENV=production
    ENV NODE_ENV=${NODE_ENV}
    ARG EXPRESS_PORT=3000
    ENV EXPRESS_PORT=#{EXPRESS_PORT}
    WORKDIR /usr/src/app
    COPY package*.json .
    RUN npm ci --only=production
    COPY --from=dev /usr/src/app/build ./build
    
CMD ["node","build/index.js"]
