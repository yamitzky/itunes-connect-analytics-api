//const express = require('express')
const itc = require('itunesconnectanalytics')
const program = require('commander')

const handlers = require('./handlers')

program.option('--appleId [appleId]', 'Apple ID to login')
program.option('--password [password]', 'password to login')
program.option('--app [app]', 'Found in My Apps -> App -> Apple ID or read below on getting the app id.')
program.option('--type [type]', 'There are two query types. One is metrics and the other is sources')
program.option('--time [time]', 'first parameter of json table, number')
program.option('--timetype [timetype]', 'second parameter of json table, for example years, days,')
program.option('--measure [measure]', 'json table')
program.parse(process.argv);
//program.option('--host [host]', 'host to listen')
//program.option('--port [port]', 'port to listen')

const appleId = program.appleId || process.env.APPLE_ID
const password = program.password || process.env.PASSWORD
const app = program.app || process.env.APP
const type = program.type || process.env.TYPE
const time = program.time || process.env.TIME
const timetype = program.timetype || process.env.TIMETYPE
const measure = program.measure || process.env.MEASURE
//const host = program.host || process.env.HOST || '0.0.0.0'
//const port = program.port || process.env.PORT || 3000

const authorizer = () => {
  return new itc.Itunes(appleId, password,
  {
    errorCallback: (e) => {
      //console.log('Error logging in: ' + e);
    },
    successCallback: (d) => {
      //console.log('Logged in');
    }
  })
}

handlers.queryHandler(authorizer,app,type,time,timetype,JSON.parse(measure))
