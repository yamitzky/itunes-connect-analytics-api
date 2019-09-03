const express = require('express')
const itc = require('itunesconnectanalytics')
const program = require('commander')

const handlers = require('./handlers')

program.option('--appleId [appleId]', 'Apple ID to login')
program.option('--password [password]', 'password to login')
program.option('--host [host]', 'host to listen')
program.option('--port [port]', 'port to listen')

const appleId = program.appleId || process.env.APPLE_ID
const password = program.password || process.env.PASSWORD
const host = program.host || process.env.HOST || '0.0.0.0'
const port = program.port || process.env.PORT || 3000

const authorizer = () => {
  return new itc.Itunes(appleId, password,
  {
    errorCallback: (e) => {
      console.log('Error logging in: ' + e);
    },
    successCallback: (d) => {
      console.log('Logged in');
    }
  })
}

const app = express()
app.get('/query', handlers.queryHandler(authorizer))
app.get('/', (req, res) => {
  res.send({health: 'ok'})
})
app.listen(port, host, () => {
  console.log('Standby...')
})
