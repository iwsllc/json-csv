import { buffered } from '@iwsio/json-csv-node';
import "should";

describe("ESM: Issue 23", function() {
	describe("When excluding label definitions", function() {
		before(function(done) {
			this.items = [{a: "first", b: "second"}, {a: "third", b:"fourth"}, {a: "fifth", b: "sixth"}];
			buffered(this.items, {
				fields: [
					{name: "a", label: "a"},
					{name: "b"} // this is breaking (before fix)
				]}, (err, csv) => {
				this.csv = csv;
				this.err = err;
			});
			done();
		});

		it("should export a and b", function() { return this.csv.should.equal("a,b\r\nfirst,second\r\nthird,fourth\r\nfifth,sixth\r\n"); });
	});

	//also this issue came up (because of the first one)
	return describe("When exporting a column that resolves undefined in the data set", function() {
		before(function(done) {
			this.items = [{a: "first", b: "second"}, {a: "third", b:"fourth"}, {a: "fifth", b: "sixth"}];
			buffered(this.items, {
				fields: [
					{name: "a"},
					{name: "b"},
					{name: "c"} //breaking before fix
				]}, (err, csv) => {
				this.csv = csv;
				return this.err = err;
			});
			return done();
		});

		return it("should export a, b, and c", function() { return this.csv.should.equal("a,b,c\r\nfirst,second,\r\nthird,fourth,\r\nfifth,sixth,\r\n"); });
	});
});
