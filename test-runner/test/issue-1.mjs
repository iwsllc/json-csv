import { buffered } from '@iwsio/json-csv-node'
import 'should'

describe('ESM: Issue 1', function () {
	it('should contain a final endquote', function (done) {
		const items = [{ s: 'foo "bar"' }] // --> this should be turned into "foo ""bar"""
		buffered(items, { fields: [{ name: 's', label: 's' }] }, function (err, csv) {
			csv.should.equal('s\r\n"foo ""bar"""\r\n')
			done()
		})
	})
})
