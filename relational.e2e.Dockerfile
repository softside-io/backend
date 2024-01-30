# Base image
FROM node:20.11.0-alpine

# Install bash
RUN apk add --no-cache bash

# Set the working directory
WORKDIR /usr/src/app

# Install node packages
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Make scripts executable and fix line endings
COPY ./wait-for-it.sh ./startup.relational.ci.sh ./
RUN chmod +x ./wait-for-it.sh ./startup.relational.ci.sh \
    && sed -i 's/\r//g' ./wait-for-it.sh \
    && sed -i 's/\r//g' ./startup.relational.ci.sh

# Build the application
RUN npm run build

# Set the default command
CMD ["./startup.relational.ci.sh"]