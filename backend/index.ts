// @ts-nocheck

const app     = require('./app')
const http    = require('http')
const config  = require('./utils/config')
const logger  = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.success(`Server running at port ${config.PORT}`);
})



