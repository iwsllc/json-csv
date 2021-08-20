const StringWriter = require('../src/string-writer')
const should = require('should')
const {Readable} = require('stream')

describe('BufferedWriter', function() {
  describe('utf8 encoding', function() {
    before(function(done) {
      async function * generateReadableChunk() {
        yield Buffer.from('abcd', 'utf8')
      }
      this.result = ''
      let writer = new StringWriter({defaultEncoding: 'utf8'})
      Readable.from(generateReadableChunk())
        .pipe(writer)
        .on('error', done)
        .on('finish', () => {
          this.result = writer.data
          done()
        })
    })
    it('should work', function() { this.result.should.equal('abcd') })
  })
  describe('hex encoding', function() {
    before(function(done) {
      async function * generateReadableChunk() {
        yield Buffer.from('abcd', 'utf8')
      }
      this.result = ''
      let writer = new StringWriter({defaultEncoding: 'hex'})
      Readable.from(generateReadableChunk())
        .pipe(writer)
        .on('error', done)
        .on('finish', () => {
          this.result = writer.data
          done()
        })
    })
    it('should work', function() { this.result.should.equal('61626364') })
  })
})
