module.exports = {
  apps: [
    {
      name: "wedding-invite",
      script: "server/index.js",
      cwd: "/opt/wedding-invite/app",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
