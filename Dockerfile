FROM node:lts-alpine
ENV NODE_ENV development

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile --ignore-optional && yarn cache clean --all

RUN yarn build

EXPOSE 3000
CMD ["yarn", "dev-start"]
