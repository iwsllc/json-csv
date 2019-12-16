const concat      = require('concat-stream')
const {Transform, Readable} = require("stream")
const _get = require("lodash/get")
const _defaults = require("lodash/defaults")
const _assignIn = require("lodash/assignIn")
const _reduce = require("lodash/reduce")
const debug = require("debug")("json-csv:exporter")
const bufferReader = require("./buffer-reader")

class CsvExporter {
  constructor(options) {
    this.options = _defaults(options || {}, {
      fieldSeparator: ","
      ,ignoreHeader: false
      ,buffered: true
      ,fields: []
      ,encoding: "utf8"
    })
  }

  //alias
  buffered(data) {
    return new Promise((resolve, reject) => {
      let readable = bufferReader(data.map(d => d === null ? {} : d))
        .pipe(this.stream())
      readable.on("error", reject)
      readable.pipe(concat(function(finalBuffer) {resolve(finalBuffer)}))
    })
  }

  stream() {
    let writtenHeader = false
    let {fieldSeparator, ignoreHeader, fields, encoding} = this.options
    let self = this

    let transformer = new Transform({
      writableObjectMode: true,
      transform(chunk, encoding, callback) {
        debug(`incoming chunk: ${require('util').inspect(chunk)}`)
        debug(encoding)
        if (!writtenHeader && !ignoreHeader)
        {
          writtenHeader = true
          let header = self.getHeaderRow(fields)
          debug(`writing header ${header}`)
          this.push(header)
        }
        let row = self.getBodyRow(chunk, fields)
        debug(`writing row ${require("util").inspect(row)}`)
        this.push(row)
        callback()
      }
    })
    transformer.setEncoding(encoding)
    return transformer
  }
  prepValue(arg, forceQuoted) {
    var quoted = forceQuoted || arg.indexOf('"') >= 0 || arg.indexOf(this.options.fieldSeparator) >= 0 || arg.indexOf('\n') >= 0
    var result = arg.replace(/\"/g,'""')
    if (quoted)
      result = '"' + result + '"'
    return result
  }
  getHeaderRow(fields) {
    var header = _reduce(fields, (line, field) => {
      var label = field.label || field.name
      if (line === 'START') {
        line = '';
      } else {
        line += this.options.fieldSeparator
      }
      line += this.prepValue(label)
      return line
    }, 'START')
    header += '\r\n'
    return header
  }
  getBodyRow(data, fields) {
    let reducer = (line, field) => {
      if (line === 'START') {
        line = '';
      } else {
        line += this.options.fieldSeparator
      }
      var val = this.getValue(data, field.name)
      // vinicioslc support to OR || operator  allowing multiples names to the same column
      // the code will use the last non null and non empty value
      if (field.name.includes('||')) {
        // by default column is empty
        val = ''
        let fields = field.name.split('||');
        // for each alternative
        fields.forEach(field => {
          // get value and associate
          let fieldVal = this.getValue(data, field)
          // remove whitespaces and check if non null before assign
          if (typeof val !== 'undefined' && val !== null && fieldVal.trim().length > 0 && fieldVal.trim() != "") {
            val = fieldVal
          }
          //do this for every field
        });
      }

      if (field.filter) {
        val = field.filter(val)
      }
      if (typeof val !== 'undefined' && val !== null) {
        var quoted = typeof field.quoted !== 'undefined' && field.quoted
        line += this.prepValue(val.toString(), quoted)
      }
      return line
    }

    var row = fields.reduce(reducer, "START")
    row += '\r\n'
    return row
  }
  getValue(data, arg) {
    var args = arg.split('.')
    if (args.length > 0)
      return this.getValueIx(data, args, 0)
    return ""
  }
  getValueIx(data, args, ix) {
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
}

module.exports = CsvExporter
