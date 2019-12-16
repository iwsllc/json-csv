const Exporter  = require('./exporter')
const _assignIn = require("lodash/assignIn")

module.exports = {
  Exporter
  ,stream: function(options = {}, next) {
    _assignIn(options, {buffered: false})

    let transformer = new Exporter(options).stream()
    if (typeof next === "function")
      return next(null, transformer)

    return transformer
  }
  ,buffered: function(data, options = {}, next) {
    _assignIn(options, {buffered: true})

    let promise = new Exporter(options).buffered(data)
    if (typeof next === "function")
      return promise
        .then((result) => {
          next(null, result)
        })
        .catch((err) => {next(err)})

    return promise
  }


  //legacy
  ,csv: function(options = {}) {
    _assignIn(options, {buffered: false})
    return new Exporter(options).stream()
  }
  ,csvBuffered: function(data, options = {}, done) {
    _assignIn(options, {buffered: true})
    new Exporter(options).buffered(data)
      .then((result) => {done(null, result)})
      .catch((err) => {done(err)})
  }
}
