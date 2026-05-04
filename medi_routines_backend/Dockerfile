# base stage, used by all other stages
FROM node:24.11.1 AS base
WORKDIR /medi_routines_backend
COPY package.json package-lock.json ./

# backend dev stage, start a development server
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

# test stage, runs tests
FROM base AS test
RUN npm install
COPY . .
CMD ["npm", "test"]

# production stage
FROM base AS final
# install for production, ie leave dev deps, and also install from package-lock.json only
RUN npm ci --production
COPY . .
# start the server
CMD ["npm", "run", "start"]