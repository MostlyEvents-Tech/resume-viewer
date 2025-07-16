module.exports = {
  apps: [
    {
      name: 'resume-viewer',
      script: 'npm',
      args: 'start',
      instances: 2, // Set to specific number instead of 'max' for stability
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      
      // Enhanced logging
      error_file: '/home/me-frontend-user/logs/resume-viewer-error.log',
      out_file: '/home/me-frontend-user/logs/resume-viewer-out.log',
      log_file: '/home/me-frontend-user/logs/resume-viewer-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Restart settings
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}