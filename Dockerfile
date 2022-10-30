FROM node:14.20.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Set timezone to Europe/London
# RUN apt-get update && apt-get install tzdata -y
# RUN echo Europe/London >/etc/timezone && dpkg-reconfigure -f noninteractive tzdata
# ENV TZ="Europe/London"

# Set London timezone data
RUN apk add -U tzdata
ENV TZ=Europe/London
RUN cp /usr/share/zoneinfo/Europe/London /etc/localtime


# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY ./src .
COPY example.json ip.json

CMD [ "node", "app.js" ]