const Koa = require('koa')
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')()
const cors = require('koa2-cors')

const bodyParser = require('koa-body')
const thrift = require('thrift')
const GetList = require('./thrift/gen-nodejs/GetList')
const PostList = require('./thrift/gen-nodejs/PostList')
const ttypes = require('./thrift/gen-nodejs/list_types')
const assert = require('assert')

let transport = thrift.TBufferedTransport
let protocol = thrift.TBinaryProtocol

const app = new Koa()

app.use(cors())
app.use(bodyParser())


app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})

let list = [{
  name: 'Jack', age: 18
}]

router.get('/getlist', async (ctx, next) => {
  // 建立与server端的连接
  let connection = thrift.createConnection('localhost', 3002, {
    transport: transport,
    protocol: protocol
  })

  connection.on('error', function (err) {
    assert(false, err)
  })

  let client = thrift.createClient(GetList, connection)

  client.ping(function (err, response) {
    console.log('middleware ping()')
  })

  ctx.response.body = await new Promise(resolve => {
    client.get((err, response) => {
      console.log('get list from server: ', response)
      resolve(response)
    })
  })

  // let name = ctx.request
  // console.log(111, name)
  // ctx.response.body = JSON.stringify({code: 200, data: list})
})

router.post('/', async (ctx, next) => {
  let name = ctx.request.body.name || '',
      age = ctx.request.body.age || 0
  console.log(`${name}  ${age}`)
  list.push({name: name, age: age})
  ctx.response.body = JSON.stringify({code: 200, data: list})
})


app.use(router.routes())

app.listen(3001)
