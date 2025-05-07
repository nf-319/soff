module.exports = {
  apps: [
    {
      name: "test-subdomain-soffcrm-uz-3131",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3131
      },
      max_memory_restart: "500M"
    },
    {
      name: "test-subdomain-soffcrm-uz-3131-new",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3130
      },
      max_memory_restart: "500M"
    },
    {
      name: "prod-subdomain-soffcrm-uz-3132",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3132
      },
      max_memory_restart: "500M"
    }
  ]
};
