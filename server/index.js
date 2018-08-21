const thrift = require('thrift')
const GetList = require('./thrift/gen-nodejs/GetList')
const ttypes = require('./thrift/gen-nodejs/list_types')
const Item = require('./thrift/gen-nodejs/list_types').Item

// 引入目录下的json文件数据作为初始值
const initial = require('./list')

let response = initial

const server = thrift.createServer(GetList, {
  ping: function (result) {
    console.log('server ping()')
    result(null)
  },
  get: function (result) {
    console.log('get list in server: ')
    result(null, response)
  },
  post: function (name, age, result) {
    console.log('post list in server: ', name, age)
    response.dataList.push(
        new Item({
          name, age
        })
    )
    result(null, response)
  }
})

server.listen(3002)

