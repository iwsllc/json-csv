const { Transform } = require('stream')
const { buffered, getHeaderRow, getBodyRow, checkOptions } = require('@iwsio/json-csv-core')

class Exporter {
  constructor(opts) {
    this.options = checkOptions(opts)
    this.toCsv = this.buffered // cosmetic alias
  }

  buffered(data) {
    return new Promise((resolve, reject) => {
      try {
        const result = buffered(data, this.options)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  stream() {
    let writtenHeader = false
    const options = this.options
    const { ignoreHeader, fields, encoding } = options

    const transformer = new Transform({
      writableObjectMode: true,
      transform(chunk, _encoding, callback) {
        // debug(`incoming chunk: ${require('util').inspect(chunk)}`)
        // debug(encoding)
        if (!writtenHeader && !ignoreHeader) {
          writtenHeader = true
          const header = getHeaderRow(fields, options.fieldSeparator)
          // debug(`writing header ${header}`)
          this.push(header)
        }
        const row = getBodyRow(chunk, fields, options.fieldSeparator)
        // debug(`writing row ${require("util").inspect(row)}`)
        this.push(row)
        callback()
      }
    })
    transformer.setEncoding(encoding)
    return transformer
  }
}

module.exports = Exporter
