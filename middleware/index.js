const Koa = require('koa')
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')()
// 添加跨域支持
const cors = require('koa2-cors')

const bodyParser = require('koa-body')
const thrift = require('thrift')
const GetList = require('./thrift/gen-nodejs/GetList')
const ttypes = require('./thrift/gen-nodejs/list_types')

// 封装创建连接的函数
const createConnection = require('./createConnection').createConnection

const connection = createConnection()

let client = thrift.createClient(GetList, connection)

const app = new Koa()

app.use(cors())
app.use(bodyParser())


app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})

router.get('/getlist', async (ctx, next) => {
  // 建立与server端的连接
  // let connection = thrift.createConnection('localhost', 3002, {
  //   transport: transport,
  //   protocol: protocol
  // })
  //
  // connection.on('error', function (err) {
  //   assert(false, err)
  // })

  client.ping(function (err, response) {
    console.log('middleware get ping()')
  })

  ctx.response.body = await new Promise(resolve => {
    client.get((err, response) => {
      console.log('get list from server: ', response)
      resolve(response)
    })
  })
})

router.post('/', async (ctx, next) => {

  let name = ctx.request.body.name || '',
      age = ctx.request.body.age || 0
  console.log(`add new item: ${name}  ${age}`)

  client.ping(function (err, response) {
    console.log('middleware post ping()')
  })

  ctx.response.body = await new Promise(resolve => {
    client.post(name, age, (err, response) => {
      console.log('post list from middleware: ', name, age)
      resolve(response)
    })
  })
})


app.use(router.routes())

app.listen(3001)
