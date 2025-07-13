FROM node:22-alpine AS runtime
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

CMD npm run start