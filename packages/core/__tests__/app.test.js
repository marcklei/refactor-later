const { createApp } = require('../lib/app')
const router = require('../lib/router')

jest.mock('../lib/router', () => ({
  ...jest.requireActual('../lib/router'),
  getRoute: jest.fn()
}))

describe('createApp ...', () => {
  test('creates a callback function', () => {
    const app = createApp()
    expect(typeof app).toBe('function')
  })

  test('uses the default route handler and returns a 404', async () => {
    const app = createApp({ routes: {} })
    const res = {
      write (value) {
        this.result += value
      },
      end () {
        this.ended = true
      }
    }

    router.getRoute.mockReturnValue()

    await app({ method: 'GET', url: '/no-match' }, res)

    expect(res.statusCode).toBe(404)
  })

  test('matches a GET route and calls the handler', async () => {
    const app = createApp({ routes: {} })
    const res = {}
    const handler = jest.fn()

    router.getRoute.mockReturnValue({
      path: '/',
      handler
    })

    await app({ method: 'GET', url: '/' }, res)

    expect(handler.mock.calls.length).toBe(1)
  })
})
