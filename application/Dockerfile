FROM node:10

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --save

COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && node extern.js