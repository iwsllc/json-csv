var exporter = require('./exporter')

module.exports = {
  csv : function(options) {
    return new exporter().csv(options)
  }
  ,csvBuffered : function(data, options, done) {
    return new exporter().csvBuffered(data,options, done)
  }
}
