'use strict'

const pathToRegexp = require('path-to-regexp')
const http = require('http')

const re = /.+?(?=\?|#)/i

module.exports.getRoute = (routes, req) => {
  const preMatch = routes[req.method]

  if (!preMatch) return

  const length = preMatch.length
  let i = 0
  for (; i < length; i++) {
    const route = routes[req.method][i]
    const matchResult = route.match(req.url)

    if (matchResult) {
      return Object.assign({ matchResult }, route)
    }
  }
}

module.exports.defaultRoute = {
  handler: (req, res) => {
    res.statusCode = 404
    res.end()
  }
}

module.exports.mergeRoutes = function () {
  return {
    ...Object.keys(arguments).reduce((routes, key) => {
      return {
        ...http.METHODS.reduce((obj, method) => {
          const temp = routes[method] || []
          const routesForMethod = arguments[key][method] || []

          return {
            ...obj,
            [method]: [
              ...temp,
              ...routesForMethod
            ]
          }
        }, {})
      }
    }, {})
  }
}

module.exports.prepareRoutes = (routes) => {
  return Object.keys(routes).reduce((prepared, method) => {
    return {
      ...prepared,
      [method]: routes[method].map(route => {
        const keys = []
        const regexp = pathToRegexp(route.path, keys)

        return {
          ...route,
          keys,
          match: (p) => {
            return regexp.exec(p.match(re) || p)
          }
        }
      })
    }
  }, {})
}

module.exports.applyParams = (req, route) => {
  let params = {}

  if (route.keys && route.keys.length > 0) {
    params = route.keys.reduce((acc, match, i) => {
      return Object.assign({ [match.name]: route.matchResult[i + 1] }, acc)
    }, {})
  }

  req.params = params

  return req
}

module.exports.applySearch = (req) => {
  let query = {}

  if (req.url.match(re)) {
    const protocol = req.connection.encrypted ? 'https' : 'http'
    const url = new URL(`${protocol}://${req.headers.host}${req.url}`)

    for (const pair of url.searchParams.entries()) {
      query[pair[0]] = pair[1]
    }
  }

  req.query = query

  return req
}
