var es     = require('event-stream');
var _      = require("lodash")
var concat = require('concat-stream')

var exporter = function(options) {
  this.options = options || {}
  this.fieldSeparator = this.options.fieldSeparator || ',';
}

exporter.prototype.csvBuffered = function(data, options, done) {
  if (!data) throw new Error("No data provided.")

  if(typeof options == 'function')
  {
    done = options
    options = {}
  }

  es.readArray(data)
    .pipe(this.csv(options))
    .pipe(concat(function(buffer) {
      done(null, buffer)
    }))
}
exporter.prototype.csv = function(options) {
  var writtenHeader = false
  this.options = options || {}
  this.fieldSeparator = this.options.fieldSeparator || ',';
  var self = this;

  return es.through(function write(data) {
    if (!writtenHeader)
    {
      this.emit('data', self.getHeaderRow())
      writtenHeader = true
    }
    this.emit('data', self.getBodyRow(data))
  })
}

exporter.prototype.prepValue = function(arg, forceQuoted) {
  var quoted = forceQuoted || arg.indexOf('"') >= 0 || arg.indexOf(this.fieldSeparator) >= 0 || arg.indexOf('\n') >= 0
  var result = arg.replace(/\"/g,'""')
  if (quoted)
    result = '"' + result + '"'
  return result
}

exporter.prototype.getHeaderRow = function() {
  var self = this
  var header = _.reduce(self.options.fields, function(line, field) {
    var label = field.label || field.name
    if (line === 'START') {
      line = '';
    } else {
      line += self.fieldSeparator
    }
    line += self.prepValue(label)
    return line
  }, 'START')
  header += '\r\n'
  return header
}

exporter.prototype.getBodyRow = function(data) {
  var self = this
  var row = _.reduce(this.options.fields, function(line, field) {
    if (line === 'START') {
      line = '';
    } else {
      line += self.fieldSeparator
    }
    var val = self.getValue(data, field.name)
    if (field.filter) {
      val = field.filter(val)
    }
    if (typeof val !== 'undefined' && val !== null) {
      var quoted = typeof field.quoted !== 'undefined' && field.quoted
      line += self.prepValue(val.toString(), quoted)
    }
    return line
  }, 'START', self)

  row += '\r\n'
  return row
}

exporter.prototype.getValue = function(data, arg) {
  var args = arg.split('.')
  if (args.length > 0)
    return this.getValueIx(data, args, 0)
  return ""
}

exporter.prototype.getValueIx = function(data, args, ix) {
  if (!data)
    return ''

  //for filtered fields using the whole row as a source.
  //`this` is a keyword here; hoping not to conflict with existing fields.
  if (args[0] === "this")
    return data

  var val = data[args[ix]]
  if (typeof val === 'undefined')
    return ''

  //walk the dot-notation recursively to get the remaining values.
  if ((args.length-1) > ix)
    return this.getValueIx(val, args, ix+1);

  return val;
}

module.exports = exporter
