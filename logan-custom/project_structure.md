custom-privatebin/
├── docker-compose.yml              # Local development
├── Dockerfile                      # Custom image with auth proxy
├── auth-proxy/                     # Entra ID authentication layer
│   ├── nginx.conf                  # Nginx auth configuration
│   ├── auth-handler/               # OAuth2 proxy or custom handler
│   └── templates/                  # Login/error pages
├── custom-theme/                   # Your branded theme
│   ├── css/
│   │   └── custom.css             # Brand colors, fonts, etc.
│   ├── js/
│   │   └── custom.js              # Additional functionality
│   ├── img/
│   │   ├── logo.png               # Company logo
│   │   └── favicon.ico            # Company favicon
│   └── templates/
│       └── bootstrap5-custom.php   # Custom template based on bootstrap5
├── config/
│   ├── conf.php                    # PrivateBin configuration
│   └── auth-config.json            # Authentication settings
├── scripts/
│   ├── upgrade.sh                  # Upgrade helper script
│   └── build-and-push.sh          # CI/CD helper
└── azure/
    ├── deployment.bicep            # Azure infrastructure
    └── container-app.yaml          # Container Apps config