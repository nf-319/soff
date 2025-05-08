module.exports = {
  apps: [
    {
      name: "test-subdomain-soffcrm-uz-3131",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3131
      },
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true
    },
    {
      name: "test-subdomain-soffcrm-uz-3131-new",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3130
      },
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error-new.log",
      out_file: "./logs/out-new.log",
      merge_logs: true
    },
    {
      name: "prod-subdomain-soffcrm-uz-3132",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3132
      },
      max_memory_restart: "500M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "./logs/error-prod.log",
      out_file: "./logs/out-prod.log",
      merge_logs: true
    }
  ]
};
