FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4321

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
