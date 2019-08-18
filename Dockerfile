FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --save

COPY . .

CMD ["node", "extern.js"]