# Name the node stage "builder"
FROM node:14 AS builder
# Set working directory
ARG REACT_APP_BASE_URL
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_GOOGLE_API_KEY
ARG REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY
ARG REACT_APP_MERCHANT_KEY_ID
ARG REACT_APP_PAYMENT_SDK_ENV
ARG REACT_APP_PAYMENT_SERVICE_URL
ARG REACT_APP_MMI_BASE_URL

ENV REACT_APP_BASE_URL ${REACT_APP_BASE_URL}
ENV REACT_APP_MMI_BASE_URL ${REACT_APP_MMI_BASE_URL}
ENV REACT_APP_FIREBASE_API_KEY ${REACT_APP_FIREBASE_API_KEY}
ENV REACT_APP_FIREBASE_AUTH_DOMAIN ${REACT_APP_FIREBASE_AUTH_DOMAIN}
ENV REACT_APP_GOOGLE_API_KEY ${REACT_APP_GOOGLE_API_KEY}
ENV REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY ${REACT_APP_JUSTPAY_CLIENT_AND_MERCHANT_KEY}
ENV REACT_APP_MERCHANT_KEY_ID ${REACT_APP_MERCHANT_KEY_ID}
ENV REACT_APP_PAYMENT_SDK_ENV ${REACT_APP_PAYMENT_SDK_ENV}
ENV REACT_APP_PAYMENT_SERVICE_URL ${REACT_APP_PAYMENT_SERVICE_URL}
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN npm install && npm run-script build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
