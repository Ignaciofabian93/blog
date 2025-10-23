FROM node:22

WORKDIR /app

COPY package.json .

COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 9005

CMD [ "npm", "start" ]