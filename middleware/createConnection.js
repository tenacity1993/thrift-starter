const thrift = require('thrift')
const assert = require('assert')

exports.createConnection = function () {
  let transport = thrift.TBufferedTransport
  let protocol = thrift.TBinaryProtocol

  const connection = thrift.createConnection('localhost', 3002, {
    transport: transport,
    protocol: protocol
  })

  connection.on('error', function (err) {
    assert(false, err)
  })

  return connection
}


