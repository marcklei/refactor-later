'use strict'

const { applyParams, getRoute, defaultRoute } = require('./router')

const handleRequest = async (req, res, route = defaultRoute) => {
  const reqWithParams = applyParams(req, route)
  const handlerResult = await route.handler(reqWithParams, res)
  return handlerResult
}

module.exports.createApp = (app) => async (req, res) => {
  const route = getRoute(app.routes, req)

  await handleRequest(req, res, route)
}
