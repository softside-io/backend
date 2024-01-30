FROM node:20.11.0-alpine

# Install dependencies
RUN apk add --no-cache bash \
    && npm i -g @nestjs/cli typescript ts-node

# Set working directory
WORKDIR /usr/src/app

# Install Node modules
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Make scripts executable and fix line endings
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.relational.dev.sh /opt/startup.relational.dev.sh
RUN chmod +x /opt/wait-for-it.sh /opt/startup.relational.dev.sh \
    && sed -i 's/\r//g' /opt/wait-for-it.sh \
    && sed -i 's/\r//g' /opt/startup.relational.dev.sh

# Set environment file
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi

# Build the application
RUN npm run build

# Run the application
CMD ["/opt/startup.relational.dev.sh"]