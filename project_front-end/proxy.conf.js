const PROXY_CONFIG = {
  "/api": { // Prefix to distinguish API calls
    "target": "http://localhost:3000", // Back-end server
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug", // Useful for debugging
    "pathRewrite": { "^/api": "" } // Remove '/api' prefix before forwarding
  }
};

module.exports = PROXY_CONFIG;
