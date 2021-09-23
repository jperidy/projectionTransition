FROM node:16

WORKDIR /app

# Backend installation
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
# Start service

EXPOSE 3000
CMD [ "npm", "run", "start" ]