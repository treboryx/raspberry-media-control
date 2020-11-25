module.exports = {
  apps: [
    {
      name: "frontend",
      // exec_mode: "cluster", // Optional: If you want it run multiple instances.
      instances: 1, // Max Or a number of instances.
      script: "./frontend/node_modules/nuxt/bin/nuxt.js",
      args: "start",
      watch: true,
      autorestart: true,
    },
    {
      name: "backend",
      instances: 1,
      script: "./backend/server.js",
      watch: true,
      autorestart: true,
    },
  ],
};
