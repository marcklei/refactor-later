const request = require('supertest')
const { createApp, prepareRoutes } = require('../lib/core')

let app

const routes = {
  GET: [
    {
      path: '/',
      handler: (req, res) => {
        res.write('Get on Root')
        res.end()
      }
    },
    {
      path: '/user',
      handler: (req, res) => {
        res.write('Get on User with query')
        res.end()
      }
    },
    {
      path: '/posts/:id/comments/:commentId',
      handler: (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({
          postId: req.params.id,
          commentId: req.params.commentId,
          sortedBy: req.query.sort,
          filtered: req.query.filter
        }))
        res.end()
      }
    }
  ],
  POST: [
    {
      path: '/user/:id',
      handler: (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({ userId: req.params.id }))
        res.end()
      }
    }
  ]
}

beforeAll(() => {
  app = createApp({ routes: prepareRoutes(routes) })
})

describe('createApp ...', () => {
  test('It should response the GET method on "/"', async () => {
    const response = await request(app).get('/')
    expect(response.statusCode).toBe(200)
  })

  test('It should response the GET method on "/user?name=test"', async () => {
    const response = await request(app).get('/user?name=test')
    expect(response.statusCode).toBe(200)
  })

  test('It should response the GET method on "/user#test"', async () => {
    const response = await request(app).get('/user#test')
    expect(response.statusCode).toBe(200)
  })

  test('It should response the POST method on "/user/1"', async () => {
    const response = await request(app).post('/user/1')
    expect(response.statusCode).toBe(200)
    expect(response.body.userId).toBe('1')
  })

  test('It should response the GET method on "/posts/1/comments/2?sort=date&filter=false"', async () => {
    const response = await request(app).get('/posts/1/comments/2?sort=date&filter=false')
    expect(response.statusCode).toBe(200)
    expect(response.body.postId).toBe('1')
    expect(response.body.commentId).toBe('2')
    expect(response.body.sortedBy).toBe('date')
    expect(response.body.filtered).toBe('false')
  })
})
