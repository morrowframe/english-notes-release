FROM node:22-alpine
WORKDIR /app
COPY server.mjs package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
