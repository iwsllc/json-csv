const Exporter = require('./exporter')

const _exports = {
  Exporter,
  stream: function(options = {}, next) {
    options = { ...options, buffered: false }

    const transformer = new Exporter(options).stream()
    if (typeof next === 'function') { return next(null, transformer) }

    return transformer
  },
  buffered: function(data, options = {}, next) {
    options = { ...options, buffered: true }

    const promise = new Exporter(options).buffered(data)
    if (typeof next === 'function') {
      promise
        .then((result) => {
          next(null, result)
        })
        .catch((err) => { next(err) })
      return // NOTE: don't return promise; just make callback
    }

    return promise
  },

  // legacy
  csv: function(options = {}) {
    options = { ...options, buffered: false }
    return new Exporter(options).stream()
  },
  csvBuffered: function(data, options = {}, done) {
    options = { ...options, buffered: true }
    new Exporter(options).buffered(data)
      .then((result) => { done(null, result) })
      .catch((err) => { done(err) })
  }
}

// aliases
_exports.toCsv = _exports.buffered
_exports.toCsvStream = _exports.stream

module.exports = _exports
