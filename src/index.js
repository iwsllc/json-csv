const Exporter = require('./exporter')

module.exports = {
  Exporter,
  stream: function(options = {}, next) {
    options = {...options, buffered: false}

    let transformer = new Exporter(options).stream()
    if (typeof next === 'function') { return next(null, transformer) }

    return transformer
  },
  buffered: function(data, options = {}, next) {
    options = {...options, buffered: true}

    let promise = new Exporter(options).buffered(data)
    if (typeof next === 'function') {
      return promise
        .then((result) => {
          next(null, result)
        })
        .catch((err) => { next(err) })
    }

    return promise
  },

  // legacy
  csv: function(options = {}) {
    options = {...options, buffered: false}
    return new Exporter(options).stream()
  },
  csvBuffered: function(data, options = {}, done) {
    options = {...options, buffered: true}
    new Exporter(options).buffered(data)
      .then((result) => { done(null, result) })
      .catch((err) => { done(err) })
  },
}
