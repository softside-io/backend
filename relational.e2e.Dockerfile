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

# Copy and fix the scripts
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.ci.sh /opt/startup.relational.ci.sh

# Fix line endings and make scripts executable
RUN sed -i 's/\r//g' /opt/wait-for-it.sh \
    && sed -i 's/\r//g' /opt/startup.relational.ci.sh \
    && chmod +x /opt/wait-for-it.sh /opt/startup.relational.ci.sh

# Set environment file
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi

# Build the application
RUN npm run build

# Set the default command
CMD ["/opt/startup.relational.ci.sh"]