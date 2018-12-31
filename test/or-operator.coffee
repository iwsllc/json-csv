jsoncsv = require '../index'
should = require "should"

describe "OR || operator", ->
	it "should merge column1, 2 or 3 into combinedCol (from 2 to single column two entries)", (done) ->
		arrayItems = [ 
			{ column1 : 'foo1'},
				{ column2 : 'foo2'} ]; #--> all 2 columns should be merged one column 'combinedCol'

		jsoncsv.csvBuffered arrayItems, { fields: [ { name : 'column1||column2', label : 'combinedCol' } ] }, (err,csv)->
			csv.should.equal 'combinedCol\r\nfoo1\r\nfoo2\r\n'
			done()

	it "should use column1, 2 or 3 into combinedCol (from 3 to single columns 3 entries)", (done) ->
		arrayItems = [ 
			{ column1 : 'foo1'},
				{ column2 : 'foo2'},
					{ column3 : 'foo3'} ]; #--> all 3 columns should be merged one column 'combinedCol'

		jsoncsv.csvBuffered arrayItems, { fields: [ { name : 'column1||column2||column3', label : 'combinedCol' } ] }, (err,csv)->
			csv.should.equal 'combinedCol\r\nfoo1\r\nfoo2\r\nfoo3\r\n'
			done()

	it "should merge column1, 2 or 3 into combinedCol and then parse others (from 3 to single column with other columns)", (done) ->
		arrayItems = [ 
			{ column1 : 'foo1', otherData: 'baz1'},
				{ column1 : 'fooIgnored', column2 : 'foo2', otherData: 'baz2'},
					{ column3 : 'foo3', otherData: 'baz3', anotherData: 'daz3'} ]; #--> should merge column1, 2 and 3 and parse others normally 'combinedCol'

		jsoncsv.csvBuffered arrayItems, { fields: [ 
			{ name : 'column1||column2||column3', label : 'combinedCol' },
				{ name : 'otherData', label : 'otherColumn' },
					{ name : 'anotherData', label : 'anotherColumn' } ], fieldSeparator : ';'}, (err,csv)->
			csv.should.equal 'combinedCol;otherColumn;anotherColumn\r\nfoo1;baz1;\r\nfoo2;baz2;\r\nfoo3;baz3;daz3\r\n'
			done()
