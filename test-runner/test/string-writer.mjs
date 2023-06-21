/* eslint-disable mocha/no-hooks-for-single-case */
import { StringWriter } from '@iwsio/json-csv-node'
import { Readable } from 'stream'
import { expect } from 'chai'

describe('ESM: BufferedWriter', function() {
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
	describe('comment example', function() {
		before(function(done) {
			const writer = new StringWriter({ defaultEncoding: 'utf8' })
			Readable.from(['1', '2', '3'])
				.pipe(writer)
				.on('error', done)
				.on('finish', () => {
					this.result = writer.data
					done()
				})
		})
		it('should work', function() { expect(this.result).to.equal('123') })
	})
})
