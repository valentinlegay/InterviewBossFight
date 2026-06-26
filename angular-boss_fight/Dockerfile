# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine
# The Angular build outputs to `dist/angular-boss_fight/browser` in this project
COPY --from=builder /app/dist/angular-boss_fight/browser /usr/share/nginx/html

# Optional: custom nginx config can be added later
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
