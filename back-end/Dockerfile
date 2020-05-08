FROM node:lts

RUN mkdir -p /usr/src/app/backend/

WORKDIR /usr/src/app/backend/

COPY package*.json /usr/src/app/backend/

RUN npm install

COPY . /usr/src/app/backend/

RUN npm rebuild bcrypt --build-from-source

CMD ["npm", "run", "start:dev"]
