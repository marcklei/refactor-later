[![Build Status](https://travis-ci.com/marcklei/refactor-later.svg?branch=master)](https://travis-ci.com/marcklei/refactor-later)
[![Maintainability](https://api.codeclimate.com/v1/badges/4ca9acecbe97cf744377/maintainability)](https://codeclimate.com/github/marcklei/refactor-later/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/4ca9acecbe97cf744377/test_coverage)](https://codeclimate.com/github/marcklei/refactor-later/test_coverage)

Most importantly, here are the badges. :)

# @refactor-later/core

This is a fun repository to play around with node http.  
It is not its aim to be a production ready framework. If you are looking for a solid solution maybe try one of my favorites:

[Nest.js](https://nestjs.com/)  
If you love typescript and/or angular you will love it aswell.

[Fastify](https://www.fastify.io/)  
Currently the fastest lightweight framework around.

[Hapi.js](https://hapijs.com/)  
Lightweight and easy to configure.

[Express.js](http://expressjs.com/)  
And of course the good old express.

## Installation

`npm install @refactor-later`

## Usage

```javascript
const http = require('http')
const { createApp, prepareRoutes } = require('@refactor-later/core')

const PORT = process.env.port || 3000

const routes = prepareRoutes({
  GET: [
    {
      path: '/',
      handler: (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({ hello: 'world' }))
        res.end()
      }
    },
    {
      path: '/posts/:postId?sort=date',
      handler: (req, res) => {
        const { postId } = req.params
        const { sort } = req.query
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.write(JSON.stringify({ 
          postId,
          sort
        }))
        res.end()
      }
    }
  ]
})

const app = createApp({ routes })
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
```

## API

TBD

### createApp(config)
___

### prepareRoutes(routes)
___

### mergeRoutes(route1, routes2, ...)
___
