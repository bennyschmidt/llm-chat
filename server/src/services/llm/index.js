const { http } = require('node-service-library');

const {
  chat
} = require('./api');

module.exports = http({
  GET: {},
  POST: {
    chat
  },
  PUT: {},
  DELETE: {}
});
