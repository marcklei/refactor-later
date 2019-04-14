'use strict'

const { getRoute, defaultRoute } = require('./router')

const handleRequest = async (req, res, route = defaultRoute) => {
  const handlerResult = await route.handler(req, res)
  return handlerResult
}

module.exports.createApp = (app) => async (req, res) => {
  // const protocol = req.connection.encrypted ? 'https' : 'http'
  // const url = new URL(`${protocol}://${req.headers.host}${req.url}`)

  const route = getRoute(app.routes, req)

  await handleRequest(req, res, route)
}