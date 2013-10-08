exports.toCSV = function(args, callback) {
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
    for(var jx = 0;jx<args.fields.length; jx++) {
      if (jx > 0)
        flatString += ','
      var data = args.data[ix]
      var field = args.fields[jx]
      var val = this.getValue(data, field.name)
      if (val) {
        if (field.filter) {
          val = field.filter(val)
        }
        var quoted = typeof field.quoted !== 'undefined' && field.quoted
        flatString += this.prepValue(val.toString(), quoted)
      }
    }
  }
  flatString += '\r\n'
  callback(null, flatString)
}

exports.getValue = function(data, arg) {
  var args = arg.split('.')
  if (args.length > 0)
    return getValue(data, args, 0)
  return data[args[0]];
}

var getValue = function(data, args, ix) {
  var val = data[args[ix]]
  if (typeof val === 'undefined')
    return ''

  if ((args.length-1) > ix)
    return getValue(val, args, ix+1);

  return val;
}

exports.prepValue = function(arg, forceQuoted) {
  var quoted = forceQuoted || arg.indexOf('"') >= 0 || arg.indexOf(',') >= 0
  var result = arg.replace('"','""')
  if (quoted)
    result = '"' + result + '"'
  return result
}