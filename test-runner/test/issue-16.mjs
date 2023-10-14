import { buffered } from '@iwsio/json-csv-node'
import 'should'

describe('ESM: Issue 16', function() {
	describe('When exporting flexible schema data that may include a null element in the data source', function() {
		before(function(done) {
			this.items = [{ s: 5, y: { a: 1, b: 2 } }, null, { x: 4 }, { s: 1, x: 3, y: { a: 3, b: 4 } }]
			buffered(this.items, { fields: [{ name: 's', label: 's' }, { name: 'x', label: 'x' }, { name: 'y.a', label: 'y_a' }] }, (err, csv) => {
				this.err = err
				this.csv = csv
				done()
			})
		})
		it('should export blanks for s and x', function() { this.csv.should.equal('s,x,y_a\r\n5,,1\r\n,,\r\n,4,\r\n1,3,3\r\n') })
	})
})
