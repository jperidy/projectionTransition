FROM node:16

WORKDIR /app

# Backend installation
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
COPY . .

# Frontend installation
# WORKDIR /app/frontend
# RUN npm install
# RUN npm run build

# Start service
# WORKDIR /app
EXPOSE 5000
CMD [ "npm", "run", "start" ]