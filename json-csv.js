var Readable = require("stream").Readable

var exporter = function() {
  this.stream = null
}

exporter.prototype.prepValue = function(arg, forceQuoted) {
  var quoted = forceQuoted || arg.indexOf('"') >= 0 || arg.indexOf(',') >= 0
  var result = arg.replace(/\"/g,'""')
  if (quoted)
    result = '"' + result + '"'
  return result
}

exporter.prototype.createReadStream = function(opts) {
  this.stream = new Readable
  this._toCSV(opts)
  return this.stream
}

exporter.prototype.toCSV = function(args, callback) {
  var s = this.createReadStream(args)
  var result = ''
  var buffer = null;
  s.on('readable', function() {
    buffer = s.read()
    if (buffer !== null)
      result += buffer
  })
  s.on('end', function() {
    callback(null, result)
  })
}

exporter.prototype._toCSV = function(args) {
  var flatString = ''
  var ix = 0
  for(ix=0;ix<args.fields.length;ix++) {
    var item = args.fields[ix]
    var label = item.label || item.field
    if (ix > 0)
      flatString += ','

    flatString += this.prepValue(label)
  }
  for (ix=0;ix<args.data.length;ix++) {
    flatString += '\r\n'
    this.stream.push(flatString)
    flatString = ''
    for(var jx = 0;jx<args.fields.length; jx++) {
      if (jx > 0)
        flatString += ','
      var data = args.data[ix]
      var field = args.fields[jx]
      var val = this.getValue(data, field.name)
      if (field.filter) {
        val = field.filter(val)
      }
      if (typeof val !== 'undefined' && val !== null) {
        var quoted = typeof field.quoted !== 'undefined' && field.quoted
        flatString += this.prepValue(val.toString(), quoted)
      }
    }
  }
  flatString += '\r\n'
  this.stream.push(flatString)
  this.stream.push(null)
}

exporter.prototype.getValue = function(data, arg) {
  var args = arg.split('.')
  if (args.length > 0)
    return this.getValueIx(data, args, 0)
  return data[args[0]];
}

exporter.prototype.getValueIx = function(data, args, ix) {
  var val = data[args[ix]]
  if (typeof val === 'undefined')
    return ''

  if ((args.length-1) > ix)
    return this.getValueIx(val, args, ix+1);

  return val;
}

module.exports = new exporter()
