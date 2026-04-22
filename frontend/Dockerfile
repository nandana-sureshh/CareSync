# ─── Stage 1: Build React app ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies.
# Using npm install (not npm ci) because package-lock.json may not be committed.
COPY package*.json ./
RUN npm install

COPY . .

# Accept build-time arguments for React environment variables.
# CRA (react-scripts) replaces process.env.REACT_APP_* at webpack compile time,
# so these MUST be set as ENV before `npm run build` runs.
# They are passed from docker-compose build.args (sourced from root .env).
ARG REACT_APP_AUTH_URL=http://localhost:4001
ARG REACT_APP_PATIENT_URL=http://localhost:4002
ARG REACT_APP_DOCTOR_URL=http://localhost:4003
ARG REACT_APP_APPOINTMENT_URL=http://localhost:4004

ENV REACT_APP_AUTH_URL=$REACT_APP_AUTH_URL
ENV REACT_APP_PATIENT_URL=$REACT_APP_PATIENT_URL
ENV REACT_APP_DOCTOR_URL=$REACT_APP_DOCTOR_URL
ENV REACT_APP_APPOINTMENT_URL=$REACT_APP_APPOINTMENT_URL

RUN npm run build

# ─── Stage 2: Serve with nginx ────────────────────────────────────────────
FROM nginx:1.25-alpine

# Copy built static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Custom nginx config: SPA fallback (try_files → index.html) + caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
