FROM node:14 as base
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force

FROM base as build
WORKDIR /app
COPY . ./
RUN npm run build

FROM node:14-alpine as app
WORKDIR /app
COPY --from=base /app/package*.json ./
RUN npm install --production && npm cache clean --force
COPY --from=build /app/dist/ ./dist/
ENV PORT=3030
EXPOSE 3030
CMD ["npm", "run","start:prod"]