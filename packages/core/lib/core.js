const app = require('./app')
const router = require('./router')

module.exports = {
  ...app,
  ...router
}
