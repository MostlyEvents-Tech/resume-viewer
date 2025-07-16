module.exports = {
  apps: [
    {
      name: 'resume-viewer',
      script: 'npm',
      args: 'start',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Use user home directory for logs
      error_file: '/home/me-frontend-user/logs/resume-viewer-error.log',
      out_file: '/home/me-frontend-user/logs/resume-viewer-out.log',
      log_file: '/home/me-frontend-user/logs/resume-viewer-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000
    }
  ]
}