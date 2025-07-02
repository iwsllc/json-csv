import 'should'

import { toCsv } from '@iwsio/json-csv-node'

describe('ESM: No Header Row', function () {
	return it('should not contain a header', function (done) {
		const items = [
			{ k: 'foo' },
			{ k: 'bar' }
		]
		toCsv(items, {
			ignoreHeader: true,
			fields: [{ name: 'k' }] // Label not needed
		}, function (err, csv) {
			csv.should.equal('foo\r\nbar\r\n')
			return done()
		})
	})
})
