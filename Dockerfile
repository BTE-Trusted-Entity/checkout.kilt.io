FROM node:18.12.0-alpine AS base

WORKDIR /app

FROM base AS builder

# one of dependencies uses node-gyp which requires build tools
RUN apk add --update --no-cache python3 g++ make && ln -sf python3 /usr/bin/python

COPY . .

RUN yarn install --frozen-lockfile --ignore-optional && yarn add --ignore-optional --dev @parcel/css-linux-x64-musl && yarn cache clean --all

# RUN yarn install --frozen-lockfile --ignore-optional && yarn cache clean --all

RUN yarn build


EXPOSE 3000
CMD ["yarn", "dev-start"]
