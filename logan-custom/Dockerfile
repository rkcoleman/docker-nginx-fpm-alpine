# Use specific version for controlled upgrades
ARG PRIVATEBIN_VERSION=1.7.8
FROM privatebin/nginx-fpm-alpine:${PRIVATEBIN_VERSION} as privatebin-base

# Build OAuth2 Proxy for Entra ID authentication
FROM golang:1.21-alpine as oauth2-proxy-builder
RUN apk add --no-cache git
RUN go install github.com/oauth2-proxy/oauth2-proxy/v7@latest

# Final image
FROM privatebin-base

# Install additional packages for auth proxy
USER root
RUN apk add --no-cache supervisor

# Copy OAuth2 Proxy
COPY --from=oauth2-proxy-builder /go/bin/oauth2-proxy /usr/local/bin/

# Copy custom configurations
COPY auth-proxy/nginx.conf /etc/nginx/http.d/auth.conf
COPY auth-proxy/supervisord.conf /etc/supervisord.conf
COPY custom-theme /srv/custom-theme
COPY config/conf.php /srv/cfg/conf.php

# Create directories for runtime
RUN mkdir -p /var/log/supervisor /run/supervisor && \
    chown -R 65534:82 /var/log/supervisor /run/supervisor /srv/custom-theme && \
    chmod 755 /srv/custom-theme

# Environment variables for OAuth2 Proxy
ENV OAUTH2_PROXY_CLIENT_ID=""
ENV OAUTH2_PROXY_CLIENT_SECRET=""
ENV OAUTH2_PROXY_COOKIE_SECRET=""
ENV OAUTH2_PROXY_AZURE_TENANT=""
ENV OAUTH2_PROXY_EMAIL_DOMAINS="*"
ENV OAUTH2_PROXY_UPSTREAM="http://127.0.0.1:8081"
ENV OAUTH2_PROXY_HTTP_ADDRESS="0.0.0.0:8080"
ENV OAUTH2_PROXY_PROVIDER="azure"

# Switch back to non-root user
USER 65534:82

# Override entrypoint to use supervisor
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]