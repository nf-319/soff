module.exports = {
  apps: [
    {
      name: "test-subdomain-soffcrm-uz-3132",
      script: "npm",
      args: "run start:test",
    },
    {
      name: "prod-subdomain-soffcrm-uz-3132",
      script: "npm",
      args: "run start",
    }
  ]
};
