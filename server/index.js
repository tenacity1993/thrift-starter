const thrift = require('thrift')
const GetList = require('./thrift/gen-nodejs/GetList')
const PostList = require('./thrift/gen-nodejs/PostList')
const ttypes = require('./thrift/gen-nodejs/list_types')
const Item = require('./thrift/gen-nodejs/list_types').Item

const initial = require('./list')

console.log(initial)
let response = initial

const server = thrift.createServer(GetList, {
  ping: function (result) {
    console.log('server getlist ping()')
    result(null)
  },
  get: function (result) {
    console.log('get list in server: ')

    console.log('data: ', response.dataList)

    result(null, response)
  }
})

server.listen(3002)
