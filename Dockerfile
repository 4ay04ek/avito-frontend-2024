FROM node:latest
WORKDIR /usr/app
COPY package.json .
COPY tsconfig.json .
COPY webpack.dev.config.ts .
COPY .eslintrc.json .
COPY .babelrc .
RUN npm i --quite
CMD ["npm", "run", "start"]