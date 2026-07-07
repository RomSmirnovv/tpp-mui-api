module.exports = {
  apps: [
    {
      name: 'tpp-api',
      script: 'server.js',
      cwd: '/var/www/tpp/api',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      restart_delay: 5000,
      max_memory_restart: '250M',
      time: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
