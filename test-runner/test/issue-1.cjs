const jsoncsv = require('@iwsio/json-csv-node')
require('should')

describe('Issue 1', function() {
	it('should contain a final endquote', function(done) {
		const items = [{ s: 'foo "bar"' }] // --> this should be turned into "foo ""bar"""
		jsoncsv.buffered(items, { fields: [{ name: 's', label: 's' }] }, function(err, csv) {
			csv.should.equal('s\r\n"foo ""bar"""\r\n')
			done()
		})
	})
})
