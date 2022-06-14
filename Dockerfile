FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY ./src .
COPY example.json ip.json

CMD [ "node", "app.js" ]