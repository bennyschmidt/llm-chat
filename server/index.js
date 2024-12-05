/* eslint-disable no-sync */

const { readFileSync } = require('node:fs');

const NODE_ENV = 'development';
const PORT = 1337;
const URL = 'http://127.0.0.1'

// Needed to resolve SSL path in prod

const PROJECT_NAME = 'YOUR_PROJECT';

(async () => {
  // Define services

  const Services = {
    'LLM': {}
  };

  // Configure HTTP

  const isProduction = NODE_ENV === 'production';

  const http = require(isProduction ? 'https' : 'http');
  const express = require('express');
  const cors = require('cors');

  const httpApi = express();

  httpApi.use(express.json({ limit: '10mb' }));
  httpApi.use(express.urlencoded({ extended: false, limit: '10mb' }));
  httpApi.use(cors());

  let server;

  // Production tasks

  if (isProduction) {
    const httpsOptions = {
      key: readFileSync(`/etc/letsencrypt/live/${PROJECT_NAME}/privkey.pem`),
      cert: readFileSync(`/etc/letsencrypt/live/${PROJECT_NAME}/fullchain.pem`)
    };

    // Production server methods

    const onRequest = (req, res, next) => {
      let host = req.headers.host;

      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

      // Escape preflight requests

      if (req.method === 'OPTIONS') {
        return res.send(200);
      }

      // HTTPS redirect

      if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
        if (!req.headers.host.match('www.')) {
          host = `www.${host}`;
        }

        return res.redirect(`https://${host}${req.url}`);
      }

      return next();
    };

    // Use HTTPS and enable middleware

    httpApi.use(onRequest);

    server = http.createServer(httpsOptions, httpApi);
  } else {
    server = http.createServer(httpApi);
  }

  if (!server) {
    throw new Error('Server configuration error (see `http.createServer`).');
  }

  server.keepAliveTimeout = 60000;
  server.headersTimeout = 61000;

  // Server methods

  const onListen = () => {
    // Configure WebSocket

    const socketApi = require('socket.io')(server);

    console.log(`Service "HttpApi" is online at ${URL}`);
    console.log(`Service "SocketApi" is online at ${URL}`);

    // Start backend services

    const serviceList = Object.keys(Services);
    const serviceCount = serviceList?.length << 0;

    if (!serviceCount) return;

    for (const key of serviceList) {
      const serviceSlug = (
        `${key.replace(/[^\w]+/g, '-')}`
      );

      Services[key] = require(`./src/services/${serviceSlug.toLowerCase()}`);
    }

    // HTTP methods

    const onPing = (_, res) => res.send('Services are online.');

    const onGet = Service => (req, res) => {
      if (Object.keys(req.query).length) {
        return Service.onHttpSearch(req, res);
      }

      return Service.onHttpGet(req, res);
    };

    const onPost = Service => (req, res) => (
      Service.onHttpPost(req, res)
    );

    const onPut = Service => (req, res) => (
      Service.onHttpPut(req, res)
    );

    const onDelete = Service => (req, res) => (
      Service.onHttpDelete(req, res)
    );

    // Ping handler

    httpApi.get('/', onPing);

    // Route namespaced requests

    for (const name of serviceList) {
      const Service = Services[name];

      const slug = (
        `${name.toLowerCase().replace(/[^\w]+/g, '-')}`
      );

      // Websocket methods

      const onConnect = async socket => {
        const onDisconnect = req => {
          Service.onWsDisconnect(req, socket);
        };

        const onMessage = req => {
          Service.onWsRequest(req, socket);
        };

        await Service.onWsConnect(
          {
            method: 'connection',
            body: socket
          },
          socket
        );

        socket.on('disconnect', onDisconnect);

        // eslint-disable-next-line no-magic-numbers
        socket.on(`${slug}:request`, onMessage);
      };

      const { type } = Service;

      if (type === 'http') {
        httpApi.get(`/${slug}/*`, onGet(Service));
        httpApi.post(`/${slug}/*`, onPost(Service));
        httpApi.put(`/${slug}/*`, onPut(Service));
        httpApi.delete(`/${slug}/*`, onDelete(Service));
      }

      if (type === 'ws') {
        socketApi.on('connect', onConnect);

        Service.onWsReady();
      }

      console.log(`Service "${name}" (${type}) is online at ${URL}/${slug}`);
    }
  };

  server.listen(PORT, onListen);
})();
