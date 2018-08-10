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
const router = jsonServer.router(base)
server.use(router)

router.render = (req, res) => {
  console.log(res.locals.data)
  res.jsonp({
    data: res.locals.data,
    status: 0,
    msg: ''
  })
}

server.listen(9090, () => {
  console.log('JSON Server is running')
})
