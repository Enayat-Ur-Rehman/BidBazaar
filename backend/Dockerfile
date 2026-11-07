FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production \
    PORT=5000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

USER node
EXPOSE 5000
CMD ["node", "server.js"]
