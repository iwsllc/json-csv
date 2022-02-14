const StringWriter = require('../src/string-writer')
const { Readable } = require('stream')
const { expect } = require('chai')

describe('BufferedWriter', function() {
  describe('utf8 encoding', function() {
    before(function(done) {
      async function * generateReadableChunk() {
        yield Buffer.from('abcd', 'utf8')
      }
      this.result = ''
      const writer = new StringWriter({ defaultEncoding: 'utf8' })
      Readable.from(generateReadableChunk())
        .pipe(writer)
        .on('error', done)
        .on('finish', () => {
          this.result = writer.data
          done()
        })
    })
    it('should work', function() { expect(this.result).to.equal('abcd') })
  })
  describe('hex encoding', function() {
    before(function(done) {
      async function * generateReadableChunk() {
        yield Buffer.from('abcd', 'utf8')
      }
      this.result = ''
      const writer = new StringWriter({ defaultEncoding: 'hex' })
      Readable.from(generateReadableChunk())
        .pipe(writer)
        .on('error', done)
        .on('finish', () => {
          this.result = writer.data
          done()
        })
    })
    it('should work', function() { expect(this.result).to.equal('61626364') })
  })
})
