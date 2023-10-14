import { buffered } from '@iwsio/json-csv-node'
import 'should'

describe('ESM: Issue 21', function() {
	describe('When exporting a column, concatenated from two source fields', function() {
		before(function(done) {
			this.items = [{ a: 'first', b: 'second' }, { a: 'third', b: 'fourth' }, { a: 'fifth', b: 'sixth' }]
			buffered(this.items, {
				fields: [
					{
						name: 'this',
						label: 'c',
						filter(v) {
							return `${(v != null ? v.a : undefined)}${(v != null ? v.b : undefined)}`
						}
					}
				]
			}, (err, csv) => {
				this.csv = csv
				return this.err = err
			})
			return done()
		})

		it('should export concatenated a and b', function() { return this.csv.should.equal('c\r\nfirstsecond\r\nthirdfourth\r\nfifthsixth\r\n') })
	})
})
