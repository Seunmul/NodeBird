# Dockerfile
FROM node:lts-slim

# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

ENTRYPOINT [ "npm", "run","dev" ]