"use strict"

import queryString from "query-string"
import _ from "lodash"
import Mock from "mockjs"
import config from "./config"

var request = {}

request.get = function(url, params) {
  if (params) {
    url += "?" + queryString.stringify(params)
  }
  return fetch(url)
    .then((res) => (res.json()))
    .then((res) => (Mock.mock(res)))
}

request.post = function(url, body) {
  var options = _.extend(config.header, {
    body: JSON.stringify(body)
  })
  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => Mock.mock(res))
}

export default request