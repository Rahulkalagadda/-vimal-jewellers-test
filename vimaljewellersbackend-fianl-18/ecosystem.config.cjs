module.exports = {
    apps: [{
        name: "vimal-backend",
        script: "./services/backend/index.js",
        instances: 1,  // Start with 1 instance for stability on small servers
        exec_mode: "cluster",
        max_memory_restart: "400M", // Restart if it uses > 400MB RAM
        exp_backoff_restart_delay: 100, // Delay restarts (prevents rapid crash loops)
        env: {
            NODE_ENV: "production",
            PORT: 7502
        },
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        error_file: "./logs/pm2-error.log",
        out_file: "./logs/pm2-out.log",
        merge_logs: true
    }]
};

// ecosystem.config.cjs
// : A configuration file for PM2.
// Purpose: PM2 is a production process manager for Node.js. It keeps your app running 24/7, restarts it if it crashes, and handles logging.
// Usage: Run pm2 start ecosystem.config.cjs on your server.
