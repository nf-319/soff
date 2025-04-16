module.exports = {
  apps: [
    {
      name: 'test-subdomain-soffcrm-uz-3132',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      output: './logs/out.log',
      error: './logs/error.log',
      log: './logs/combined.log',
      time: true
    }
  ]
}
