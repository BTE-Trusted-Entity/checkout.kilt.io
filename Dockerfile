FROM node:20.11.1-alpine AS base

WORKDIR /app

FROM base AS builder

# one of dependencies uses node-gyp which requires build tools
RUN apk add --update --no-cache python3 g++ make && ln -sf python3 /usr/bin/python

# get the dependencies and sources
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY src ./src
COPY tsconfig.json ./

# install build dependencies, build the app
# @parcel/css-linux-x64-musl & lightningcss-linux-x64-musl are not optional but marked so
RUN yarn install --immutable && yarn add --dev @parcel/css-linux-x64-musl lightningcss-linux-x64-musl && yarn cache clean --all
RUN yarn build

FROM base AS release

# add nginx and its configuration
RUN apk add --update --no-cache nginx nginx-mod-http-brotli
COPY ./nginx.conf /etc/nginx/http.d/default.conf

# tell the app it will run on port 4000 in production mode
ENV PORT 4000
ENV NODE_ENV production

# get the dependencies and sources
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
# install the production dependencies only (depends on NODE_ENV)
RUN yarn install --immutable && yarn cache clean --all

# carry over the built code
COPY --from=builder /app/dist dist

EXPOSE 3000
ENTRYPOINT nginx; exec yarn start


