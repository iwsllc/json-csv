import index_default, { csv, csvBuffered, bufferedSync, stream, buffered, toCsv, toCsvStream, StringWriter } from '@iwsio/json-csv-node'
import { expect } from 'chai'

describe("ESM: Module exports", function() {
	it('should export defaults', function() {
		expect(index_default.buffered).to.be.a('function')
		expect(index_default.bufferedSync).to.be.a('function')
		expect(index_default.toCsv).to.be.a('function')
		expect(index_default.stream).to.be.a('function')
		expect(index_default.toCsvStream).to.be.a('function')
		expect(index_default.StringWriter).to.be.a('function')

		// deprecated
		expect(index_default.csv).to.be.a('function')
		expect(index_default.csvBuffered).to.be.a('function')
	})

	it('should export individuals', function() {
		expect(buffered).to.be.a('function')
		expect(bufferedSync).to.be.a('function')
		expect(toCsv).to.be.a('function')
		expect(csvBuffered).to.be.a('function')
		expect(stream).to.be.a('function')
		expect(toCsvStream).to.be.a('function')
		expect(csv).to.be.a('function')
		expect(StringWriter).to.be.a('function')
	})
});

