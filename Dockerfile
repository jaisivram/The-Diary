# Use an official Node.js runtime as a parent image
FROM node:20.3.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install
RUN npm install aws-sdk

# Copy the rest of the application code
COPY . .

# Expose the port that your Node.js application will run on
EXPOSE 3000

# Define the command to start your application
CMD [ "node", "server.js" ]

