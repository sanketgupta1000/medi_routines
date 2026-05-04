# base stage, used by all later stages
FROM node:24.11.1 AS base
# working directory
WORKDIR /medi_routines_frontend
# copy dependencies
COPY package.json package-lock.json ./
# install deps
RUN npm install
COPY . .

# client dev stage
FROM base AS dev
# start dev server
CMD ["npm", "run", "dev", "--", "--host"]

# builder stage, just builds for production
FROM base AS builder
RUN npm run build

# final production stage for client, just puts built html, css, js in a apache server
FROM httpd:2.4.66 AS final
# copy built files
COPY --from=builder /medi_routines_frontend/dist/ /usr/local/apache2/htdocs/