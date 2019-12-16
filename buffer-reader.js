const { Readable } = require('stream');

module.exports = function(sourceArray) {
  if (typeof Readable.from === "function")
    return Readable.from(sourceArray)

  //do it ourselves
  return new Readable({
    objectMode: true
    ,read(size) {
      sourceArray.forEach(s => this.push(s))
      this.push(null)
    }
  })
}
