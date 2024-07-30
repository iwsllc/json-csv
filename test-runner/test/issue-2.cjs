const jsoncsv = require('@iwsio/json-csv-node')
require('should')

describe('Issue 2', function () {
	describe('When providing a filter function that returns null or undefined', function () {
		before(function (done) {
			this.items = [{ s: 5 }]
			jsoncsv.buffered(this.items, { fields: [{ name: 's', label: 's', filter: _v => undefined }] }, (err, csv) => {
				this.csv = csv
				this.err = err
				done()
			})
		})
		it('should filter before prepping the value', function () { this.csv.should.equal('s\r\n\r\n') })
		it('should not throw an error', function () { should.not.exist(this.err) })
	})
})
