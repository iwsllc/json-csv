import { toCsv } from '@iwsio/json-csv-node';
import "should";

describe("ESM: OR || operator", function() {
	it("should merge column1, 2 or 3 into combinedCol (from 2 to single column two entries)", function(done) {
		const arrayItems = [
			{ column1 : 'foo1'},
			{ column2 : 'foo2'} ]; //--> all 2 columns should be merged one column 'combinedCol'

		toCsv(arrayItems, { fields: [ { name : 'column1||column2', label : 'combinedCol' } ] }, function(err,csv){
			csv.should.equal('combinedCol\r\nfoo1\r\nfoo2\r\n');
			return done();
		});
	});

	it("should use column1, 2 or 3 into combinedCol (from 3 to single columns 3 entries)", function(done) {
		const arrayItems = [
			{ column1 : 'foo1'},
			{ column2 : 'foo2'},
			{ column3 : 'foo3'} ]; //--> all 3 columns should be merged one column 'combinedCol'

		toCsv(arrayItems, { fields: [ { name : 'column1||column2||column3', label : 'combinedCol' } ] }, function(err,csv){
			csv.should.equal('combinedCol\r\nfoo1\r\nfoo2\r\nfoo3\r\n');
			return done();
		});
	});

	it("should merge column1, 2 or 3 into combinedCol and then parse others (from 3 to single column with other columns)", function(done) {
		const arrayItems = [
			{ column1 : 'foo1', otherData: 'baz1'},
			{ column1 : 'fooIgnored', column2 : 'foo2', otherData: 'baz2'},
			{ column3 : 'foo3', otherData: 'baz3', anotherData: 'daz3'} ]; //--> should merge column1, 2 and 3 and parse others normally 'combinedCol'

		toCsv(arrayItems, { fields: [
			{ name : 'column1||column2||column3', label : 'combinedCol' },
			{ name : 'otherData', label : 'otherColumn' },
			{ name : 'anotherData', label : 'anotherColumn' } ], fieldSeparator : ';'}, function(err,csv){
			csv.should.equal('combinedCol;otherColumn;anotherColumn\r\nfoo1;baz1;\r\nfoo2;baz2;\r\nfoo3;baz3;daz3\r\n');
			return done();
		});
	});

	return it("should merge column1, 2 or 3 into combinedCol ignoring empty column (from 3 to single column with other columns)", function(done) {
		const arrayItems = [
			{ column1 : 'foo1', otherData: 'baz1'},
			{ column1 : 'fooIgnored', column2 : 'foo2', otherData: 'baz2'},
			{ column2 : '', column3 : 'foo3', otherData: 'baz3'}, //--> will ignore empty column value
			{ column3 : 'foo4', otherData: 'baz4', anotherData: 'daz4'} ]; //--> will parse normaly

		toCsv(arrayItems, { fields: [
			{ name : 'column1||column2||column3', label : 'combinedCol' },
			{ name : 'otherData', label : 'otherColumn' },
			{ name : 'anotherData', label : 'anotherColumn' } ], fieldSeparator : ';'}, function(err,csv){
			csv.should.equal('combinedCol;otherColumn;anotherColumn\r\nfoo1;baz1;\r\nfoo2;baz2;\r\nfoo3;baz3;\r\nfoo4;baz4;daz4\r\n');
			return done();
		});
	});
});
