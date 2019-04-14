'use strict'

const { applyParams, applySearch, getRoute, defaultRoute } = require('./router')

const handleRequest = async (req, res, route = defaultRoute) => {
  const reqWithParams = applyParams(req, route)
  const enhancedReq = applySearch(reqWithParams)

  const handlerResult = await route.handler(enhancedReq, res)
  return handlerResult
}

module.exports.createApp = (app) => async (req, res) => {
  const route = getRoute(app.routes, req)

  await handleRequest(req, res, route)
}
