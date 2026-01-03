# Stage 1: Base dependencies
FROM node:22-alpine AS base
WORKDIR /app

# Copy only package files to install dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Stage 2: Build stage
FROM base AS build
WORKDIR /app

ENV SKIP_ENV_VALIDATION=true

# Copy all source files into the container
COPY . .

# We require next public vars to be present at build time
RUN npm install -g dotenv-cli

# Use dotenv-cli to load .env.docker and build the app
RUN dotenv -e .env.docker npm run build

# Stage 3: Development stage
FROM base AS dev
WORKDIR /app

# Copy all source files for development purposes
COPY . .

# Run the development server
CMD ["npm", "run", "dev"]

# Stage 4: Release (Production) stage
FROM node:22-alpine AS release
WORKDIR /app

# Set NODE_ENV to production for optimized dependencies and runtime behavior
ENV NODE_ENV=production

# Copy only production dependencies from base image
COPY package.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps --ignore-scripts

# Copy the built application from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
# Expose port 3000 for the application
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
