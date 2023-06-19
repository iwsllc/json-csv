const jsoncsv = require('@iwsio/json-csv-node');
require('should');

describe('No Header Row', function() { return it('should not contain a header', function(done) {
	const items = [
		{ k: 'foo' },
		{ k: 'bar' }
	];
	jsoncsv.toCsv(items, {
		ignoreHeader: true,
		fields: [ { name: 'k' } ]  // Label not needed
	}, function(err, csv) {
		csv.should.equal('foo\r\nbar\r\n');
		return done();
	});
}); });
