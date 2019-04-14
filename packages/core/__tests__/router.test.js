const { applyParams, getRoute, mergeRoutes, prepareRoutes } = require('../lib/router')

const someRoutes = {
  POST: [{
    path: '/group/:id',
    handler: (req, res) => {
      res.write('Post on Group')
      res.end()
    }
  }],
  GET: [{
    path: '/',
    handler: (req, res) => {
      res.write('Get on Root')
      res.end()
    }
  }]
}

describe('getRoute ...', () => {
  test('returns undefined when no method is matched', () => {
    const result = getRoute({ POST: [] }, { method: 'GET' })
    expect(result).toBe(undefined)
  })

  test('returns undefined when no route is matched', () => {
    const match = jest.fn(() => false)
    const result = getRoute({ GET: [{ match }] }, { method: 'GET' })

    expect(match.mock.calls.length).toBe(1)
    expect(result).toBe(undefined)
  })

  test('returns the route object a route is matched', () => {
    const match = jest.fn(() => true)
    const route = { match, path: '/' }
    const result = getRoute({ GET: [route] }, { method: 'GET' })

    expect(match.mock.calls.length).toBe(1)
    expect(result.path).toBe('/')
  })
})

describe('mergeRoutes ...', () => {
  test('returns a merged routes object', () => {
    const moreRoutes = {
      POST: [{
        path: '/user/:id',
        handler: (req, res) => {
          res.write('Post on Root')
          res.end()
        }
      }],
      GET: [{
        path: '/testroute',
        handler: (req, res) => {
          res.write('Get on Testroute')
          res.end()
        }
      }]
    }

    const mergedRoutes = mergeRoutes(someRoutes, moreRoutes)

    expect(mergedRoutes).toMatchSnapshot()
  })
})

describe('prepareRoutes ...', () => {
  test('adds a regex matcher to each route', () => {
    const preparedRoutes = prepareRoutes(someRoutes)

    expect(typeof preparedRoutes['GET'][0].match).toBe('function')
    expect(typeof preparedRoutes['POST'][0].match).toBe('function')

    expect(typeof preparedRoutes['GET'][0].match('/')).toBeDefined()
    expect(preparedRoutes['POST'][0].match('/group/:id')).toBeDefined()
    expect(preparedRoutes['POST'][0].match('/')).toBeNull()
  })
})

describe('applyParams ...', () => {
  test('applys the params and query to the req', () => {
    const req = applyParams(
      {
        connection: {
          encrypted: true
        },
        headers: {
          host: 'example.com'
        },
        url: '/posts/1/comments/2?sort=date&filter=false'
      },
      {
        path: '/posts/:id/comments/:commentId',
        handler: jest.fn(),
        matchResult: ['', 1, 2],
        keys: [{ name: 'id' }, { name: 'commentId' }]
      })

    expect(req).toMatchSnapshot()
  })
})
