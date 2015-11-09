jsoncsv = require '../index'
should = require "should"

describe "Issue 16", ->
  describe "When exporting flexible schema data that may include a null element in the data source", ->
    before (done) ->
      @items = [{s: 5, y: {a: 1, b: 2}}, null, {x: 4}, {s: 1, x: 3, y: {a: 3, b: 4}}]
      jsoncsv.csvBuffered @items, {fields: [{name: 's', label: 's'}, {name: 'x', label: 'x'}, {name: 'y.a', label: 'y_a'}]}, (err, csv) =>
        @csv = csv
        @err = err
        done()

    it "should export blanks for s and x", -> @csv.should.equal "s,x,y_a\r\n5,,1\r\n,,\r\n,4,\r\n1,3,3\r\n"
