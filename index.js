/**
 * index
 */

/* Node modules */

/* Third-party modules */
const express = require('express');
const proxy = require('http-proxy-middleware');

/* Files */

const hosts = process.env.VH_HOSTS || "";

const config = {
  hosts: hosts.split(',')
    .reduce((result, hosts) => {
      const [ host, target ] = hosts.split('=');

      if (result[host]) {
        throw new Error(`Cannot redeclare host: ${host}`);
      }

      if (host && target) {
        result[host] = target;
      }

      return result;
    }, {}),
  port: Number(process.env.VH_PORT || 3000)
};

console.log(JSON.stringify(config, null, 2));

if (Object.keys(config.hosts).length === 0) {
  throw new Error('You must have at least one virtual host configured');
}

const app = express();

app
  .use((req, res, next) => {
    const host = req.hostname;
    const target = config.hosts[host];

    if (target) {
      /* Host found - proxy the request */
      const apiProxy = proxy({
        changeOrigin: true,
        target,
        ws: true
      });

      return apiProxy(req, res, next);
    }

    /* Nothing found - treat as a 404 */
    next();
  });

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
