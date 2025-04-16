module.exports = {
  apps: [
    {
      name: "test-subdomain-soffcrm-uz-3132",
      script: "npm",
      args: "run start",
      interpreter: "/root/.nvm/versions/node/v20.10.0/bin/node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production"
      },
      output: "./logs/out.log",
      error: "./logs/error.log",
      log: "./logs/combined.log",
      time: true
    },
    {
      name: "prod-subdomain-soffcrm-uz-3132",
      script: "npm",
      args: "run start",
      interpreter: "/root/.nvm/versions/node/v20.10.0/bin/node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production"
      },
      output: "./logs/out.log",
      error: "./logs/error.log",
      log: "./logs/combined.log",
      time: true
    }
  ]
};
