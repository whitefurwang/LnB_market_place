const jsonServer = require('json-server')
const server = jsonServer.create()

const middleware = jsonServer.defaults()
server.use(middleware)

const _ = require('underscore')
const path = require('path')
const fs = require('fs')
const mockDir = path.join(__dirname, 'api')
const base = {}
const files = fs.readdirSync(mockDir)
files.forEach(function (file) {
  if (RegExp('.json$').test(file)) {
    _.extend(base, require(path.resolve(mockDir, file)))
  }
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('post')
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

const router = jsonServer.router(base)
server.use(router)

router.render = (req, res) => {
  console.log(res.locals.data)
  res.jsonp(res.locals.data)
}

server.listen(3000, () => {
  console.log('JSON Server is running')
})
