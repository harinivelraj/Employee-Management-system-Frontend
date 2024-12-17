# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Use a smaller image to serve the built app (Nginx)
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 3000

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
