FROM node:20

WORKDIR /app

# copy package files
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# install serve
RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]