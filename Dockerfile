FROM node:16-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev -- --legacy-watch

FROM base as prod
ENV NODE_ENV=production
RUN npm install
COPY . .
CMD [ "npm", "start" ]
